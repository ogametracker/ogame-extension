import { ExpeditionEvent, ExpeditionFindableShipType, ExpeditionFindableShipTypes } from '@/shared/models/expeditions/ExpeditionEvents';
import { MessageType } from '@/shared/messages/MessageType';
import { NewExpeditionMessage } from '@/shared/messages/tracking/expeditions';
import { Message, MessageOgameMeta } from '@/shared/messages/Message';
import { GlobalOgameMetaData } from './global';
import { Component, Vue } from 'vue-property-decorator';
import { startOfDay } from 'date-fns';
import { ogameMetasEqual } from '@/shared/ogame-web/ogameMetasEqual';
import { getPlayerDatabase } from '@/shared/db/access';
import { ResourceType, ResourceTypes } from '@/shared/models/ogame/resources/ResourceType';
import { ExpeditionEventType, ExpeditionEventTypes } from '@/shared/models/expeditions/ExpeditionEventType';
import { ItemHash } from '@/shared/models/ogame/items/ItemHash';
import { ExpeditionEventSize, ExpeditionEventSizes } from '@/shared/models/expeditions/ExpeditionEventSize';
import { ShipByTypes } from '@/shared/models/ogame/ships/ShipTypes';
import { multiplyCost } from '@/shared/models/ogame/common/Cost';
import { createRecord } from '@/shared/utils/createRecord';
import { ExpeditionDepletionLevel, ExpeditionDepletionLevels } from '@/shared/models/expeditions/ExpeditionDepletionLevel';
import { UniversesAndAccountsDataModule } from './UniversesAndAccountsDataModule';

export interface DailyExpeditionResult {
    date: number;
    events: Record<ExpeditionEventType, number>;
    findings: {
        resources: Record<ResourceType, number>;
        resourceCount: Record<ResourceType, number>;
        fleet: Record<ExpeditionFindableShipType, number>;
        fleetResourceUnits: Record<ResourceType, number>;
        darkMatter: number;
        items: ItemHash[];
    };
    eventSizes: {
        resources: Record<ExpeditionEventSize, number>;
        resourceCount: Record<ResourceType, Record<ExpeditionEventSize, number>>;
        fleet: Record<ExpeditionEventSize, number>;
        darkMatter: Record<ExpeditionEventSize, number>;
    };
    depletion: Record<ExpeditionDepletionLevel | 'unknown', number>;
}

@Component
class ExpeditionDataModuleClass extends Vue {
    public dailyResults: Partial<Record<number, DailyExpeditionResult>> = {};
    private internal_firstDate: number | null = null;
    private internal_count = 0;

    private _ready!: Promise<void>;
    private _resolveReady!: () => void;

    public get ready(): Promise<void> {
        return this._ready;
    }

    public get count() {
        return this.internal_count;
    }

    public get dailyResultsArray(): DailyExpeditionResult[] {
        return Object.values(this.dailyResults) as DailyExpeditionResult[];
    }

    private async created() {
        this._ready = new Promise<void>(async resolve => this._resolveReady = resolve);

        this.initCommunication();
        await this.loadData();
    }

    private async loadData() {
        await this.$nextTick();

        const expeditions = await this.getRawData();

        let minDate: number | null = null;
        expeditions.forEach(expedition => {
            this.addExpeditionToDailyResult(expedition);

            minDate = Math.min(minDate ?? Number.MAX_SAFE_INTEGER, expedition.date);
        });
        this.internal_firstDate = minDate;
        
        this._resolveReady();
    }

    public async getRawData(): Promise<ExpeditionEvent[]> {
        await UniversesAndAccountsDataModule.ready;

        const la = UniversesAndAccountsDataModule.currentAccount.linkedAccounts ?? [];
        const linkedAccounts = la.map<MessageOgameMeta>(acc => ({
            playerId: acc.id,
            language: acc.serverLanguage,
            serverId: acc.serverId,
            userLanguage: 'doesnt-matter',
        }));
        const accounts: MessageOgameMeta[] = [
            GlobalOgameMetaData,
            ...linkedAccounts,
        ];

        const rawExpeditions: ExpeditionEvent[] = [];
        for (const account of accounts) {
            const db = await getPlayerDatabase(account);

            const expeditions = await db.getAll('expeditions');
            rawExpeditions.push(...expeditions);
        }
        return rawExpeditions;
    }


    private addTimeout: number | undefined = undefined;
    private addExpos: ExpeditionEvent[] = [];

    private addExpeditionToDailyResult_delayed(expo: ExpeditionEvent) {
        this.addExpos.push(expo);

        clearTimeout(this.addTimeout);
        this.addTimeout = setTimeout(() => {
            const addExpos = this.addExpos;
            this.addExpos = [];
            addExpos.forEach(expo => this.addExpeditionToDailyResult(expo));
        }, 500);
    }

    private addExpeditionToDailyResult(expedition: ExpeditionEvent) {
        this.internal_count++;

        const day = startOfDay(expedition.date).getTime();

        let dailyResult = this.dailyResults[day];
        if (dailyResult == null) {
            dailyResult = this.getNewDailyResult(day);
            this.$set(this.dailyResults, day, dailyResult);
        }

        const mappedType = ({
            [ExpeditionEventType.aliens]: ExpeditionEventType.combat,
            [ExpeditionEventType.pirates]: ExpeditionEventType.combat,
        } as Partial<Record<ExpeditionEventType, ExpeditionEventType>>)[expedition.type] ?? expedition.type;

        dailyResult.events[mappedType]++;
        dailyResult.depletion[expedition.depletion ?? 'unknown']++;

        switch (expedition.type) {
            case ExpeditionEventType.resources: {
                const resource = ResourceTypes.find(res => expedition.resources[res] > 0);

                dailyResult.eventSizes.resources[expedition.size]++;

                for (const resource of ResourceTypes) {
                    dailyResult.findings.resources[resource] += expedition.resources[resource];
                }

                if (resource != null) {
                    dailyResult.eventSizes.resourceCount[resource][expedition.size]++;
                    dailyResult.findings.resourceCount[resource]++;
                }
                break;
            }

            case ExpeditionEventType.darkMatter: {
                dailyResult.eventSizes.darkMatter[expedition.size]++;
                dailyResult.findings.darkMatter += expedition.darkMatter;
                break;
            }

            case ExpeditionEventType.item: {
                dailyResult.findings.items.push(expedition.itemHash);
                break;
            }

            case ExpeditionEventType.fleet: {
                dailyResult.eventSizes.fleet[expedition.size]++;

                for (const ship of ExpeditionFindableShipTypes) {
                    const count = expedition.fleet[ship] ?? 0;
                    dailyResult.findings.fleet[ship] += count;

                    const shipData = ShipByTypes[ship];
                    const resourceUnits = multiplyCost(shipData.cost, count);

                    for (const resource of ResourceTypes) {
                        dailyResult.findings.fleetResourceUnits[resource] += resourceUnits[resource]
                    }
                }
                break;
            }
        }
    }

    private getNewDailyResult(date: number): DailyExpeditionResult {
        return {
            date,
            events: createRecord(ExpeditionEventTypes, 0),
            eventSizes: {
                resources: createRecord(ExpeditionEventSizes, 0),
                resourceCount: createRecord(ResourceTypes, () => createRecord(ExpeditionEventSizes, 0)),
                fleet: createRecord(ExpeditionEventSizes, 0),
                darkMatter: createRecord(ExpeditionEventSizes, 0),
            },
            findings: {
                darkMatter: 0,
                items: [],
                fleet: createRecord(ExpeditionFindableShipTypes, 0),
                fleetResourceUnits: createRecord(ResourceTypes, 0),
                resources: createRecord(ResourceTypes, 0),
                resourceCount: createRecord(ResourceTypes, 0),
            },
            depletion: {
                ...createRecord(ExpeditionDepletionLevels, 0),
                unknown: 0,
            },
        };
    }

    private initCommunication() {
        chrome.runtime.onMessage.addListener(message => this.onMessage(message));
    }

    private onMessage(msg: Message) {
        const { type, ogameMeta } = msg;
        if (!ogameMetasEqual(ogameMeta, GlobalOgameMetaData)) {
            return;
        }

        switch (type) {
            case MessageType.NewExpedition: {
                const { data: expedition } = msg as NewExpeditionMessage;
                this.addExpeditionToDailyResult_delayed(expedition);
                break;
            }
        }
    }

    public get firstDay(): number {
        return startOfDay(this.internal_firstDate ?? Date.now()).getTime();
    }

    public async clear(): Promise<void> {
        const db = await getPlayerDatabase(GlobalOgameMetaData);
        await db.clear('expeditions');
    }
}

export const ExpeditionDataModule = new ExpeditionDataModuleClass();
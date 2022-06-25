import { ExpeditionEvent, ExpeditionFindableShipType, ExpeditionFindableShipTypes } from '@/shared/models/expeditions/ExpeditionEvents';
import { MessageType } from '@/shared/messages/MessageType';
import { NewExpeditionMessage } from '@/shared/messages/tracking/expeditions';
import { Message } from '@/shared/messages/Message';
import { GlobalOgameMetaData } from './global';
import { Component, Vue } from 'vue-property-decorator';
import { startOfDay } from 'date-fns';
import { ogameMetasEqual } from '@/shared/ogame-web/ogameMetasEqual';
import { getPlayerDatabase } from '@/shared/db/access';
import { ResourceType, ResourceTypes } from '@/shared/models/ogame/resources/ResourceType';
import { ExpeditionEventType, ExpeditionEventTypes } from '@/shared/models/expeditions/ExpeditionEventType';
import { ItemHash } from '@/shared/models/ogame/items/ItemHash';
import { ExpeditionEventSize, ExpeditionEventSizes } from '@/shared/models/expeditions/ExpeditionEventSize';
import { Ships } from '@/shared/models/ogame/ships/Ships';
import { ShipType } from '@/shared/models/ogame/ships/ShipType';
import { multiplyCost } from '@/shared/models/ogame/common/Cost';
import { createRecord } from '@/shared/utils/createRecord';

export interface DailyExpeditionResult {
    events: Record<ExpeditionEventType, number>;
    findings: {
        resources: Record<ResourceType, number>;
        fleet: Record<ExpeditionFindableShipType, number>;
        fleetResourceUnits: Record<ResourceType, number>;
        darkMatter: number;
        items: ItemHash[];
    };
    eventSizes: {
        resources: Record<ExpeditionEventSize, number>;
        fleet: Record<ExpeditionEventSize, number>;
        darkMatter: Record<ExpeditionEventSize, number>;
    };
}

@Component
class ExpeditionDataModuleClass extends Vue {
    public dailyResults: Partial<Record<number, DailyExpeditionResult>> = {};
    private _firstDate: number | null = null;
    private _count = 0;

    public get count() {
        return this._count;
    }

    private async created() {
        this.initCommunication();
        await this.loadData();
    }

    private async loadData() {
        const db = await getPlayerDatabase(GlobalOgameMetaData);
        const tx = db.transaction('expeditions', 'readonly');
        const store = tx.objectStore('expeditions');

        let minDate: number | null = null;
        let cursor = await store.openCursor();
        while (cursor != null) {
            const expedition = cursor.value;
            this.addExpeditionToDailyResult(expedition);

            minDate = Math.min(minDate ?? Number.MAX_SAFE_INTEGER, expedition.date);

            cursor = await cursor.continue();
        }
        this._firstDate = minDate;

        await tx.done;
    }

    private addExpeditionToDailyResult(expedition: ExpeditionEvent) {
        this._count++;

        const day = startOfDay(expedition.date).getTime();

        let dailyResult = this.dailyResults[day];
        if (dailyResult == null) {
            dailyResult = this.getNewDailyResult();
            this.$set(this.dailyResults, day, dailyResult);
        }

        dailyResult.events[expedition.type]++;

        if ('size' in expedition) {
            dailyResult.eventSizes.resources[expedition.size]++;
        }

        switch (expedition.type) {
            case ExpeditionEventType.resources: {
                for(const resource of ResourceTypes) {
                    dailyResult.findings.resources[resource] += expedition.resources[resource];
                } 
                break;
            }

            case ExpeditionEventType.darkMatter: {
                dailyResult.findings.darkMatter += expedition.darkMatter;
                break;
            }

            case ExpeditionEventType.item: {
                dailyResult.findings.items.push(expedition.itemHash);
                break;
            }

            case ExpeditionEventType.fleet: {
                for(const ship of ExpeditionFindableShipTypes){
                    const count = expedition.fleet[ship] ?? 0;
                    dailyResult.findings.fleet[ship] += count;

                    const shipData = Ships[ship as number as ShipType];
                    const resourceUnits = multiplyCost(shipData.getCost(), count);

                    for(const resource of ResourceTypes) {
                        dailyResult.findings.fleetResourceUnits[resource] += resourceUnits[resource]
                    }
                }
                break;
            }
        }
    }

    private getNewDailyResult(): DailyExpeditionResult {
        return {
            events: createRecord(ExpeditionEventTypes, 0),
            eventSizes: {
                resources: createRecord(ExpeditionEventSizes, 0),
                fleet: createRecord(ExpeditionEventSizes, 0),
                darkMatter: createRecord(ExpeditionEventSizes, 0),
            },
            findings: {
                darkMatter: 0,
                items: [],
                fleet: createRecord(ExpeditionFindableShipTypes, 0),
                fleetResourceUnits: createRecord(ResourceTypes, 0),
                resources: createRecord(ResourceTypes, 0),
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
                this.addExpeditionToDailyResult(expedition);
                break;
            }
        }
    }

    public get firstDay(): number {
        return startOfDay(this._firstDate ?? Date.now()).getTime();
    }
}

export const ExpeditionDataModule = new ExpeditionDataModuleClass();
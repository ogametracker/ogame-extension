import { CombatReport } from '@/shared/models/combat-reports/CombatReport';
import { MessageType } from '@/shared/messages/MessageType';
import { NewCombatReportMessage } from '@/shared/messages/tracking/combat-reports';
import { Message, MessageOgameMeta } from '@/shared/messages/Message';
import { GlobalOgameMetaData } from './global';
import { Component, Vue } from 'vue-property-decorator';
import { startOfDay } from 'date-fns';
import { ogameMetasEqual } from '@/shared/ogame-web/ogameMetasEqual';
import { getPlayerDatabase } from '@/shared/db/access';
import { ShipType } from '@/shared/models/ogame/ships/ShipType';
import { CombatResultType, CombatResultTypes } from '@/shared/models/combat-reports/CombatResultType';
import { ResourceType, ResourceTypes } from '@/shared/models/ogame/resources/ResourceType';
import { createRecord } from '@/shared/utils/createRecord';
import { ShipTypes, ShipByTypes } from '@/shared/models/ogame/ships/ShipTypes';
import { multiplyCost } from '@/shared/models/ogame/common/Cost';
import { UniversesAndAccountsDataModule } from './UniversesAndAccountsDataModule';

export interface DailyCombatReportResult {
    date: number;
    results: {
        onExpeditions: Record<CombatResultType, number>;
        againstPlayers: Record<CombatResultType, number>;
    };
    lostShips: {
        onExpeditions: {
            ships: Record<ShipType, number>;
            resourceUnits: Record<ResourceType, number>;
        };
        againstPlayers: {
            ships: Record<ShipType, number>;
            resourceUnits: Record<ResourceType, number>;
        };
    };

    loot: {
        gained: Record<ResourceType, number>;
        lost: Record<ResourceType, number>;
        total: Record<ResourceType, number>;
    }
}

@Component
class CombatReportDataModuleClass extends Vue {
    public dailyResults: Partial<Record<number, DailyCombatReportResult>> = {};
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

    public get dailyResultsArray(): DailyCombatReportResult[] {
        return Object.values(this.dailyResults) as DailyCombatReportResult[];
    }

    private async created() {
        this._ready = new Promise<void>(resolve => this._resolveReady = resolve);

        this.initCommunication();
        await this.loadData();
    }

    private async loadData() {
        await this.$nextTick();
        await UniversesAndAccountsDataModule.ready;

        const la = UniversesAndAccountsDataModule.currentAccount.linkedAccounts ?? [];
        const linkedAccounts = la.map<MessageOgameMeta>(acc => ({
            playerId: acc.id,
            language: acc.serverLanguage,
            serverId: acc.serverId,
        }));
        const accounts: MessageOgameMeta[] = [
            GlobalOgameMetaData,
            ...linkedAccounts,
        ];

        let minDate: number | null = null;
        for (const account of accounts) {
            const db = await getPlayerDatabase(account);

            const reports = await db.getAll('combatReports');
            reports.forEach(report => {
                this.addCombatReportToDailyResult(report);

                minDate = Math.min(minDate ?? Number.MAX_SAFE_INTEGER, report.date);
            });
            this.internal_firstDate = minDate;
        }

        this._resolveReady();
    }

    private addTimeout: number | undefined = undefined;
    private addCombatReports: CombatReport[] = [];

    private addCombatReportToDailyResult_delayed(report: CombatReport) {
        this.addCombatReports.push(report);

        clearTimeout(this.addTimeout);
        this.addTimeout = setTimeout(() => {
            const addCombats = this.addCombatReports;
            this.addCombatReports = [];
            addCombats.forEach(report => this.addCombatReportToDailyResult(report));
        }, 500);
    }

    private addCombatReportToDailyResult(report: CombatReport) {
        this.internal_count++;

        const day = startOfDay(report.date).getTime();

        let dailyResult = this.dailyResults[day];
        if (dailyResult == null) {
            dailyResult = this.getNewDailyResult(day);
            this.$set(this.dailyResults, day, dailyResult);
        }


        if (report.isExpedition) {
            dailyResult.results.onExpeditions[report.result]++;
        } else {
            dailyResult.results.againstPlayers[report.result]++;
        }

        const lostShips = report.isExpedition ? dailyResult.lostShips.onExpeditions : dailyResult.lostShips.againstPlayers;
        for (const ship of ShipTypes) {
            lostShips.ships[ship] += report.lostShips[ship];

            const shipData = ShipByTypes[ship];
            const resourceUnits = multiplyCost(shipData.getCost(), report.lostShips[ship]);

            ResourceTypes.forEach(resource => lostShips.resourceUnits[resource] += resourceUnits[resource]);
        }

        for (const resource of ResourceTypes) {
            const amount = report.loot[resource];

            dailyResult.loot.total[resource] += amount;

            if (amount < 0) {
                dailyResult.loot.lost[resource] += amount;
            } else {
                dailyResult.loot.gained[resource] += amount;
            }
        }
    }

    private getNewDailyResult(date: number): DailyCombatReportResult {
        return {
            date,
            loot: {
                lost: createRecord(ResourceTypes, 0),
                gained: createRecord(ResourceTypes, 0),
                total: createRecord(ResourceTypes, 0),
            },
            lostShips: {
                onExpeditions: {
                    ships: createRecord(ShipTypes, 0),
                    resourceUnits: createRecord(ResourceTypes, 0),
                },
                againstPlayers: {
                    ships: createRecord(ShipTypes, 0),
                    resourceUnits: createRecord(ResourceTypes, 0),
                },
            },
            results: {
                onExpeditions: createRecord(CombatResultTypes, 0),
                againstPlayers: createRecord(CombatResultTypes, 0),
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
            case MessageType.NewCombatReport: {
                const { data } = msg as NewCombatReportMessage;
                this.addCombatReportToDailyResult_delayed(data);
                break;
            }
        }
    }

    public get firstDay(): number {
        return startOfDay(this.internal_firstDate ?? Date.now()).getTime();
    }

    public async clear(): Promise<void> {
        const db = await getPlayerDatabase(GlobalOgameMetaData);
        await db.clear('combatReports');
    }
}

export const CombatReportDataModule = new CombatReportDataModuleClass();
import { CombatReport } from '@/shared/models/combat-reports/CombatReport';
import { MessageType } from '@/shared/messages/MessageType';
import { NewCombatReportMessage } from '@/shared/messages/tracking/combat-reports';
import { Message } from '@/shared/messages/Message';
import { GlobalOgameMetaData } from './global';
import { Component, Vue } from 'vue-property-decorator';
import { startOfDay } from 'date-fns';
import { ogameMetasEqual } from '@/shared/ogame-web/ogameMetasEqual';
import { getPlayerDatabase } from '@/shared/db/access';
import { ShipType, ShipTypes } from '@/shared/models/ogame/ships/ShipType';
import { CombatResultType, CombatResultTypes } from '@/shared/models/combat-reports/CombatResultType';
import { ResourceType, ResourceTypes } from '@/shared/models/ogame/resources/ResourceType';
import { createRecord } from '@/shared/utils/createRecord';
import { Ships } from '@/shared/models/ogame/ships/Ships';
import { multiplyCost } from '@/shared/models/ogame/common/Cost';

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
    loot: Record<ResourceType, number>;
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
        const db = await getPlayerDatabase(GlobalOgameMetaData);

        let minDate: number | null = null;
        const reports = await db.getAll('combatReports');
        reports.forEach(report => {
            this.addCombatReportToDailyResult(report);

            minDate = Math.min(minDate ?? Number.MAX_SAFE_INTEGER, report.date);
        });
        this.internal_firstDate = minDate;

        this._resolveReady();
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

            const shipData = Ships[ship];
            const resourceUnits = multiplyCost(shipData.getCost(), report.lostShips[ship]);

            ResourceTypes.forEach(resource => lostShips.resourceUnits[resource] += resourceUnits[resource]);
        }

        for (const resource of ResourceTypes) {
            dailyResult.loot[resource] += report.loot[resource];
        }
    }

    private getNewDailyResult(date: number): DailyCombatReportResult {
        return {
            date,
            loot: createRecord(ResourceTypes, 0),
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
                this.addCombatReportToDailyResult(data);
                break;
            }
        }
    }

    public get firstDay(): number {
        return startOfDay(this.internal_firstDate ?? Date.now()).getTime();
    }
}

export const CombatReportDataModule = new CombatReportDataModuleClass();
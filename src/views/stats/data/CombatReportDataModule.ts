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
        const tx = db.transaction('combatReports', 'readonly');
        const store = tx.objectStore('combatReports');

        let minDate: number | null = null;
        let cursor = await store.openCursor();
        while (cursor != null) {
            const combatReport = cursor.value;
            this.addCombatReportToDailyResult(combatReport);

            minDate = Math.min(minDate ?? Number.MAX_SAFE_INTEGER, combatReport.date);

            cursor = await cursor.continue();
        }
        this._firstDate = minDate;

        await tx.done;
    }

    private addCombatReportToDailyResult(report: CombatReport) {
        this._count++;

        const day = startOfDay(report.date).getTime();

        let dailyResult = this.dailyResults[day];
        if (dailyResult == null) {
            dailyResult = this.getNewDailyResult();
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

    private getNewDailyResult(): DailyCombatReportResult {
        return {
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
        console.log('connecting to background service');

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
        return startOfDay(this._firstDate ?? Date.now()).getTime();
    }
}

export const CombatReportDataModule = new CombatReportDataModuleClass();
import { TryActionResult } from "../../shared/TryActionResult";
import { _log, _logDebug, _logError } from "../../shared/utils/_log";
import { CombatReport } from "../../shared/models/combat-reports/CombatReport";
import { _throw } from "../../shared/utils/_throw";
import { RawCombatReportData, RequestSingleCombatReportMessage, TrackCombatReportMessage } from "../../shared/messages/tracking/combat-reports";
import { CombatResultType } from "../../shared/models/combat-reports/CombatResultType";
import { ShipType } from "../../shared/models/ogame/ships/ShipType";
import { ShipTypes } from "../../shared/models/ogame/ships/ShipTypes";
import { ResourceType } from "../../shared/models/ogame/resources/ResourceType";
import i18nFactions from '../../shared/i18n/ogame/factions';
import { parseIntSafe } from "../../shared/utils/parseNumbers";
import { getPlayerDatabase } from "@/shared/db/access";
import { settingsService } from "../main";
import { OgameCombatReport } from "@/shared/models/ogame/combats/OgameCombatReport";
import { getLanguage } from "@/shared/i18n/getLanguage";

type CombatReportResult = {
    report: CombatReport;
    isAlreadyTracked: boolean;
    ignored: false;
} | {
    ignored: true;
    id: number;
};

export class CombatReportModule {
    public async tryTrackCombatReport(message: TrackCombatReportMessage): Promise<TryActionResult<CombatReportResult>> {
        const combatReportData = message.data;

        const db = await getPlayerDatabase(message.ogameMeta);


        // check if combat report already tracked => if true, return tracked data
        const knownReport = await db.get('combatReports', combatReportData.id);
        if (knownReport != null) {
            return {
                success: true,
                result: {
                    report: knownReport,
                    isAlreadyTracked: true,
                    ignored: false,
                },
            };
        }

        const shouldIgnoreEspionageCombats = settingsService.settings.combatTracking.ignoreEspionageFights;
        // check if combat report ignored
        const ignoredCombat = await db.get('combatReports.ignored', combatReportData.id);
        if(ignoredCombat != null && shouldIgnoreEspionageCombats) {
            return {
                success: true,
                result: {
                    id: message.data.id,
                    ignored: true,
                },
            };
        }

        if (message.data.ogameCombatReport.isEspionageCombat && shouldIgnoreEspionageCombats) {
            _logDebug(`ignoring espionage combat with id ${combatReportData.id}`);
            
            await db.put('combatReports.ignored', combatReportData.id, combatReportData.id);

            return {
                success: true,
                result: {
                    id: message.data.id,
                    ignored: true,
                },
            };
        }

        // otherwise parse and save result
        let report: CombatReport;
        try {
            report = this.parseCombatReport(combatReportData);

            await db.put('combatReports', report);

            return {
                success: true,
                result: {
                    report,
                    isAlreadyTracked: false,
                    ignored: false,
                },
            };
        } catch (error) {
            _logError({ error, message });
            return { success: false };
        }
    }

    public async tryGetSingleReport(message: RequestSingleCombatReportMessage): Promise<TryActionResult<CombatReportResult>> {
        const db = await getPlayerDatabase(message.ogameMeta);

        // check if expedition already tracked => if true, return tracked data
        const knownReport = await db.get('combatReports', message.data);
        if (knownReport != null) {
            return {
                success: true,
                result: {
                    report: knownReport,
                    isAlreadyTracked: true,
                    ignored: false,
                },
            };
        }

        const shouldIgnoreEspionageCombats = settingsService.settings.combatTracking.ignoreEspionageFights;
        // check if combat report ignored
        const ignoredCombat = await db.get('combatReports.ignored', message.data);
        if(ignoredCombat != null && shouldIgnoreEspionageCombats) {
            return {
                success: true,
                result: {
                    id: message.data,
                    ignored: true,
                },
            };
        }

        return { success: false };
    }

    private parseCombatReport(rawCombatReportData: RawCombatReportData): CombatReport {
        const { id, date, ogameCombatReport } = rawCombatReportData;
        
        // lootFactor if player is one of the attackers = 1
        // if player a defending fleet but not the owner of the planet = 0
        // else if player lost and is owner of the planet = -1
        let lootFactor = 0;
        if(!ogameCombatReport.isExpedition) {
            if(ogameCombatReport.isAttacker) {
                lootFactor = 1;
            }
            else if(ogameCombatReport.isDefender) {
                if(ogameCombatReport.isOwner) {
                    lootFactor = -1;
                } else {
                    lootFactor = 0;
                }
            }
        }
        lootFactor *= (ogameCombatReport.winner == 'attacker' ? 1 : 0);

        const result: CombatResultType = (ogameCombatReport.isAttacker && ogameCombatReport.winner == 'attacker')
            || ogameCombatReport.isDefender && ogameCombatReport.winner == 'defender'
            ? CombatResultType.won
            : ogameCombatReport.winner == 'none'
                ? CombatResultType.draw
                : CombatResultType.lost;

        const loot = {
            [ResourceType.metal]: ogameCombatReport.loot.metal * lootFactor,
            [ResourceType.crystal]: ogameCombatReport.loot.crystal * lootFactor,
            [ResourceType.deuterium]: ogameCombatReport.loot.deuterium * lootFactor,
        };
        const debrisField = {
            [ResourceType.metal]: ogameCombatReport.debris.metal,
            [ResourceType.crystal]: ogameCombatReport.debris.crystal,
            [ResourceType.deuterium]: ogameCombatReport.debris.deuterium,
        };

        const lostShips = ogameCombatReport.playerLosses;

        const report: CombatReport = {
            id,
            date,
            coordinates: ogameCombatReport.coordinates,
            result,
            isExpedition: ogameCombatReport.isExpedition,
            loot,
            debrisField,
            lostShips,
        };
        return report;
    }
}
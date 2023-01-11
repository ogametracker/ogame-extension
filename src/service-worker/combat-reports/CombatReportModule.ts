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

        const isEspionageCombat = this.isEspionageCombat(message.data.ogameCombatReport);
        if (isEspionageCombat && shouldIgnoreEspionageCombats) {
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
            report = this.parseCombatReport(
                message.ogameMeta.language,
                message.ogameMeta.playerId,
                combatReportData
            );

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

    private isEspionageCombat(combat: OgameCombatReport) {
        return Object.values(combat.combatRounds[0].attackerShips).every(
            attackerShips => Object.keys(attackerShips).length == 1 && (attackerShips[ShipType.espionageProbe] ?? 0) > 0
        );
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

    private parseCombatReport(language: string, playerId: number, rawCombatReportData: RawCombatReportData): CombatReport {
        const { id, ogameCombatReport } = rawCombatReportData;

        const languageKey = getLanguage(language);
        if(ogameCombatReport.isExpedition && languageKey == null) {
            _throw(`unsupported language '${language}'`);
        }
        const attackingFleets = Object.values(ogameCombatReport.attacker);
        // lootFactor if player is one of the attackers = 1
        // if player a defending fleet but not the owner of the planet = 0
        // else if player lost and is owner of the planet = -1
        let lootFactor = 0;
        if (!ogameCombatReport.isExpedition) {
            if (attackingFleets.some(fleet => fleet.ownerID == playerId)) {
                lootFactor = 1;
            } else if (ogameCombatReport.defender[0].ownerID == playerId) {
                lootFactor = -1;
            }
        }
        lootFactor *= (ogameCombatReport.result == 'attacker' ? 1 : 0);

        const result: CombatResultType = (attackingFleets.some(fleet => fleet.ownerID == playerId) && ogameCombatReport.result == 'attacker')
            || (Object.values(ogameCombatReport.defender).some(fleet => fleet.ownerID == playerId) && ogameCombatReport.result == 'defender')
            ? CombatResultType.won
            : ogameCombatReport.result == 'draw'
                ? CombatResultType.draw
                : CombatResultType.lost;


        const expeditionAttackType = ogameCombatReport.isExpedition
            ? ogameCombatReport.attacker[0].ownerName == i18nFactions[languageKey!].pirates
                ? 'pirates'
                : 'aliens'
            : null;

        const loot = {
            [ResourceType.metal]: ogameCombatReport.loot.metal * lootFactor,
            [ResourceType.crystal]: ogameCombatReport.loot.crystal * lootFactor,
            [ResourceType.deuterium]: ogameCombatReport.loot.deuterium * lootFactor,
        };
        const debrisField = {
            [ResourceType.metal]: ogameCombatReport.debris.metal,
            [ResourceType.crystal]: ogameCombatReport.debris.crystal,
        };

        const lostShips: Record<ShipType, number> = {
            [ShipType.battlecruiser]: 0,
            [ShipType.battleship]: 0,
            [ShipType.bomber]: 0,
            [ShipType.colonyShip]: 0,
            [ShipType.crawler]: 0,
            [ShipType.cruiser]: 0,
            [ShipType.deathStar]: 0,
            [ShipType.destroyer]: 0,
            [ShipType.espionageProbe]: 0,
            [ShipType.heavyFighter]: 0,
            [ShipType.largeCargo]: 0,
            [ShipType.lightFighter]: 0,
            [ShipType.pathfinder]: 0,
            [ShipType.reaper]: 0,
            [ShipType.recycler]: 0,
            [ShipType.smallCargo]: 0,
            [ShipType.solarSatellite]: 0,
        };

        const lastRound = ogameCombatReport.combatRounds[ogameCombatReport.combatRounds.length - 1];
        Object.keys(lastRound.attackerLosses ?? {}).forEach(fleetId => {
            const id = parseIntSafe(fleetId, 10);
            if (ogameCombatReport.attacker[id].ownerID != playerId)
                return;

            const loss = lastRound.attackerLosses?.[fleetId];
            if (loss == null)
                return;

            ShipTypes.forEach(ship => {
                const countStr = loss![ship];
                if (countStr == null)
                    return;

                const count = parseIntSafe(countStr, 10);
                lostShips[ship] += count;
            });
        });
        Object.keys(lastRound.defenderLosses ?? {}).forEach(fleetId => {
            const id = parseIntSafe(fleetId, 10);
            if (ogameCombatReport.defender[id].ownerID != playerId)
                return;

            const loss = lastRound.defenderLosses?.[fleetId];
            if (loss == null)
                return;

            ShipTypes.forEach(ship => {
                const countStr = loss![ship];
                if (countStr == null)
                    return;

                const count = parseIntSafe(countStr, 10);
                lostShips[ship] += count;
            });
        });


        const report: CombatReport = {
            id,
            date: new Date(ogameCombatReport.event_time).getTime(),
            coordinates: {
                galaxy: ogameCombatReport.coordinates.galaxy,
                system: ogameCombatReport.coordinates.system,
                position: ogameCombatReport.coordinates.position,
                type: ogameCombatReport.coordinates.planetType,
            },
            result,
            isExpedition: ogameCombatReport.isExpedition,
            expeditionAttackType,
            loot,
            debrisField,
            lostShips,
        };
        return report;
    }
}
import { isSupportedLanguage } from "../../shared/i18n/isSupportedLanguage";
import { LanguageKey } from "../../shared/i18n/LanguageKey";
import { MessageOgameMeta } from "../../shared/messages/Message";
import { TryActionResult } from "../../shared/TryActionResult";
import { _log, _logError } from "../../shared/utils/_log";
import { getStorageKeyPrefix } from "../../shared/utils/getStorageKeyPrefix";
import { CombatReportManager } from "./CombatReportManager";
import { CombatReport } from "../../shared/models/v1/combat-reports/CombatReport";
import { _throw } from "../../shared/utils/_throw";
import { RawCombatReportData, TrackCombatReportMessage } from "../../shared/messages/tracking/combat-reports";
import { CombatResultType } from "../../shared/models/v1/combat-reports/CombatResultType";
import { ShipType } from "../../shared/models/v1/ogame/ships/ShipType";
import { ResourceType } from "../../shared/models/v1/ogame/resources/ResourceType";
import { getNumericEnumValues } from '../../shared/utils/getNumericEnumValues';
import i18nFactions from '../../shared/i18n/ogame/factions';
import { parseIntSafe } from "../../shared/utils/parseNumbers";

interface CombatReportResult {
    report: CombatReport;
    isAlreadyTracked: boolean;
}

export class CombatReportModule {
    private readonly combatReportManagers: Record<string, CombatReportManager | undefined> = {};

    public async tryTrackCombatReport(message: TrackCombatReportMessage): Promise<TryActionResult<CombatReportResult>> {
        const combatReportData = message.data;

        const manager = this.getManager(message.ogameMeta);
        const combatReports = await manager.getData();

        // check if expedition already tracked => if true, return tracked data
        const knownReport = combatReports[combatReportData.id];
        if (knownReport != null) {
            return {
                success: true,
                result: {
                    report: knownReport,
                    isAlreadyTracked: true,
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
        } catch (error) {
            _logError({ error, message });
            return { success: false };
        }

        await manager.add(report);
        return {
            success: true,
            result: {
                report,
                isAlreadyTracked: false,
            },
        };
    }

    private parseCombatReport(language: string, playerId: number, rawCombatReportData: RawCombatReportData): CombatReport {
        const { id, ogameCombatReport } = rawCombatReportData;

        if (ogameCombatReport.isExpedition && !isSupportedLanguage(language)) {
            throw new Error(`unsupported language '${language}'`);
        }
        const languageKey = language as LanguageKey;

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
            ? ogameCombatReport.attacker[0].ownerName == i18nFactions[languageKey].pirates
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

        const ships = getNumericEnumValues<ShipType>(ShipType);
        const lastRound = ogameCombatReport.combatRounds[ogameCombatReport.combatRounds.length - 1];
        Object.keys(lastRound.attackerLosses ?? {}).forEach(fleetId => {
            const id = parseIntSafe(fleetId, 10);
            if (ogameCombatReport.attacker[id].ownerID != playerId)
                return;

            const loss = lastRound.attackerLosses?.[fleetId];
            if (loss == null)
                return;

            ships.forEach(ship => {
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

            ships.forEach(ship => {
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

    public async getCombatReports(meta: MessageOgameMeta): Promise<CombatReport[]> {
        const manager = this.getManager(meta);
        const expeditions = await manager.getData();
        return Object.values(expeditions);
    }

    private getManager(meta: MessageOgameMeta): CombatReportManager {
        const key = getStorageKeyPrefix(meta);
        const manager = (this.combatReportManagers[key] ??= new CombatReportManager(key));

        return manager;
    }
}
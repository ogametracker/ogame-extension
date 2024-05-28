import { TryActionResult } from "../../shared/TryActionResult";
import { _log, _logDebug, _logError, _logWarning } from "../../shared/utils/_log";
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
import { OgameCombatReport, FleetState } from "@/shared/models/ogame/combats/OgameCombatReport";
import { getLanguage } from "@/shared/i18n/getLanguage";
import { PlanetType } from "@/shared/models/ogame/common/PlanetType";

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
        _logWarning(`-----isEspionageCombat-----: ${isEspionageCombat}`);
        if (isEspionageCombat && shouldIgnoreEspionageCombats) {
            _logError('ESPIONAGE REPORT IGNORED')
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
                message.ogameMeta.userLanguage,
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
        const attackerFleetIds = combat.players
            .filter(player => player.side === 'attacker')
            .map(player => player.fleetId);
    
        const attackerFleets = combat.combatRounds[0].fleets.filter(fleet => 
            fleet.side === 'attacker' && attackerFleetIds.includes(fleet.fleetId)
        );
    
        return attackerFleets.every(fleet => 
            fleet.technologies.length === 1 && 
            fleet.technologies[0].technologyId === ShipType.espionageProbe && 
            fleet.technologies[0].remaining > 0
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
        const { id, date, ogameCombatReport } = rawCombatReportData;
        _logDebug(`-----id-----: ${id}`);

        const languageKey = getLanguage(language);
        if(ogameCombatReport.isExpedition && languageKey == null) {
            _throw(`unsupported language '${language}'`);
        }

        // lootFactor if player is one of the attackers = 1
        // if player a defending fleet but not the owner of the planet = 0
        // else if player lost and is owner of the planet = -1
        let lootFactor = 0;
        if (!ogameCombatReport.isExpedition) {
            if (ogameCombatReport.players.find(player => player.side === 'attacker' && player.player.id === playerId)) {
                lootFactor = 1;
            } else if (ogameCombatReport.players.find(player => player.side === 'defender' && player.player.id === playerId)) {
                lootFactor = -1;
            }
        }
        lootFactor *= (ogameCombatReport.result.winner == 'attacker' ? 1 : 0);

        const result: CombatResultType = (ogameCombatReport.players.find(player => player.side === 'attacker' && player.player.id === playerId) && ogameCombatReport.result.winner == 'attacker')
            || (ogameCombatReport.players.find(player => player.side === 'defender' && player.player.id === playerId) && ogameCombatReport.result.winner == 'defender')
            ? CombatResultType.won
            : ogameCombatReport.result.winner == 'none'
                ? CombatResultType.draw
                : CombatResultType.lost;

        const expeditionAttackType = ogameCombatReport.isExpedition
            ? ogameCombatReport.players.find(player => player.side === 'attacker')?.player.name == i18nFactions[languageKey!].pirates
                ? 'pirates'
                : 'aliens'
            : null;
        
        const loot = { 
            [ResourceType.metal]: ogameCombatReport.result.loot.metal * lootFactor, 
            [ResourceType.crystal]: ogameCombatReport.result.loot.crystal * lootFactor, 
            [ResourceType.deuterium]: ogameCombatReport.result.loot.deuterium * lootFactor, 
        }; 

        const debrisField = { 
            [ResourceType.metal]: ogameCombatReport.result.debris.metal, 
            [ResourceType.crystal]: ogameCombatReport.result.debris.crystal, 
            [ResourceType.deuterium]: ogameCombatReport.result.debris.deuterium, 
        }; 

        const lostShips: Record<number, number> = {
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

        lastRound.fleets.forEach(fleet => {
            const fleetSide = fleet.side;
            const fleetId = fleet.fleetId;
        
            const playerFleetExist = ogameCombatReport.players.some(player => player.side === fleetSide && player.fleetId === fleetId);
            if (!playerFleetExist) return;

            fleet.technologies.forEach(tech => {
                if (lostShips[tech.technologyId] !== undefined) {
                    lostShips[tech.technologyId] += tech.destroyed;
                }
            });
        });

        const coords = ogameCombatReport.coords.split(":");
        const [galaxy, system, planet] = coords;

        
        const report: CombatReport = {
            id,
            date,
            coordinates: {
                galaxy: parseIntSafe(galaxy, 10),
                system: parseIntSafe(system, 10),
                position: parseIntSafe(planet, 10),
                type: PlanetType.planet,
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
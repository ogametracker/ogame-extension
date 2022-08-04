import { getPlayerDatabase } from '@/shared/db/access';
import { $i18n } from '@/shared/i18n/extension/$i18n';
import { CombatResultTypes } from '@/shared/models/combat-reports/CombatResultType';
import { ExpeditionDepletionLevel, ExpeditionDepletionLevels } from '@/shared/models/expeditions/ExpeditionDepletionLevel';
import { ExpeditionFindableShipTypes } from '@/shared/models/expeditions/ExpeditionEvents';
import { ExpeditionEventType, ExpeditionEventTypes } from '@/shared/models/expeditions/ExpeditionEventType';
import { PlanetType } from '@/shared/models/ogame/common/PlanetType';
import { ResourceType, ResourceTypes } from '@/shared/models/ogame/resources/ResourceType';
import { ShipTypes } from '@/shared/models/ogame/ships/ShipType';
import * as xlsx from 'xlsx';
import { CombatReportDataModule } from '../../data/CombatReportDataModule';
import { DebrisFieldReportDataModule } from '../../data/DebrisFieldReportDataModule';
import { ExpeditionDataModule } from '../../data/ExpeditionDataModule';
import { GlobalOgameMetaData } from '../../data/global';

interface ExcelExportOptions_Expeditions {
    rawData: boolean;
    overviewPerDay: boolean;
    depletionPerDay: boolean;

    resourcesPerDay: {
        amount: boolean;
        sizes: boolean;
    };
    shipsPerDay: {
        amount: boolean;
        sizes: boolean;
    };
    darkMatterPerDay: {
        amount: boolean;
        sizes: boolean;
    };
}

interface ExcelExportOptions_Combats {
    rawData: boolean;
    overviewPerDay: boolean;
    lootBalancePerDay: boolean;
    lostShipsPerDay: boolean;
}

interface ExcelExportOptions_DebrisFields {
    rawData: boolean;
    resourcesPerDay: boolean;
}

export interface ExcelExportOptions {
    expeditions: ExcelExportOptions_Expeditions;
    combats: ExcelExportOptions_Combats;
    debrisFields: ExcelExportOptions_DebrisFields;
}

class ExcelExportClass {

    public async create(options: ExcelExportOptions, filename: string) {
        const workbook = xlsx.utils.book_new();

        await this.#writeExpeditions(workbook, options.expeditions);
        await this.#writeCombats(workbook, options.combats);
        await this.#writeDebrisFields(workbook, options.debrisFields);

        xlsx.writeFile(workbook, filename);
    }

    async #writeDebrisFields(workbook: xlsx.WorkBook, options: ExcelExportOptions_DebrisFields) {
        if (options.rawData) {
            await this.#writeDebrisFields_rawData(workbook);
        }

        if (options.resourcesPerDay) {
            const dailyResults = DebrisFieldReportDataModule.dailyResultsArray;

            const headers = [
                $i18n.$t.common.date,
                $i18n.$t.resources[ResourceType.metal],
                $i18n.$t.resources[ResourceType.crystal],
                $i18n.$t.debrisFields.position,
            ];
            const data = dailyResults.flatMap(day => {
                const rows: [string, number, number, string][] = [];

                if (day.normal.metal > 0 || day.normal.crystal > 0) {
                    rows.push([
                        $i18n.$d(day.date, 'date'),
                        day.normal.metal,
                        day.normal.crystal,
                        '1-15',
                    ]);
                }
                if (day.expedition.metal > 0 || day.expedition.crystal > 0) {
                    rows.push([
                        $i18n.$d(day.date, 'date'),
                        day.expedition.metal,
                        day.expedition.crystal,
                        '16',
                    ]);
                }

                return rows;
            });
            const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

            xlsx.utils.book_append_sheet(workbook, sheet, `${$i18n.$t.excelExport.debrisFields.prefix} - ${$i18n.$t.excelExport.debrisFields.sheets.dailyResources}`);
        }
    }
    async #writeDebrisFields_rawData(workbook: xlsx.WorkBook) {
        const db = await getPlayerDatabase(GlobalOgameMetaData);
        const allDfReports = await db.getAll('debrisFieldReports');

        const headers = [
            $i18n.$t.common.dateTime,
            $i18n.$t.resources[ResourceType.metal],
            $i18n.$t.resources[ResourceType.crystal],
            $i18n.$t.debrisFields.position,
        ];
        const data = allDfReports.map(report => [
            $i18n.$d(report.date, 'datetime'),
            report.metal,
            report.crystal,
            report.isExpeditionDebrisField == null ? ''
                : report.isExpeditionDebrisField
                    ? '16'
                    : '1-15'
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${$i18n.$t.excelExport.debrisFields.prefix} - ${$i18n.$t.excelExport.debrisFields.sheets.rawData}`);
    }

    async #writeCombats(workbook: xlsx.WorkBook, options: ExcelExportOptions_Combats) {
        if (options.rawData) {
            await this.#writeCombats_rawData(workbook);
        }

        if (options.overviewPerDay) {
            this.#writeCombats_dailyOverview(workbook);
        }

        if (options.lootBalancePerDay) {
            this.#writeCombats_dailyLoot(workbook);
        }

        if (options.lostShipsPerDay) {
            this.#writeCombats_dailyLostShips(workbook);
        }
    }
    #writeCombats_dailyLostShips(workbook: xlsx.WorkBook) {
        const dailyResults = CombatReportDataModule.dailyResultsArray;

        const headers = [
            $i18n.$t.common.date,
            ...ShipTypes.map(ship => $i18n.$t.ships[ship]),
        ];
        const data = dailyResults.map(day => [
            $i18n.$d(day.date, 'date'),
            ...ShipTypes.map(ship => day.lostShips.againstPlayers.ships[ship] + day.lostShips.onExpeditions.ships[ship]),
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${$i18n.$t.excelExport.combats.prefix} - ${$i18n.$t.excelExport.combats.sheets.dailyLostShips}`);
    }
    #writeCombats_dailyLoot(workbook: xlsx.WorkBook) {
        const dailyResults = CombatReportDataModule.dailyResultsArray;

        const headers = [
            $i18n.$t.common.date,
            ...ResourceTypes.map(resource => $i18n.$t.resources[resource]),
        ];
        const data = dailyResults.map(day => [
            $i18n.$d(day.date, 'date'),
            ...ResourceTypes.map(resource => day.loot[resource]),
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${$i18n.$t.excelExport.combats.prefix} - ${$i18n.$t.excelExport.combats.sheets.dailyLoot}`);
    }
    #writeCombats_dailyOverview(workbook: xlsx.WorkBook) {
        const dailyResults = CombatReportDataModule.dailyResultsArray;

        const headers = [
            $i18n.$t.common.date,
            ...CombatResultTypes.map(type => `${$i18n.$t.excelExport.combats.againstPlayers} (${$i18n.$t.combats.combatResults[type]})`),
            ...CombatResultTypes.map(type => `${$i18n.$t.excelExport.combats.onExpeditions} (${$i18n.$t.combats.combatResults[type]})`),
        ];
        const data = dailyResults.map(day => [
            $i18n.$d(day.date, 'date'),
            ...CombatResultTypes.map(type => day.results.againstPlayers[type]),
            ...CombatResultTypes.map(type => day.results.onExpeditions[type]),
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${$i18n.$t.excelExport.combats.prefix} - ${$i18n.$t.excelExport.combats.sheets.dailyResults}`);
    }
    async #writeCombats_rawData(workbook: xlsx.WorkBook) {
        const db = await getPlayerDatabase(GlobalOgameMetaData);
        const allCombatReports = await db.getAll('combatReports');

        const headers = [
            $i18n.$t.common.dateTime,
            $i18n.$t.excelExport.combats.result,
            `${$i18n.$t.excelExport.combats.coordinates} (${$i18n.$t.excelExport.combats.galaxy})`,
            `${$i18n.$t.excelExport.combats.coordinates} (${$i18n.$t.excelExport.combats.system})`,
            `${$i18n.$t.excelExport.combats.coordinates} (${$i18n.$t.excelExport.combats.position})`,
            `${$i18n.$t.excelExport.combats.coordinates} (${$i18n.$t.excelExport.combats.targetType})`,
            $i18n.$t.excelExport.combats.combatType,
            $i18n.$t.excelExport.combats.expeditionCombatOpponent,
            ...ResourceTypes.map(resource => `${$i18n.$t.excelExport.combats.loot} (${$i18n.$t.resources[resource]})`),
            ...ShipTypes.map(ship => `${$i18n.$t.excelExport.combats.lostShips} (${$i18n.$t.ships[ship]})`),
            `${$i18n.$t.excelExport.combats.debrisField} (${$i18n.$t.resources[ResourceType.metal]})`,
            `${$i18n.$t.excelExport.combats.debrisField} (${$i18n.$t.resources[ResourceType.crystal]})`,
        ];
        const data = allCombatReports.map(combat => [
            $i18n.$d(combat.date, 'datetime'),
            $i18n.$t.combats.combatResults[combat.result],
            combat.coordinates.galaxy,
            combat.coordinates.system,
            combat.coordinates.position,
            combat.coordinates.type == PlanetType.moon ? $i18n.$t.excelExport.combats.moon : $i18n.$t.excelExport.combats.planet,
            combat.isExpedition ? $i18n.$t.excelExport.combats.expeditionCombat : $i18n.$t.excelExport.combats.playerCombat,
            combat.isExpedition
                ? combat.expeditionAttackType == 'pirates' ? $i18n.$t.excelExport.combats.pirates : $i18n.$t.excelExport.combats.aliens
                : '',
            ...ResourceTypes.map(resource => combat.loot[resource]),
            ...ShipTypes.map(ship => combat.lostShips[ship]),
            combat.debrisField.metal,
            combat.debrisField.crystal,
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${$i18n.$t.excelExport.combats.prefix} - ${$i18n.$t.excelExport.combats.sheets.rawData}`);
    }

    async #writeExpeditions(workbook: xlsx.WorkBook, options: ExcelExportOptions_Expeditions) {
        if (options.rawData) {
            await this.#writeExpeditions_rawData(workbook);
        }

        if (options.overviewPerDay) {
            this.#writeExpeditions_dailyOverview(workbook);
        }

        if (options.resourcesPerDay) {
            this.#writeExpeditions_dailyResources(workbook);
        }

        if (options.shipsPerDay) {
            this.#writeExpeditions_dailyShips(workbook);
        }

        if (options.darkMatterPerDay) {
            this.#writeExpeditions_dailyDarkMatter(workbook);
        }

        if (options.depletionPerDay) {
            this.#writeExpeditions_dailyDepletion(workbook);
        }
    }
    #writeExpeditions_dailyDepletion(workbook: xlsx.WorkBook) {
        const dailyResults = ExpeditionDataModule.dailyResultsArray;

        const depletionLevels: (ExpeditionDepletionLevel | 'unknown')[] = [...ExpeditionDepletionLevels, 'unknown'];

        const headers = [
            $i18n.$t.common.date,
            ...depletionLevels.map(level => $i18n.$t.expeditions.depletionLevels[level]),
        ];
        const data = dailyResults.map(day => [
            $i18n.$d(day.date, 'date'),
            ...depletionLevels.map(level => day.depletion[level]),
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${$i18n.$t.excelExport.expeditions.prefix} - ${$i18n.$t.excelExport.expeditions.sheets.dailyDepletion}`);
    }
    #writeExpeditions_dailyDarkMatter(workbook: xlsx.WorkBook) {
        const dailyResults = ExpeditionDataModule.dailyResultsArray;

        const headers = [
            $i18n.$t.common.date,
            $i18n.$t.premium.darkMatter,
        ];
        const data = dailyResults.map(day => [
            $i18n.$d(day.date, 'date'),
            day.findings.darkMatter,
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${$i18n.$t.excelExport.expeditions.prefix} - ${$i18n.$t.excelExport.expeditions.sheets.dailyDarkMatter}`);
    }
    #writeExpeditions_dailyShips(workbook: xlsx.WorkBook) {
        const dailyResults = ExpeditionDataModule.dailyResultsArray;

        const headers = [
            $i18n.$t.common.date,
            ...ExpeditionFindableShipTypes.map(ship => $i18n.$t.ships[ship]),
        ];
        const data = dailyResults.map(day => [
            $i18n.$d(day.date, 'date'),
            ...ExpeditionFindableShipTypes.map(ship => day.findings.fleet[ship]),
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${$i18n.$t.excelExport.expeditions.prefix} - ${$i18n.$t.excelExport.expeditions.sheets.dailyShips}`);
    }
    #writeExpeditions_dailyResources(workbook: xlsx.WorkBook) {
        const dailyResults = ExpeditionDataModule.dailyResultsArray;

        const headers = [
            $i18n.$t.common.date,
            ...ResourceTypes.map(resource => $i18n.$t.resources[resource]),
        ];
        const data = dailyResults.map(day => [
            $i18n.$d(day.date, 'date'),
            ...ResourceTypes.map(resource => day.findings.resources[resource]),
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${$i18n.$t.excelExport.expeditions.prefix} - ${$i18n.$t.excelExport.expeditions.sheets.dailyResources}`);
    }
    #writeExpeditions_dailyOverview(workbook: xlsx.WorkBook) {
        const dailyResults = ExpeditionDataModule.dailyResultsArray;

        const headers = [
            $i18n.$t.common.date,
            ...ExpeditionEventTypes.map(type => $i18n.$t.expeditions.expeditionEvents[type]),
        ];
        const data = dailyResults.map(day => [
            $i18n.$d(day.date, 'date'),
            ...ExpeditionEventTypes.map(type => day.events[type]),
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${$i18n.$t.excelExport.expeditions.prefix} - ${$i18n.$t.excelExport.expeditions.sheets.dailyResults}`);
    }
    async #writeExpeditions_rawData(workbook: xlsx.WorkBook) {
        const db = await getPlayerDatabase(GlobalOgameMetaData);
        const allExpeditions = await db.getAll('expeditions');

        const headers = [
            $i18n.$t.common.dateTime,
            $i18n.$t.excelExport.expeditions.eventType,
            $i18n.$t.excelExport.expeditions.eventSize,
            $i18n.$t.expeditions.depletion,
            ...ResourceTypes.map(resource => $i18n.$t.resources[resource]),
            ...ExpeditionFindableShipTypes.map(ship => $i18n.$t.ships[ship]),
            $i18n.$t.premium.darkMatter,
            $i18n.$t.excelExport.expeditions.item,
        ];
        const data = allExpeditions.map(expo => [
            $i18n.$d(expo.date, 'datetime'),
            $i18n.$t.expeditions.expeditionEvents[expo.type],
            'size' in expo ? $i18n.$t.expeditions.expeditionEventSizes[expo.size] : '',
            $i18n.$t.expeditions.depletionLevels[expo.depletion ?? 'unknown'],
            ...ResourceTypes.map(resource => expo.type == ExpeditionEventType.resources ? expo.resources[resource] : ''),
            ...ExpeditionFindableShipTypes.map(ship => expo.type == ExpeditionEventType.fleet ? expo.fleet[ship] : ''),
            expo.type == ExpeditionEventType.darkMatter ? expo.darkMatter : '',
            expo.type == ExpeditionEventType.item ? expo.itemHash : '', //TODO: item name
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${$i18n.$t.excelExport.expeditions.prefix} - ${$i18n.$t.excelExport.expeditions.sheets.rawData}`);
    }
}

export const ExcelExport = new ExcelExportClass();
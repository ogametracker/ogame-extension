import { getPlayerDatabase } from '@/shared/db/access';
import { $i18n } from '@/shared/i18n/extension/$i18n';
import { CombatResultTypes } from '@/shared/models/combat-reports/CombatResultType';
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

        await xlsx.writeFileAsync(filename, workbook, {});
    }

    async #writeDebrisFields(workbook: xlsx.WorkBook, options: ExcelExportOptions_DebrisFields) {
        if(options.rawData) {
            await this.#writeDebrisFields_rawData(workbook);
        }

        if(options.resourcesPerDay) {
            const dailyResults = DebrisFieldReportDataModule.dailyResultsArray;
    
            const headers = [
                $i18n.$t.common.date,
                $i18n.$t.resources[ResourceType.metal],
                $i18n.$t.resources[ResourceType.crystal],
            ];
            const data = dailyResults.map(day => [
                $i18n.$d(day.date, 'date'),
                day.metal,
                day.crystal,
            ]);
            const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);
    
            xlsx.utils.book_append_sheet(workbook, sheet, 'LOCA: Combats - Daily Lost Ships');
        }
    }
    async #writeDebrisFields_rawData(workbook: xlsx.WorkBook) {
        const db = await getPlayerDatabase(GlobalOgameMetaData);
        const allDfReports = await db.getAll('debrisFieldReports');

        const headers = [
            $i18n.$t.common.dateTime,
            $i18n.$t.resources[ResourceType.metal],
            $i18n.$t.resources[ResourceType.crystal],
        ];
        const data = allDfReports.map(report => [
            $i18n.$d(report.date, 'datetime'),
            report.metal,
            report.crystal,
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, 'LOCA: Expeditions - Raw Data');
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

        xlsx.utils.book_append_sheet(workbook, sheet, 'LOCA: Combats - Daily Lost Ships');
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

        xlsx.utils.book_append_sheet(workbook, sheet, 'LOCA: Combats - Daily Loot Balance');
    }
    #writeCombats_dailyOverview(workbook: xlsx.WorkBook) {
        const dailyResults = CombatReportDataModule.dailyResultsArray;

        const headers = [
            $i18n.$t.common.date,
            ...CombatResultTypes.map(type => `LOCA: ${$i18n.$t.combats.combatResults[type]} (against players)`),
            ...CombatResultTypes.map(type => `LOCA: ${$i18n.$t.combats.combatResults[type]} (on expeditions)`),
        ];
        const data = dailyResults.map(day => [
            $i18n.$d(day.date, 'date'),
            ...CombatResultTypes.map(type => day.results.againstPlayers[type]),
            ...CombatResultTypes.map(type => day.results.onExpeditions[type]),
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, 'LOCA: Combats - Daily Results');
    }
    async #writeCombats_rawData(workbook: xlsx.WorkBook) {
        const db = await getPlayerDatabase(GlobalOgameMetaData);
        const allCombatReports = await db.getAll('combatReports');

        const headers = [
            $i18n.$t.common.dateTime,
            'LOCA: Result',
            'LOCA: Coordinates (Galaxy)',
            'LOCA: Coordinates (System)',
            'LOCA: Coordinates (Position)',
            'LOCA: Coordinates (Target Type)',
            'LOCA: Combat Type',
            'LOCA: Expedition Combat Opponent',
            ...ResourceTypes.map(resource => `LOCA: Loot (${$i18n.$t.resources[resource]})`),
            ...ShipTypes.map(ship => `LOCA: Lost ships (${$i18n.$t.ships[ship]})`),
            `LOCA: Debris Field (${$i18n.$t.resources[ResourceType.metal]})`,
            `LOCA: Debris Field (${$i18n.$t.resources[ResourceType.crystal]})`,
        ];
        const data = allCombatReports.map(combat => [
            $i18n.$d(combat.date, 'datetime'),
            $i18n.$t.combats.combatResults[combat.result],
            combat.coordinates.galaxy,
            combat.coordinates.system,
            combat.coordinates.position,
            combat.coordinates.type == PlanetType.moon ? 'LOCA: Moon' : 'LOCA: Planet',
            combat.isExpedition ? 'LOCA: Expedition Combat' : 'LOCA: Player Combat',
            combat.isExpedition
                ? combat.expeditionAttackType == 'pirates' ? 'LOCA: Pirates' : 'LOCA: Aliens'
                : '',
            ...ResourceTypes.map(resource => combat.loot[resource]),
            ...ShipTypes.map(ship => combat.lostShips[ship]),
            combat.debrisField.metal,
            combat.debrisField.crystal,
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, 'LOCA: Combats - Raw Data');
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

        xlsx.utils.book_append_sheet(workbook, sheet, 'LOCA: Expeditions - Daily Dark Matter Findings');
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

        xlsx.utils.book_append_sheet(workbook, sheet, 'LOCA: Expeditions - Daily Fleet Findings');
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

        xlsx.utils.book_append_sheet(workbook, sheet, 'LOCA: Expeditions - Daily Resource Findings');
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

        xlsx.utils.book_append_sheet(workbook, sheet, 'LOCA: Expeditions - Daily Results');
    }
    async #writeExpeditions_rawData(workbook: xlsx.WorkBook) {
        const db = await getPlayerDatabase(GlobalOgameMetaData);
        const allExpeditions = await db.getAll('expeditions');

        const headers = [
            $i18n.$t.common.dateTime,
            'LOCA: Type',
            'LOCA: Size',
            ...ResourceTypes.map(resource => $i18n.$t.resources[resource]),
            ...ExpeditionFindableShipTypes.map(ship => $i18n.$t.ships[ship]),
            $i18n.$t.premium.darkMatter,
            'LOCA: Item',
        ];
        const data = allExpeditions.map(expo => [
            $i18n.$d(expo.date, 'datetime'),
            $i18n.$t.expeditions.expeditionEvents[expo.type],
            'size' in expo ? $i18n.$t.expeditions.expeditionEventSizes[expo.size] : '',
            ...ResourceTypes.map(resource => expo.type == ExpeditionEventType.resources ? expo.resources[resource] : ''),
            ...ExpeditionFindableShipTypes.map(ship => expo.type == ExpeditionEventType.fleet ? expo.fleet[ship] : ''),
            expo.type == ExpeditionEventType.darkMatter ? expo.darkMatter : '',
            expo.type == ExpeditionEventType.item ? expo.itemHash : '', //TODO: item name
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, 'LOCA: Expeditions - Raw Data');
    }
}

export const ExcelExport = new ExcelExportClass();
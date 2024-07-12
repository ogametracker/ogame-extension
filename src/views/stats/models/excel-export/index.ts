import { getPlayerDatabase } from '@/shared/db/access';
import { $i18n } from '@/shared/i18n/extension/$i18n';
import { CombatResultTypes } from '@/shared/models/combat-reports/CombatResultType';
import { ExpeditionDepletionLevel, ExpeditionDepletionLevels } from '@/shared/models/expeditions/ExpeditionDepletionLevel';
import { ExpeditionFindableShipTypes } from '@/shared/models/expeditions/ExpeditionEvents';
import { ExpeditionEventSizes } from '@/shared/models/expeditions/ExpeditionEventSize';
import { ExpeditionEventType, ExpeditionEventTypes } from '@/shared/models/expeditions/ExpeditionEventType';
import { LifeformDiscoveryEventType } from '@/shared/models/lifeform-discoveries/LifeformDiscoveryEventType';
import { PlanetType } from '@/shared/models/ogame/common/PlanetType';
import { ValidLifeformTypes } from '@/shared/models/ogame/lifeforms/LifeformType';
import { ResourceType, ResourceTypes } from '@/shared/models/ogame/resources/ResourceType';
import { ShipTypes } from '@/shared/models/ogame/ships/ShipTypes';
import * as xlsx from 'xlsx';
import { CombatReportDataModule } from '../../data/CombatReportDataModule';
import { DebrisFieldReportDataModule } from '../../data/DebrisFieldReportDataModule';
import { ExpeditionDataModule } from '../../data/ExpeditionDataModule';
import { GlobalOgameMetaData } from '../../data/global';
import { LifeformDiscoveryDataModule } from '../../data/LifeformDiscoveryDataModule';

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

interface ExcelExportOptions_LifeformDiscoveries {
    rawData: boolean;
    experiencePerDay: boolean;
}

export interface ExcelExportOptions {
    expeditions: ExcelExportOptions_Expeditions;
    combats: ExcelExportOptions_Combats;
    debrisFields: ExcelExportOptions_DebrisFields;
    lifeformDiscoveries: ExcelExportOptions_LifeformDiscoveries;
}

class ExcelExportClass {

    public async create(options: ExcelExportOptions, filename: string) {
        const workbook = xlsx.utils.book_new();

        await this.#writeExpeditions(workbook, options.expeditions);
        await this.#writeCombats(workbook, options.combats);
        await this.#writeDebrisFields(workbook, options.debrisFields);
        await this.#writeLifeformDiscoveries(workbook, options.lifeformDiscoveries);

        xlsx.writeFile(workbook, filename);
    }

    async #writeLifeformDiscoveries(workbook: xlsx.WorkBook, options: ExcelExportOptions_LifeformDiscoveries) {
        if (options.rawData) {
            await this.#writeLifeformDiscoveries_rawData(workbook);
        }

        if (options.experiencePerDay) {
            this.#writeLifeformDiscoveries_dailyExperience(workbook);
        }
    }
    #writeLifeformDiscoveries_dailyExperience(workbook: xlsx.WorkBook) {
        const dailyResults = LifeformDiscoveryDataModule.dailyResultsArray;

        const headers = [
            $i18n.$t.extension.common.date,
            ...ValidLifeformTypes.map(lf => $i18n.$t.ogame.lifeforms[lf]),
        ];
        const data = dailyResults.map(result => [
            $i18n.$d(result.date, 'date'),
            ...ValidLifeformTypes.map(lf => result.lifeformExperience[lf]),
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${$i18n.$t.extension.excelExport.lifeformDiscoveries.prefix} - ${$i18n.$t.extension.excelExport.lifeformDiscoveries.sheets.dailyExperience}`);
    }

    async #writeLifeformDiscoveries_rawData(workbook: xlsx.WorkBook) {
        const db = await getPlayerDatabase(GlobalOgameMetaData);
        const allDiscoveries = await db.getAll('lifeformDiscoveries');

        const headers = [
            $i18n.$t.extension.common.dateTime,
            $i18n.$t.extension.excelExport.lifeformDiscoveries.result,
            $i18n.$t.extension.excelExport.lifeformDiscoveries.lifeform,
            $i18n.$t.extension.excelExport.lifeformDiscoveries.experience,
            $i18n.$t.extension.excelExport.lifeformDiscoveries.artifactsSize,
            $i18n.$t.extension.excelExport.lifeformDiscoveries.artifacts,
        ];
        const data = allDiscoveries.map(disc => [
            $i18n.$d(disc.date, 'datetime'),
            ({
                [LifeformDiscoveryEventType.nothing]: $i18n.$t.extension.empire.lifeforms.eventTypes.nothing,
                [LifeformDiscoveryEventType.lostShip]: $i18n.$t.extension.empire.lifeforms.eventTypes.lostShip,
                [LifeformDiscoveryEventType.knownLifeformFound]: $i18n.$t.extension.empire.lifeforms.lifeformFound,
                [LifeformDiscoveryEventType.newLifeformFound]: $i18n.$t.extension.empire.lifeforms.lifeformFound,
                [LifeformDiscoveryEventType.artifacts]: $i18n.$t.extension.empire.lifeforms.eventTypes.artifacts,
            }[disc.type]),
            'lifeform' in disc ? $i18n.$t.ogame.lifeforms[disc.lifeform] : '',
            'experience' in disc ? disc.experience : '',
            'size' in disc ? disc.size : '',
            'artifacts' in disc ? disc.artifacts : '',
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${$i18n.$t.extension.excelExport.lifeformDiscoveries.prefix} - ${$i18n.$t.extension.excelExport.debrisFields.sheets.rawData}`);
    }

    async #writeDebrisFields(workbook: xlsx.WorkBook, options: ExcelExportOptions_DebrisFields) {
        if (options.rawData) {
            await this.#writeDebrisFields_rawData(workbook);
        }

        if (options.resourcesPerDay) {
            this.#writeDebrisFields_dailyResources(workbook);
        }
    }
    #writeDebrisFields_dailyResources(workbook: xlsx.WorkBook) {
        const dailyResults = DebrisFieldReportDataModule.dailyResultsArray;

        const headers = [
            $i18n.$t.extension.common.date,
            $i18n.$t.extension.resources[ResourceType.metal],
            $i18n.$t.extension.resources[ResourceType.crystal],
            $i18n.$t.extension.debrisFields.position,
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

        xlsx.utils.book_append_sheet(workbook, sheet, `${$i18n.$t.extension.excelExport.debrisFields.prefix} - ${$i18n.$t.extension.excelExport.debrisFields.sheets.dailyResources}`);
    }

    async #writeDebrisFields_rawData(workbook: xlsx.WorkBook) {
        const db = await getPlayerDatabase(GlobalOgameMetaData);
        const allDfReports = await db.getAll('debrisFieldReports');

        const headers = [
            $i18n.$t.extension.common.dateTime,
            $i18n.$t.extension.resources[ResourceType.metal],
            $i18n.$t.extension.resources[ResourceType.crystal],
            $i18n.$t.extension.debrisFields.position,
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

        xlsx.utils.book_append_sheet(workbook, sheet, `${$i18n.$t.extension.excelExport.debrisFields.prefix} - ${$i18n.$t.extension.excelExport.debrisFields.sheets.rawData}`);
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
            $i18n.$t.extension.common.date,
            ...ShipTypes.map(ship => $i18n.$t.ogame.ships[ship]),
        ];
        const data = dailyResults.map(day => [
            $i18n.$d(day.date, 'date'),
            ...ShipTypes.map(ship => day.lostShips.againstPlayers.ships[ship] + day.lostShips.onExpeditions.ships[ship]),
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${$i18n.$t.extension.excelExport.combats.prefix} - ${$i18n.$t.extension.excelExport.combats.sheets.dailyLostShips}`);
    }
    #writeCombats_dailyLoot(workbook: xlsx.WorkBook) {
        const dailyResults = CombatReportDataModule.dailyResultsArray;

        const headers = [
            $i18n.$t.extension.common.date,
            ...ResourceTypes.map(resource => $i18n.$t.extension.resources[resource]),
        ];
        const data = dailyResults.map(day => [
            $i18n.$d(day.date, 'date'),
            ...ResourceTypes.map(resource => day.loot.total[resource]),
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${$i18n.$t.extension.excelExport.combats.prefix} - ${$i18n.$t.extension.excelExport.combats.sheets.dailyLoot}`);
    }
    #writeCombats_dailyOverview(workbook: xlsx.WorkBook) {
        const dailyResults = CombatReportDataModule.dailyResultsArray;

        const headers = [
            $i18n.$t.extension.common.date,
            ...CombatResultTypes.map(type => `${$i18n.$t.extension.excelExport.combats.againstPlayers} (${$i18n.$t.extension.combats.combatResults[type]})`),
            ...CombatResultTypes.map(type => `${$i18n.$t.extension.excelExport.combats.onExpeditions} (${$i18n.$t.extension.combats.combatResults[type]})`),
        ];
        const data = dailyResults.map(day => [
            $i18n.$d(day.date, 'date'),
            ...CombatResultTypes.map(type => day.results.againstPlayers[type]),
            ...CombatResultTypes.map(type => day.results.onExpeditions[type]),
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${$i18n.$t.extension.excelExport.combats.prefix} - ${$i18n.$t.extension.excelExport.combats.sheets.dailyResults}`);
    }
    async #writeCombats_rawData(workbook: xlsx.WorkBook) {
        const db = await getPlayerDatabase(GlobalOgameMetaData);
        const allCombatReports = await db.getAll('combatReports');

        const headers = [
            $i18n.$t.extension.common.dateTime,
            $i18n.$t.extension.excelExport.combats.result,
            `${$i18n.$t.extension.excelExport.combats.coordinates} (${$i18n.$t.extension.excelExport.combats.galaxy})`,
            `${$i18n.$t.extension.excelExport.combats.coordinates} (${$i18n.$t.extension.excelExport.combats.system})`,
            `${$i18n.$t.extension.excelExport.combats.coordinates} (${$i18n.$t.extension.excelExport.combats.position})`,
            `${$i18n.$t.extension.excelExport.combats.coordinates} (${$i18n.$t.extension.excelExport.combats.targetType})`,
            $i18n.$t.extension.excelExport.combats.combatType,
            $i18n.$t.extension.excelExport.combats.expeditionCombatOpponent,
            ...ResourceTypes.map(resource => `${$i18n.$t.extension.excelExport.combats.loot} (${$i18n.$t.extension.resources[resource]})`),
            ...ShipTypes.map(ship => `${$i18n.$t.extension.excelExport.combats.lostShips} (${$i18n.$t.ogame.ships[ship]})`),
            `${$i18n.$t.extension.excelExport.combats.debrisField} (${$i18n.$t.extension.resources[ResourceType.metal]})`,
            `${$i18n.$t.extension.excelExport.combats.debrisField} (${$i18n.$t.extension.resources[ResourceType.crystal]})`,
        ];
        const data = allCombatReports.map(combat => [
            $i18n.$d(combat.date, 'datetime'),
            $i18n.$t.extension.combats.combatResults[combat.result],
            combat.coordinates.galaxy,
            combat.coordinates.system,
            combat.coordinates.position,
            combat.coordinates.type == PlanetType.moon ? $i18n.$t.extension.excelExport.combats.moon : $i18n.$t.extension.excelExport.combats.planet,
            combat.isExpedition ? $i18n.$t.extension.excelExport.combats.expeditionCombat : $i18n.$t.extension.excelExport.combats.playerCombat,
            combat.isExpedition
                ? combat.expeditionAttackType == 'pirates' ? $i18n.$t.extension.excelExport.combats.pirates : $i18n.$t.extension.excelExport.combats.aliens
                : '',
            ...ResourceTypes.map(resource => combat.loot[resource]),
            ...ShipTypes.map(ship => combat.lostShips[ship]),
            combat.debrisField.metal,
            combat.debrisField.crystal,
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${$i18n.$t.extension.excelExport.combats.prefix} - ${$i18n.$t.extension.excelExport.combats.sheets.rawData}`);
    }

    async #writeExpeditions(workbook: xlsx.WorkBook, options: ExcelExportOptions_Expeditions) {
        if (options.rawData) {
            await this.#writeExpeditions_rawData(workbook);
        }

        if (options.overviewPerDay) {
            this.#writeExpeditions_dailyOverview(workbook);
        }

        if (options.resourcesPerDay.amount) {
            this.#writeExpeditions_dailyResources_amount(workbook);
        }
        if (options.resourcesPerDay.sizes) {
            this.#writeExpeditions_dailyResources_sizes(workbook);
        }

        if (options.shipsPerDay.amount) {
            this.#writeExpeditions_dailyShips_amount(workbook);
        }
        if (options.shipsPerDay.sizes) {
            this.#writeExpeditions_dailyShips_sizes(workbook);
        }

        if (options.darkMatterPerDay.amount) {
            this.#writeExpeditions_dailyDarkMatter_amount(workbook);
        }
        if (options.darkMatterPerDay.sizes) {
            this.#writeExpeditions_dailyDarkMatter_sizes(workbook);
        }

        if (options.depletionPerDay) {
            this.#writeExpeditions_dailyDepletion(workbook);
        }
    }
    #writeExpeditions_dailyDepletion(workbook: xlsx.WorkBook) {
        const dailyResults = ExpeditionDataModule.dailyResultsArray;

        const depletionLevels: (ExpeditionDepletionLevel | 'unknown')[] = [...ExpeditionDepletionLevels, 'unknown'];

        const headers = [
            $i18n.$t.extension.common.date,
            ...depletionLevels.map(level => $i18n.$t.extension.expeditions.depletionLevels[level]),
        ];
        const data = dailyResults.map(day => [
            $i18n.$d(day.date, 'date'),
            ...depletionLevels.map(level => day.depletion[level]),
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${$i18n.$t.extension.excelExport.expeditions.prefix} - ${$i18n.$t.extension.excelExport.expeditions.sheets.dailyDepletion}`);
    }
    #writeExpeditions_dailyDarkMatter_sizes(workbook: xlsx.WorkBook) {
        const dailyResults = ExpeditionDataModule.dailyResultsArray;

        const headers = [
            $i18n.$t.extension.common.date,
            ...ExpeditionEventSizes.map(size => $i18n.$t.extension.expeditions.expeditionEventSizes[size]),
        ];
        const data = dailyResults.map(day => [
            $i18n.$d(day.date, 'date'),
            ...ExpeditionEventSizes.map(size => day.eventSizes.darkMatter[size]),
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${$i18n.$t.extension.excelExport.expeditions.prefix} - ${$i18n.$t.extension.excelExport.expeditions.sheets.dailyDarkMatterSize}`);
    }
    #writeExpeditions_dailyDarkMatter_amount(workbook: xlsx.WorkBook) {
        const dailyResults = ExpeditionDataModule.dailyResultsArray;

        const headers = [
            $i18n.$t.extension.common.date,
            $i18n.$t.ogame.premium.darkMatter,
        ];
        const data = dailyResults.map(day => [
            $i18n.$d(day.date, 'date'),
            day.findings.darkMatter,
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${$i18n.$t.extension.excelExport.expeditions.prefix} - ${$i18n.$t.extension.excelExport.expeditions.sheets.dailyDarkMatter}`);
    }
    #writeExpeditions_dailyShips_sizes(workbook: xlsx.WorkBook) {
        const dailyResults = ExpeditionDataModule.dailyResultsArray;

        const headers = [
            $i18n.$t.extension.common.date,
            ...ExpeditionEventSizes.map(size => $i18n.$t.extension.expeditions.expeditionEventSizes[size]),
        ];
        const data = dailyResults.map(day => [
            $i18n.$d(day.date, 'date'),
            ...ExpeditionEventSizes.map(size => day.eventSizes.fleet[size]),
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${$i18n.$t.extension.excelExport.expeditions.prefix} - ${$i18n.$t.extension.excelExport.expeditions.sheets.dailyShipsSize}`);
    }
    #writeExpeditions_dailyShips_amount(workbook: xlsx.WorkBook) {
        const dailyResults = ExpeditionDataModule.dailyResultsArray;

        const headers = [
            $i18n.$t.extension.common.date,
            ...ExpeditionFindableShipTypes.map(ship => $i18n.$t.ogame.ships[ship]),
        ];
        const data = dailyResults.map(day => [
            $i18n.$d(day.date, 'date'),
            ...ExpeditionFindableShipTypes.map(ship => day.findings.fleet[ship]),
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${$i18n.$t.extension.excelExport.expeditions.prefix} - ${$i18n.$t.extension.excelExport.expeditions.sheets.dailyShips}`);
    }
    #writeExpeditions_dailyResources_sizes(workbook: xlsx.WorkBook) {
        const dailyResults = ExpeditionDataModule.dailyResultsArray;

        const headers = [
            $i18n.$t.extension.common.date,
            ...ExpeditionEventSizes.map(size => $i18n.$t.extension.expeditions.expeditionEventSizes[size]),
        ];
        const data = dailyResults.map(day => [
            $i18n.$d(day.date, 'date'),
            ...ExpeditionEventSizes.map(size => day.eventSizes.resources[size]),
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${$i18n.$t.extension.excelExport.expeditions.prefix} - ${$i18n.$t.extension.excelExport.expeditions.sheets.dailyResourcesSize}`);
    }
    #writeExpeditions_dailyResources_amount(workbook: xlsx.WorkBook) {
        const dailyResults = ExpeditionDataModule.dailyResultsArray;

        const headers = [
            $i18n.$t.extension.common.date,
            ...ResourceTypes.map(resource => $i18n.$t.extension.resources[resource]),
        ];
        const data = dailyResults.map(day => [
            $i18n.$d(day.date, 'date'),
            ...ResourceTypes.map(resource => day.findings.resources[resource]),
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${$i18n.$t.extension.excelExport.expeditions.prefix} - ${$i18n.$t.extension.excelExport.expeditions.sheets.dailyResources}`);
    }
    #writeExpeditions_dailyOverview(workbook: xlsx.WorkBook) {
        const dailyResults = ExpeditionDataModule.dailyResultsArray;

        const headers = [
            $i18n.$t.extension.common.date,
            ...ExpeditionEventTypes.map(type => $i18n.$t.extension.expeditions.expeditionEvents[type]),
        ];
        const data = dailyResults.map(day => [
            $i18n.$d(day.date, 'date'),
            ...ExpeditionEventTypes.map(type => day.events[type]),
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${$i18n.$t.extension.excelExport.expeditions.prefix} - ${$i18n.$t.extension.excelExport.expeditions.sheets.dailyResults}`);
    }
    async #writeExpeditions_rawData(workbook: xlsx.WorkBook) {
        const db = await getPlayerDatabase(GlobalOgameMetaData);
        const allExpeditions = await db.getAll('expeditions');

        const headers = [
            $i18n.$t.extension.common.dateTime,
            $i18n.$t.extension.excelExport.expeditions.eventType,
            $i18n.$t.extension.excelExport.expeditions.eventSize,
            $i18n.$t.extension.expeditions.depletion,
            ...ResourceTypes.map(resource => $i18n.$t.extension.resources[resource]),
            ...ExpeditionFindableShipTypes.map(ship => $i18n.$t.ogame.ships[ship]),
            $i18n.$t.ogame.premium.darkMatter,
            $i18n.$t.extension.excelExport.expeditions.item,
        ];
        const data = allExpeditions.map(expo => [
            $i18n.$d(expo.date, 'datetime'),
            $i18n.$t.extension.expeditions.expeditionEvents[expo.type],
            'size' in expo && expo.size != null ? $i18n.$t.extension.expeditions.expeditionEventSizes[expo.size] : '',
            $i18n.$t.extension.expeditions.depletionLevels[expo.depletion ?? 'unknown'],
            ...ResourceTypes.map(resource => expo.type == ExpeditionEventType.resources ? expo.resources[resource] : ''),
            ...ExpeditionFindableShipTypes.map(ship => expo.type == ExpeditionEventType.fleet ? expo.fleet[ship] : ''),
            expo.type == ExpeditionEventType.darkMatter ? expo.darkMatter : '',
            expo.type == ExpeditionEventType.item ? expo.itemHash : '', //TODO: item name
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${$i18n.$t.extension.excelExport.expeditions.prefix} - ${$i18n.$t.extension.excelExport.expeditions.sheets.rawData}`);
    }
}

export const ExcelExport = new ExcelExportClass();
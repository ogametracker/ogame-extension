import { translations, formatDate } from '@stats/i18n';
import { getPlayerDatabase } from '@ogame-tracker/shared/db/access';
import { CombatResultTypes } from '@ogame-tracker/shared/models/combat-reports/CombatResultType';
import { ExpeditionDepletionLevel, ExpeditionDepletionLevels } from '@ogame-tracker/shared/models/expeditions/ExpeditionDepletionLevel';
import { ExpeditionFindableShipTypes } from '@ogame-tracker/shared/models/expeditions/ExpeditionEvents';
import { ExpeditionEventSizes } from '@ogame-tracker/shared/models/expeditions/ExpeditionEventSize';
import { ExpeditionEventType, ExpeditionEventTypes } from '@ogame-tracker/shared/models/expeditions/ExpeditionEventType';
import { LifeformDiscoveryEventType } from '@ogame-tracker/shared/models/lifeform-discoveries/LifeformDiscoveryEventType';
import { PlanetType } from '@ogame-tracker/shared/models/ogame/common/PlanetType';
import { ValidLifeformTypes } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import { ResourceType, ResourceTypes } from '@ogame-tracker/shared/models/ogame/resources/ResourceType';
import { ShipTypes } from '@ogame-tracker/shared/models/ogame/ships/ShipTypes';
import * as xlsx from 'xlsx';
import { useCombatReportStore } from '../../data/CombatReportDataModule';
import { useDebrisFieldReportStore } from '../../data/DebrisFieldReportDataModule';
import { useExpeditionStore } from '../../data/ExpeditionDataModule';
import { GlobalOgameMetaData } from '../../data/global';
import { useLifeformDiscoveryStore } from '../../data/LifeformDiscoveryDataModule';

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
        const dailyResults = useLifeformDiscoveryStore().dailyResultsArray;

        const headers = [
            translations().extension.common.date,
            ...ValidLifeformTypes.map(lf => translations().ogame.lifeforms[lf]),
        ];
        const data = dailyResults.map(result => [
            formatDate(result.date, 'date'),
            ...ValidLifeformTypes.map(lf => result.lifeformExperience[lf]),
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${translations().extension.excelExport.lifeformDiscoveries.prefix} - ${translations().extension.excelExport.lifeformDiscoveries.sheets.dailyExperience}`);
    }

    async #writeLifeformDiscoveries_rawData(workbook: xlsx.WorkBook) {
        const db = await getPlayerDatabase(GlobalOgameMetaData);
        const allDiscoveries = await db.getAll('lifeformDiscoveries');

        const headers = [
            translations().extension.common.dateTime,
            translations().extension.excelExport.lifeformDiscoveries.result,
            translations().extension.excelExport.lifeformDiscoveries.lifeform,
            translations().extension.excelExport.lifeformDiscoveries.experience,
            translations().extension.excelExport.lifeformDiscoveries.artifactsSize,
            translations().extension.excelExport.lifeformDiscoveries.artifacts,
        ];
        const data = allDiscoveries.map(disc => [
            formatDate(disc.date, 'datetime'),
            ({
                [LifeformDiscoveryEventType.nothing]: translations().extension.empire.lifeforms.eventTypes.nothing,
                [LifeformDiscoveryEventType.lostShip]: translations().extension.empire.lifeforms.eventTypes.lostShip,
                [LifeformDiscoveryEventType.knownLifeformFound]: translations().extension.empire.lifeforms.lifeformFound,
                [LifeformDiscoveryEventType.newLifeformFound]: translations().extension.empire.lifeforms.lifeformFound,
                [LifeformDiscoveryEventType.artifacts]: translations().extension.empire.lifeforms.eventTypes.artifacts,
            }[disc.type]),
            'lifeform' in disc ? translations().ogame.lifeforms[disc.lifeform] : '',
            'experience' in disc ? disc.experience : '',
            'size' in disc ? disc.size : '',
            'artifacts' in disc ? disc.artifacts : '',
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${translations().extension.excelExport.lifeformDiscoveries.prefix} - ${translations().extension.excelExport.debrisFields.sheets.rawData}`);
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
        const dailyResults = useDebrisFieldReportStore().dailyResultsArray;

        const headers = [
            translations().extension.common.date,
            translations().extension.resources[ResourceType.metal],
            translations().extension.resources[ResourceType.crystal],
            translations().extension.debrisFields.position,
        ];
        const data = dailyResults.flatMap(day => {
            const rows: [string, number, number, string][] = [];

            if (day.normal.metal > 0 || day.normal.crystal > 0) {
                rows.push([
                    formatDate(day.date, 'date'),
                    day.normal.metal,
                    day.normal.crystal,
                    '1-15',
                ]);
            }
            if (day.expedition.metal > 0 || day.expedition.crystal > 0) {
                rows.push([
                    formatDate(day.date, 'date'),
                    day.expedition.metal,
                    day.expedition.crystal,
                    '16',
                ]);
            }

            return rows;
        });
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${translations().extension.excelExport.debrisFields.prefix} - ${translations().extension.excelExport.debrisFields.sheets.dailyResources}`);
    }

    async #writeDebrisFields_rawData(workbook: xlsx.WorkBook) {
        const db = await getPlayerDatabase(GlobalOgameMetaData);
        const allDfReports = await db.getAll('debrisFieldReports');

        const headers = [
            translations().extension.common.dateTime,
            translations().extension.resources[ResourceType.metal],
            translations().extension.resources[ResourceType.crystal],
            translations().extension.debrisFields.position,
        ];
        const data = allDfReports.map(report => [
            formatDate(report.date, 'datetime'),
            report.metal,
            report.crystal,
            report.isExpeditionDebrisField == null ? ''
                : report.isExpeditionDebrisField
                    ? '16'
                    : '1-15'
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${translations().extension.excelExport.debrisFields.prefix} - ${translations().extension.excelExport.debrisFields.sheets.rawData}`);
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
        const dailyResults = useCombatReportStore().dailyResultsArray;

        const headers = [
            translations().extension.common.date,
            ...ShipTypes.map(ship => translations().ogame.ships[ship]),
        ];
        const data = dailyResults.map(day => [
            formatDate(day.date, 'date'),
            ...ShipTypes.map(ship => day.lostShips.againstPlayers.ships[ship] + day.lostShips.onExpeditions.ships[ship]),
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${translations().extension.excelExport.combats.prefix} - ${translations().extension.excelExport.combats.sheets.dailyLostShips}`);
    }
    #writeCombats_dailyLoot(workbook: xlsx.WorkBook) {
        const dailyResults = useCombatReportStore().dailyResultsArray;

        const headers = [
            translations().extension.common.date,
            ...ResourceTypes.map(resource => translations().extension.resources[resource]),
        ];
        const data = dailyResults.map(day => [
            formatDate(day.date, 'date'),
            ...ResourceTypes.map(resource => day.loot.total[resource]),
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${translations().extension.excelExport.combats.prefix} - ${translations().extension.excelExport.combats.sheets.dailyLoot}`);
    }
    #writeCombats_dailyOverview(workbook: xlsx.WorkBook) {
        const dailyResults = useCombatReportStore().dailyResultsArray;

        const headers = [
            translations().extension.common.date,
            ...CombatResultTypes.map(type => `${translations().extension.excelExport.combats.againstPlayers} (${translations().extension.combats.combatResults[type]})`),
            ...CombatResultTypes.map(type => `${translations().extension.excelExport.combats.onExpeditions} (${translations().extension.combats.combatResults[type]})`),
        ];
        const data = dailyResults.map(day => [
            formatDate(day.date, 'date'),
            ...CombatResultTypes.map(type => day.results.againstPlayers[type]),
            ...CombatResultTypes.map(type => day.results.onExpeditions[type]),
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${translations().extension.excelExport.combats.prefix} - ${translations().extension.excelExport.combats.sheets.dailyResults}`);
    }
    async #writeCombats_rawData(workbook: xlsx.WorkBook) {
        const db = await getPlayerDatabase(GlobalOgameMetaData);
        const allCombatReports = await db.getAll('combatReports');

        const headers = [
            translations().extension.common.dateTime,
            translations().extension.excelExport.combats.result,
            `${translations().extension.excelExport.combats.coordinates} (${translations().extension.excelExport.combats.galaxy})`,
            `${translations().extension.excelExport.combats.coordinates} (${translations().extension.excelExport.combats.system})`,
            `${translations().extension.excelExport.combats.coordinates} (${translations().extension.excelExport.combats.position})`,
            `${translations().extension.excelExport.combats.coordinates} (${translations().extension.excelExport.combats.targetType})`,
            translations().extension.excelExport.combats.combatType,
            ...ResourceTypes.map(resource => `${translations().extension.excelExport.combats.loot} (${translations().extension.resources[resource]})`),
            ...ShipTypes.map(ship => `${translations().extension.excelExport.combats.lostShips} (${translations().ogame.ships[ship]})`),
            `${translations().extension.excelExport.combats.debrisField} (${translations().extension.resources[ResourceType.metal]})`,
            `${translations().extension.excelExport.combats.debrisField} (${translations().extension.resources[ResourceType.crystal]})`,
        ];
        const data = allCombatReports.map(combat => [
            formatDate(combat.date, 'datetime'),
            translations().extension.combats.combatResults[combat.result],
            combat.coordinates.galaxy,
            combat.coordinates.system,
            combat.coordinates.position,
            combat.coordinates.type == PlanetType.moon ? translations().extension.excelExport.combats.moon : translations().extension.excelExport.combats.planet,
            combat.isExpedition ? translations().extension.excelExport.combats.expeditionCombat : translations().extension.excelExport.combats.playerCombat,
            ...ResourceTypes.map(resource => combat.loot[resource]),
            ...ShipTypes.map(ship => combat.lostShips[ship]),
            combat.debrisField.metal,
            combat.debrisField.crystal,
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${translations().extension.excelExport.combats.prefix} - ${translations().extension.excelExport.combats.sheets.rawData}`);
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
        const dailyResults = useExpeditionStore().dailyResultsArray;

        const depletionLevels: (ExpeditionDepletionLevel | 'unknown')[] = [...ExpeditionDepletionLevels, 'unknown'];

        const headers = [
            translations().extension.common.date,
            ...depletionLevels.map(level => translations().extension.expeditions.depletionLevels[level]),
        ];
        const data = dailyResults.map(day => [
            formatDate(day.date, 'date'),
            ...depletionLevels.map(level => day.depletion[level]),
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${translations().extension.excelExport.expeditions.prefix} - ${translations().extension.excelExport.expeditions.sheets.dailyDepletion}`);
    }
    #writeExpeditions_dailyDarkMatter_sizes(workbook: xlsx.WorkBook) {
        const dailyResults = useExpeditionStore().dailyResultsArray;

        const headers = [
            translations().extension.common.date,
            ...ExpeditionEventSizes.map(size => translations().extension.expeditions.expeditionEventSizes[size]),
        ];
        const data = dailyResults.map(day => [
            formatDate(day.date, 'date'),
            ...ExpeditionEventSizes.map(size => day.eventSizes.darkMatter[size]),
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${translations().extension.excelExport.expeditions.prefix} - ${translations().extension.excelExport.expeditions.sheets.dailyDarkMatterSize}`);
    }
    #writeExpeditions_dailyDarkMatter_amount(workbook: xlsx.WorkBook) {
        const dailyResults = useExpeditionStore().dailyResultsArray;

        const headers = [
            translations().extension.common.date,
            translations().ogame.premium.darkMatter,
        ];
        const data = dailyResults.map(day => [
            formatDate(day.date, 'date'),
            day.findings.darkMatter,
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${translations().extension.excelExport.expeditions.prefix} - ${translations().extension.excelExport.expeditions.sheets.dailyDarkMatter}`);
    }
    #writeExpeditions_dailyShips_sizes(workbook: xlsx.WorkBook) {
        const dailyResults = useExpeditionStore().dailyResultsArray;

        const headers = [
            translations().extension.common.date,
            ...ExpeditionEventSizes.map(size => translations().extension.expeditions.expeditionEventSizes[size]),
        ];
        const data = dailyResults.map(day => [
            formatDate(day.date, 'date'),
            ...ExpeditionEventSizes.map(size => day.eventSizes.fleet[size]),
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${translations().extension.excelExport.expeditions.prefix} - ${translations().extension.excelExport.expeditions.sheets.dailyShipsSize}`);
    }
    #writeExpeditions_dailyShips_amount(workbook: xlsx.WorkBook) {
        const dailyResults = useExpeditionStore().dailyResultsArray;

        const headers = [
            translations().extension.common.date,
            ...ExpeditionFindableShipTypes.map(ship => translations().ogame.ships[ship]),
        ];
        const data = dailyResults.map(day => [
            formatDate(day.date, 'date'),
            ...ExpeditionFindableShipTypes.map(ship => day.findings.fleet[ship]),
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${translations().extension.excelExport.expeditions.prefix} - ${translations().extension.excelExport.expeditions.sheets.dailyShips}`);
    }
    #writeExpeditions_dailyResources_sizes(workbook: xlsx.WorkBook) {
        const dailyResults = useExpeditionStore().dailyResultsArray;

        const headers = [
            translations().extension.common.date,
            ...ExpeditionEventSizes.map(size => translations().extension.expeditions.expeditionEventSizes[size]),
        ];
        const data = dailyResults.map(day => [
            formatDate(day.date, 'date'),
            ...ExpeditionEventSizes.map(size => day.eventSizes.resources[size]),
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${translations().extension.excelExport.expeditions.prefix} - ${translations().extension.excelExport.expeditions.sheets.dailyResourcesSize}`);
    }
    #writeExpeditions_dailyResources_amount(workbook: xlsx.WorkBook) {
        const dailyResults = useExpeditionStore().dailyResultsArray;

        const headers = [
            translations().extension.common.date,
            ...ResourceTypes.map(resource => translations().extension.resources[resource]),
        ];
        const data = dailyResults.map(day => [
            formatDate(day.date, 'date'),
            ...ResourceTypes.map(resource => day.findings.resources[resource]),
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${translations().extension.excelExport.expeditions.prefix} - ${translations().extension.excelExport.expeditions.sheets.dailyResources}`);
    }
    #writeExpeditions_dailyOverview(workbook: xlsx.WorkBook) {
        const dailyResults = useExpeditionStore().dailyResultsArray;

        const headers = [
            translations().extension.common.date,
            ...ExpeditionEventTypes.map(type => translations().extension.expeditions.expeditionEvents[type]),
        ];
        const data = dailyResults.map(day => [
            formatDate(day.date, 'date'),
            ...ExpeditionEventTypes.map(type => day.events[type]),
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${translations().extension.excelExport.expeditions.prefix} - ${translations().extension.excelExport.expeditions.sheets.dailyResults}`);
    }
    async #writeExpeditions_rawData(workbook: xlsx.WorkBook) {
        const db = await getPlayerDatabase(GlobalOgameMetaData);
        const allExpeditions = await db.getAll('expeditions');

        const headers = [
            translations().extension.common.dateTime,
            translations().extension.excelExport.expeditions.eventType,
            translations().extension.excelExport.expeditions.eventSize,
            translations().extension.expeditions.depletion,
            ...ResourceTypes.map(resource => translations().extension.resources[resource]),
            ...ExpeditionFindableShipTypes.map(ship => translations().ogame.ships[ship]),
            translations().ogame.premium.darkMatter,
            translations().extension.excelExport.expeditions.item,
        ];
        const data = allExpeditions.map(expo => [
            formatDate(expo.date, 'datetime'),
            translations().extension.expeditions.expeditionEvents[expo.type],
            'size' in expo && expo.size != null ? translations().extension.expeditions.expeditionEventSizes[expo.size] : '',
            translations().extension.expeditions.depletionLevels[expo.depletion ?? 'unknown'],
            ...ResourceTypes.map(resource => expo.type == ExpeditionEventType.resources ? expo.resources[resource] : ''),
            ...ExpeditionFindableShipTypes.map(ship => expo.type == ExpeditionEventType.fleet ? expo.fleet[ship] : ''),
            expo.type == ExpeditionEventType.darkMatter ? expo.darkMatter : '',
            expo.type == ExpeditionEventType.item ? expo.itemHash : '', //TODO: item name
        ]);
        const sheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

        xlsx.utils.book_append_sheet(workbook, sheet, `${translations().extension.excelExport.expeditions.prefix} - ${translations().extension.excelExport.expeditions.sheets.rawData}`);
    }
}

export const ExcelExport = new ExcelExportClass();
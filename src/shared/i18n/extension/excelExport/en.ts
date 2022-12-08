import { ExcelExportTranslations } from "./type";

export const en: ExcelExportTranslations = {
    header: 'Excel Export',
    chooseBelowMessage: 'Choose below which data you want to include in the export:',
    groups: {
        expeditions: {
            header: 'Expeditions',
            rawData: 'Raw data (every single tracked expedition)',
            dailyOverview: 'Overview of results per day',
            dailyDepletion: 'Overview of system depletion per day',
            dailyResources: 'Resource findings per day',
            dailyResourceSizes: 'Sizes of resource findings per day',
            dailyShips: 'Ship findings per day',
            dailyShipSizes: 'Sizes of ship findings per day',
            dailyDarkMatter: 'Dark matter findings per day',
            dailyDarkMatterSizes: 'Sizes of dark matter findings per day',
        },
        combats: {
            header: 'Combats',
            rawData: 'Raw data (every single tracked combat result)',
            dailyResults: 'Combat results per day',
            dailyLoot: 'Loot balance per day',
            dailyLostShips: 'Lost ships per day',
        },
        debrisFields: {
            header: 'Debris Fields',
            rawData: 'Raw data (every single tracked harvest report)',
            dailyResources: 'Harvested resources per day',
        },
        lifeformDiscoveries: {
            header: 'Discovery Missions',
            rawData: 'Raw data (every single tracked discovery mission)',
            dailyExperience: 'Gained experience per day',
        },
    },
    generateButton: 'Generate Excel export',

    expeditions: {
        prefix: 'EX',

        sheets: {
            rawData: 'Raw Data',
            dailyDepletion: 'Daily System Depletion',
            dailyResults: 'Daily Results',
            dailyResources: 'Daily Resources',
            dailyResourcesSize: 'Daily Resources (Size)',
            dailyShips: 'Daily Ships',
            dailyShipsSize: 'Daily Ships (Size)',
            dailyDarkMatter: 'Daily Dark Matter',
            dailyDarkMatterSize: 'Daily Dark Matter (Size)',
        },

        eventType: 'Type',
        eventSize: 'Size',
        item: 'Item',
    },
    combats: {
        prefix: 'CR',

        sheets: {
            rawData: 'Raw Data',
            dailyResults: 'Daily Results',
            dailyLoot: 'Daily Loot',
            dailyLostShips: 'Daily Lost Ships',
        },

        result: 'Combat Result',
        coordinates: 'Coordinates',
        galaxy: 'Galaxy',
        system: 'System',
        position: 'Position',
        targetType: 'Target Type',
        combatType: 'Combat Type',
        expeditionCombatOpponent: 'Expedition Combat Opponent',
        loot: 'Loot',
        lostShips: 'Lost Ships',
        debrisField: 'Debris Field',
        moon: 'Moon',
        planet: 'Planet',
        expeditionCombat: 'Expedition Combat',
        playerCombat: 'Player Combat',
        pirates: 'Pirates',
        aliens: 'Aliens',

        againstPlayers: 'Against Players',
        onExpeditions: 'On Expeditions',
    },
    debrisFields: {
        prefix: 'DF',

        sheets: {
            rawData: 'Raw Data',
            dailyResources: 'Daily Resources',
        },
    },
    lifeformDiscoveries: {
        prefix: 'LF',

        sheets:{
            rawData: 'Raw Data',
            dailyExperience: 'Daily Experience',
        },

        result: 'Finding',
        experience: 'Experience',
        lifeform: 'Lifeform',
        artifacts: 'Artifacts',
        artifactsSize: 'Size',
    },
};
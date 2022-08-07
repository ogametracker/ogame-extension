export interface ExcelExportTranslations {
    header: string;
    chooseBelowMessage: string;
    groups: {
        expeditions: {
            header: string;
            rawData: string;
            dailyOverview: string;
            dailyDepletion: string;
            dailyResources: string;
            dailyResourceSizes: string;
            dailyShips: string;
            dailyShipSizes: string;
            dailyDarkMatter: string;
            dailyDarkMatterSizes: string;
        };
        combats: {
            header: string;
            rawData: string;
            dailyResults: string;
            dailyLoot: string;
            dailyLostShips: string;
        };
        debrisFields: {
            header: string;
            rawData: string;
            dailyResources: string;
        };
        lifeformDiscoveries: {
            header: string;
            rawData: string;
            dailyExperience: string;
        };
    };
    generateButton: string;

    expeditions: {
        prefix: string;

        sheets: {
            rawData: string;
            dailyResults: string;
            dailyDepletion: string;
            dailyResources: string;
            dailyShips: string;
            dailyDarkMatter: string;
        };

        eventType: string;
        eventSize: string;
        item: string;
    };
    combats: {
        prefix: string;

        sheets: {
            rawData: string;
            dailyResults: string;
            dailyLoot: string;
            dailyLostShips: string;
        };

        result: string;
        coordinates: string;
        galaxy: string;
        system: string;
        position: string;
        targetType: string;
        combatType: string;
        expeditionCombatOpponent: string;
        loot: string;
        lostShips: string;
        debrisField: string;
        moon: string;
        planet: string;
        expeditionCombat: string;
        playerCombat: string;
        pirates: string;
        aliens: string;

        againstPlayers: string;
        onExpeditions: string;
    };
    debrisFields: {
        prefix: string;

        sheets: {
            rawData: string;
            dailyResources: string;
        };
    };
    lifeformDiscoveries: {
        prefix: string;

        sheets: {
            rawData: string;
            dailyExperience: string;
        };
    };
}
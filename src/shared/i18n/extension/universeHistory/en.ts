import { UniverseHistoryTranslations } from "./type";

export const en: UniverseHistoryTranslations = {
    header: 'Universe History',
    settings: {  
        messages: {
            notEnabled: `Universe history tracking is not enabled. Enabling this
            feature will track changes in point distribution, planets and moons
            including their names ands coordinates, names and more of players
            and alliances. However, this will generate a lot of data which is
            why this feature is disabled by default. If you enable this feature,
            you can set below at which times in a day you want to update. The
            more times you select the more data will be generated. You can
            disable this feature later again but then you will not be able to
            view already tracked data.`,
            historyTrackingNotEnabled: 'LOCA: history tracking not enabled',
        },
        enableHighscoreTrackingOnly: 'Enable universe history tracking (highscore only)',
        enableHistoryTracking: 'Include all changes universe history tracking',
    },

    tabs: {
        players: 'Players',
        alliances: 'Alliances',

        subtabs: {
            highscore: 'Highscore',
            history: 'History',
        },
    },

    playerSelection: {
        header: 'Player selection',
        search: 'search for player',
    },
    allianceSelection: {
        header: 'Alliance selection',
        search: 'search for alliance',
    },

    highscoreTabs: {
        total: 'Total',
        economy: 'Economy',
        research: 'Research',
        military: 'Military',
        militaryBuilt: 'Military built',
        militaryDestroyed: 'Military destroyed',
        militaryLost: 'Military lost',
        honor: 'Honor',
        numberOfShips: 'Number of ships',
    },
    historyTabs: {
        status: 'Status',
        nicknames: 'Nicknames',
        alliances: 'Alliances',
        planetAndMoons: 'Planets & Moons',
    },

    noAlliance: 'no alliance',
    today: 'today',
    name: 'Name',
    alliance: 'Alliance',
    from: 'From',
    until: 'Until',

    status: {
        active: 'Active',
        vacation: 'Vacation Mode',
        inactive: 'Inactive (>= 7 days)',
        inactiveLong: 'Inactive (>= 28 days)',
        banned: 'Banned',
        outlaw: 'Outlaw',
        deleted: 'Deleted',
        admin: 'Admin',
    },
};
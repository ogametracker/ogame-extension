import { UniverseHistoryTranslations } from "./type";

export const de: UniverseHistoryTranslations = {
    header: 'Universumshistorie',
    settings: {  
        messages: {
            notEnabled: `LOCA: Universe history tracking is not enabled. Enabling this
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
        players: 'Spieler',
        alliances: 'Allianzen',

        subtabs: {
            highscore: 'Highscore',
            history: 'Historie',
        },
    },

    playerSelection: {
        header: 'Spielerauswahl',
        search: 'Spieler suchen',
    },
    allianceSelection: {
        header: 'Allianzauswahl',
        search: 'Allianz suchen',
    },

    highscoreTabs: {
        total: 'Gesamt',
        economy: 'Ökonomie',
        research: 'Forschung',
        military: 'Militär',
        militaryBuilt: 'Militär gebaut',
        militaryDestroyed: 'Militär zerstört',
        militaryLost: 'Militär verloren',
        honor: 'Ehrenpunkte',
        numberOfShips: 'Anzahl Schiffe',
    },
    historyTabs: {
        status: 'Status',
        nicknames: 'Nicknamen',
        alliances: 'Allianzen',
        planetAndMoons: 'Planeten & Monde',
    },

    noAlliance: 'keine Allianz',
    today: 'heute',
    name: 'Name',
    alliance: 'Allianz',
    from: 'Von',
    until: 'Bis',

    status: {
        active: 'Aktiv',
        vacation: 'Urlaubsmodus',
        inactive: 'Inaktiv (>= 7 Tage)',
        inactiveLong: 'Inaktiv (>= 28 Tage)',
        banned: 'Gesperrt',
        outlaw: 'Vogelfrei',
        deleted: 'Gelöscht',
        admin: 'Admin',
    },
};
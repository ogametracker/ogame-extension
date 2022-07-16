import { UniverseHistoryTranslations } from "./type";

export const en: UniverseHistoryTranslations = {
    header: 'Universe History',
    settings: {  
        messages: {
            notEnabledHtml: `
            <b>Universe highscore tracking is not enabled.</b><br/>
            Enabling this feature will track highscore changes for players and alliances.
            `,
            historyTrackingNotEnabledHtml: `
            <b>Universe history tracking is not enabled.</b><br/>
            Enabling this feature will additionally track all changes for players and alliances.<br/>
            This includes player and alliance name and tag changes, alliance membership changes, 
            player status changes, and changes regarding planets and moons 
            including names, coordinates, and abandoned/destroyed planets and moons.<br />
            <i>This can generate a lot of data!
            You can deactivate this feature <a href="#/settings/universe-history">in the settings menu</a> 
            again.</i>
            `,
            trackingTimesHtml: `
            At least once every day the highscores and universe data (if enabled) will be updated.<br/>
            You can set the update times below.
            If an update was missed then it will update as soon as possible afterwards.
            `
        },
        enableHighscoreTrackingOnly: 'Enable universe highscore tracking',
        enableHistoryTracking: 'Enable universe history tracking',
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
        lifeform: 'Lifeform',
        lifeformDiscoveries: 'Lifeform discoveries',
        lifeformEconomy: 'Lifeform economy',
        lifeformTechnology: 'Lifeform technology',
    },
    historyTabs: {
        status: 'Status',
        nicknames: 'Nicknames',
        alliances: 'Alliances',
        planetAndMoons: 'Planets & Moons',

        tags: 'Tags',
        names: 'Names',
        members: 'Members',
    },

    noAlliance: 'no alliance',
    today: 'today',
    name: 'Name',
    tag: 'Tag',
    members: 'Members',
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

    loadingTakingLong: 'Loading the data is taking longer than expected. The database is probably updating right now, so please be patient or try again later.',
};
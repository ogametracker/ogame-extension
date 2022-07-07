import { UniverseHistoryTranslations } from "./type";

export const de: UniverseHistoryTranslations = {
    header: 'Universumshistorie',
    settings: {  
        messages: {
            notEnabledHtml: `
            <b>Highscore-Tracking des Universums ist deaktiviert.</b><br/>
            Aktivieren dieses Features sorgt dafür, dass Highscoreveränderungen 
            für alle Spieler und Allianzen getrackt werden.
            `,
            historyTrackingNotEnabledHtml: `
            <b>Tracking der Universumshistorie ist deaktiviert.</b><br/>
            Ist dieses Feature aktiviert, werden zusätzlich alle Änderungen von Spieler-
            und Allianzinformationen getrackt.<br />
            Dies beinhaltet Änderungen an Spieler- und Allianznamen und -Tags, Allianzmitgliedschaften,
            Veränderungen an Spielerstatus, sowie Änderungen zu Planeten und Monden inklusive
            Veränderungen der Namen und Koordinaten, und verlassene/zerstörte Planeten und Monde.<br/>

            <i>Dies kann eine Menge Daten generieren! 
            Wird die Datenmenge zu groß, 
            kann das Feature <a href="#/settings/universe-history">in den Einstellungen</a> 
            wieder deaktiviert werden.</i>
            `,
            trackingTimesHtml: `
            Mindestens einmal täglich werden Highscores und Universumsinformationen (sofern aktiviert) aktualisiert.<br/>
            Die Uhrzeiten für die Aktualisierungen können unten eingestellt werden.
            Falls eine Aktualisierung zu einer Uhrzeit verpasst wurde, wird das Update so früh wie möglich nachgeholt.
            `
        },
        enableHighscoreTrackingOnly: 'Highscore-Tracking aktivieren',
        enableHistoryTracking: 'Tracking der Universumshistorie aktivieren',
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
        lifeform: 'Lebensform',
        lifeformDiscoveries: 'Lebensform-Entdeckungen',
        lifeformEconomy: 'Lebensform-Ökonomie',
        lifeformTechnology: 'Lebensform-Technologie',
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
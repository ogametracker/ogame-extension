import { DbUniverseHistoryScoreType } from "@/shared/db/schema/universe-history";

export interface UniverseHistoryTranslations {
    header: string;
    settings: {  
        messages: {
            notEnabledHtml: string;
            historyTrackingNotEnabledHtml: string;
            trackingTimesHtml: string;
        };
        enableHighscoreTrackingOnly: string;
        enableHistoryTracking: string;
    };

    tabs: {
        players: string;
        alliances: string;

        subtabs: {
            highscore: string;
            history: string;
        };
    };

    playerSelection: {
        header: string;
        search: string;
    };
    allianceSelection: {
        header: string;
        search: string;
    };

    highscoreTabs: Record<DbUniverseHistoryScoreType, string>;
    historyTabs: {
        status: string;
        nicknames: string;
        alliances: string;
        planetAndMoons: string;
    };

    today: string;
    noAlliance: string;
    name: string;
    alliance: string;
    from: string;
    until: string;

    status: {
        active: string;
        vacation: string;
        inactive: string;
        inactiveLong: string;
        banned: string;
        outlaw: string;
        deleted: string;
        admin: string;
    };
}
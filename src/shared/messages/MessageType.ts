export enum MessageType {
    StayAlive = 'internal/stay-alive',

    // notifications
    NewNotification = 'notification/new',
    
    // expeditions
    TrackExpedition = 'expedition/track-expedition',
    Expedition = 'expedition/single',
    NewExpedition = 'expedition/new',

    // debris field reports
    DebrisFieldReport = 'debris-fields/single',
    NewDebrisFieldReport = 'debris-fields/new',
    TrackDebrisFieldReport = 'debris-fields/track',
    TrackManualDebrisFieldReport = 'debris-fields/track-manually',

    // combat reports
    CombatReport = 'combat-reports/single',
    NewCombatReport = 'combat-reports/new',
    TrackCombatReport = 'combat-reports/track',
    RequestSingleCombatReport = 'combat-reports/request-single-report',
    CombatReportUnknown = 'combat-reports/is-unknown',

    // message tracking
    WillNotBeTracked = 'message-tracking/no-tracking', // message will not be tracked because it is no expedition, combat, or df report
    TrackingError = 'message-tracking/error',

    // empire tracking
    UpdatePlanetData = 'empire/update-planet-data',
    UpdatePlanetActiveItems = 'empire/update-active-items',
    UpdatePlanetBuildingLevels = 'empire/update-buildings-levels',
    UpdateResearchLevels = 'empire/update-research-levels',
    UpdatePlanetShipCounts = 'empire/update-planet-ships',
    UpdatePlanetDefenseCounts = 'empire/update-planet-defenses',
    UpdateActiveOfficers = 'empire/update-active-officers',
    UpdatePlayerClass = 'empire/update-player-class',
    UpdateAllianceClass = 'empire/update-alliance-class',
    UpdatePlanetProductionSettings = 'empire/update-planet-production-settings',
    UpdatePlayerName = 'empire/update-player-name', //TODO: put somewhere else
    UpdateUniverseName = 'empire/update-universe-name', //TODO: put somewhere else
    NotifyEmpireDataUpdate = 'empire/notify-update',

    // settings
    RequestSettings = 'settings/request-data',
    Settings = 'settings/data',
    NotifySettingsUpdate = 'settings/notify-update',

    // universe history
    UniverseHistoryData = 'universe-history/data',
    NotifyUniverseHistoryUpdate = 'universe-history/notify-update',
    RequestUniverseHistoryData = 'universe-history/request-data',

    // server settings
    NotifyServerSettingsUpdate = 'server-settings/notify-update',
}
export enum MessageType {
    StayAlive = 'internal/stay-alive',
    DropDatabaseConnections = 'internal/drop-db-connections',

    // notifications
    Notification = 'notification',
    
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
    WillNotBeTracked = 'message-tracking/no-tracking', // message will not be tracked because it is ignored for some reason (e.g. espionage combats)
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
    NotifyEmpireDataUpdate = 'empire/notify-update',

    // settings
    RequestSettings = 'settings/request-data',
    Settings = 'settings/data',
    NotifySettingsUpdate = 'settings/notify-update',

    // universe history
    NotifyUniverseHistoryUpdate = 'universe-history/notify-update',

    // server settings
    NotifyServerSettingsUpdate = 'server-settings/notify-update',

    // accounts & universes
    UpdatePlayerName = 'accounts/update-player-name',
    UpdateUniverseName = 'universes/update-universe-name', 

    // Universe-specific settings
    NotifyUniverseSpecificSettingsUpdate = 'universe-specific-settings/notify-update',

    // lifeforms
    UpdateLifeformExperience = 'lifeforms/update-lifeform-experience',
    UpdateSelectedLifeform = 'lifeforms/update-selected-lifeform',
    UpdatePlanetActiveLifeformBuildingLevels = 'lifeforms/update-active-building-levels',
    UpdatePlanetLifeformBuildingLevels = 'lifeforms/update-all-building-levels',
    UpdatePlanetActiveLifeformTechnologyLevels = 'lifeforms/update-active-technology-levels',
    UpdatePlanetLifeformTechnologyLevels = 'lifeforms/update-all-technology-levels',
    TrackLifeformDiscovery = 'lifeforms/track-discovery',
    LifeformDiscovery = 'lifeforms/discovery',
    NewLifeformDiscovery = 'lifeforms/new-discovery',
}

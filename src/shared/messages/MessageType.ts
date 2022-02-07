export enum MessageType {
    StayAlive = 'internal/stay-alive',

    // notifications
    CreateNotification = 'notification/create',
    ShowNotification = 'notification/show',
    HideNotification = 'notification/hide',
    
    // expeditions
    TrackExpedition = 'expedition/track-expedition',
    Expedition = 'expedition/expedition-data/single',
    AllExpeditions = 'expedition/expedition-data/all',
    NewExpedition = 'expedition/new',
    RequestExpeditionEvents = 'expedition/request-expeditions',

    // debris field reports
    DebrisFieldReport = 'debris-fields/single',
    NewDebrisFieldReport = 'debris-fields/new',
    AllDebrisFieldReports = 'debris-fields/all',
    TrackDebrisFieldReport = 'debris-fields/track',
    RequestDebrisFieldReports = 'debris-fields/request-reports',

    // message tracking
    WillNotBeTracked = 'message-tracking/no-tracking', // message will not be tracked because it is no expedition, combat, or df report
}
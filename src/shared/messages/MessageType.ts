export enum MessageType {
    StayAlive = 'internal/stay-alive',
    
    // debug
    Debug_UnhandledError = 'debug/unhandled-error',

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
}
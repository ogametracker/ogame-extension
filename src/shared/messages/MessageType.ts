export enum MessageType {
    // common
    Subscribe = 'subscribe',
    Unsubscribe = 'unsubscribe',

    // debug
    Debug_UnhandledError = 'debug/unhandledError',

    // notifications
    CreateNotification = 'notification/create',
    ShowNotification = 'notification/show',
    HideNotification = 'notification/hide',
    
    // expeditions
    TrackExpedition = 'expedition/track',
    ExpeditionEvent = 'expedition/event',
}
export enum MessageType {
    // common
    Subscribe = 'subscribe',
    Unsubscribe = 'unsubscribe',

    // notifications
    CreateNotification = 'notification/create',
    ShowNotification = 'notification/show',
    HideNotification = 'notification/hide',
    
    // expeditions
    TrackExpedition = 'expedition/track',
}
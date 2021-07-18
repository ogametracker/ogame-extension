export default {
    settingsSaved: {
        title: 'Einstellungen gespeichert',
        text: 'Die Einstellungen wurden erfolgreich gespeichert.',
    },
    migration: {
        inProgress: {
            title: 'Migration',
            text: 'Migration der Daten wird durchgeführt. Bitte warten...',
        },
        success: {
            title: 'Migration',
            text: 'Migration erfolgreich durchgeführt.',
        },
        error: {
            title: 'Migration',
            text: 'Bei der Migration der Daten ist ein Fehler aufgetreten.',
        },
    },
    combats: {
        success: {
            title: 'Neue Kampfberichte',
            text: (newMessageCount: number) => `Es wurden ${newMessageCount} neue Kampfberichte eingelesen.`,
        },
        error: {
            title: 'Fehler',
            text: (newErrorCount: number) => `Es wurden ${newErrorCount} Kampfberichte nicht eingelesen.`,
        },
    },
    debrisFields: {
        success: {
            title: 'Neue TF-Nachrichten',
            text: (newMessageCount: number) => `Es wurden ${newMessageCount} neue TF-Nachrichten eingelesen.`,
        },
        error: {
            title: 'Fehler',
            text: (newErrorCount: number) => `Es wurden ${newErrorCount} TF-Nachrichten nicht eingelesen.`,
        },
    },
    expeditions: {
        success: {
            title: 'Neue Expeditionen',
            text: (newMessageCount: number) => `Es wurden ${newMessageCount} neue Expeditionen eingelesen.`,
        },
        error: {
            title: 'Fehler',
            text: (newErrorCount: number) => `Es wurden ${newErrorCount} Expeditionen nicht eingelesen. Die fehlerhaften Expeditionsbericht wurden farblich markiert.`,
        },
        fleetLost: {
            title: 'Flottenverlust',
            text: 'Eine Expedition ist nicht zurückgekehrt.',
        },
    },
};
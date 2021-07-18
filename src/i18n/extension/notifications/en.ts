export default {
    settingsSaved: {
        title: 'Settings saved',
        text: 'The settings were saved successfully.',
    },
    migration: {
        inProgress: {
            title: 'Migration',
            text: 'Migration in progress, please wait...',
        },
        success: {
            title: 'Migration',
            text: 'Migration successful.',
        },
        error: {
            title: 'Migration',
            text: 'An error occured during the migration..',
        },
    },
    combats: {
        success: {
            title: 'New Combat Reports',
            text: (newMessageCount: number) => `${newMessageCount} new combat report have been tracked.`,
        },
        error: {
            title: 'Error',
            text: (newErrorCount: number) => `Failed to track ${newErrorCount} combat records.`,
        },
    },
    debrisFields: {
        success: {
            title: 'New DF Messages',
            text: (newMessageCount: number) => `${newMessageCount} new DF messages have been tracked.`,
        },
        error: {
            title: 'Error',
            text: (newErrorCount: number) => `Failed to track ${newErrorCount} DF messages.`,
        },
    },
    expeditions: {
        success: {
            title: 'New Expeditions',
            text: (newMessageCount: number) => `${newMessageCount} new expeditions have been tracked.`,
        },
        error: {
            title: 'Error',
            text: (newErrorCount: number) => `Failed to track ${newErrorCount} expeditions. The messages of these expeditions have been marked in color.`,
        },
        fleetLost: {
            title: 'Lost Fleet',
            text: 'An expedition will not return.',
        },
    },
};
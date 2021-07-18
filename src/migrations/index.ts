import i18n from "@/i18n";
import OgameMetaData from "@/models/ogame/OgameMetaData";
import ExtensionDataVersion from "@/models/versioning/ExtensionDataVersion";
import NotificationModule from "@/store/modules/NotificationModule";
import asyncChromeStorage from "@/utils/asyncChromeStorage";
import migration_v0_v1 from "./migration_v0_v1";
import migration_v1_v1_1 from "./migration_v1_v1.1fleetfix";

export default async function migrations() {
    const dataVersionStorageKey = `${OgameMetaData.storageKeyPrefix}-version`;
    const version = await asyncChromeStorage.get<string>(dataVersionStorageKey) ?? ExtensionDataVersion.pre;

    if (version == ExtensionDataVersion.current)
        return;

    const notification = NotificationModule.addNotification({
        type: 'info',
        title: i18n.messages.extension.notifications.migration.inProgress.title,
        text: i18n.messages.extension.notifications.migration.inProgress.text,
    });

    try {
        switch (version) {
            case ExtensionDataVersion.pre:
                await migration_v0_v1();
                await asyncChromeStorage.set(dataVersionStorageKey, ExtensionDataVersion["1.0"]);
            // eslint-disable no-fallthrough

            case ExtensionDataVersion["1.0"]:
                await migration_v1_v1_1();
                await asyncChromeStorage.set(dataVersionStorageKey, ExtensionDataVersion["1.1"]);
            // eslint-disable no-fallthrough

            case ExtensionDataVersion["1.1"]:
                // add migration call here if the data format changed
                break;
        }

        setTimeout(() => {
            notification.type = 'success';
            notification.text = i18n.messages.extension.notifications.migration.success.text;

            setTimeout(() => {
                NotificationModule.remove(notification);
            }, 2000);
        }, 2000);
    } catch {
        notification.type = 'error';
        notification.text = i18n.messages.extension.notifications.migration.error.text;
    }
}
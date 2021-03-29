import OgameMetaData from "@/models/ogame/OgameMetaData";
import ExtensionDataVersion from "@/models/versioning/ExtensionDataVersion";
import NotificationModule from "@/store/modules/NotificationModule";
import asyncChromeStorage from "@/utils/asyncChromeStorage";
import migration_v0_v1 from "./migration_v0_v1";

export default async function migrations() {
    const dataVersionStorageKey = `${OgameMetaData.storageKeyPrefix}-version`;
    const version = await asyncChromeStorage.get<string>(dataVersionStorageKey) ?? ExtensionDataVersion.pre;

    if (version == ExtensionDataVersion.current)
        return;

    //TODO: localization
    const notification = NotificationModule.addNotification({
        type: 'info',
        text: 'Migration der Daten wird druchgeführt. Bitte warten...',
        title: 'Migration',
    });

    try {
        switch (version) {
            case ExtensionDataVersion.pre:
                await migration_v0_v1();
                await asyncChromeStorage.set(dataVersionStorageKey, ExtensionDataVersion["1.0"]);

            case ExtensionDataVersion["1.0"]:
                // add migration call here if the data format changed
                break;
        }

        setTimeout(() => {
            notification.type = 'success';
            //TODO: localization
            notification.text = 'Migration erfolgreich durchgeführt.';

            setTimeout(() => {
                NotificationModule.remove(notification);
            }, 2000);
        }, 2000);
    } catch {
        notification.type = 'error';
        //TODO: localization
        notification.text = 'Bei der Migration der Daten ist ein Fehler aufgetreten.';
    }
}
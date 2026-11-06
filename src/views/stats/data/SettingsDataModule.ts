import { toDatabaseRecord } from './toDatabaseRecord';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { createReadiness, listenForMessages } from './lifecycle';
import { MessageType } from '@ogame-tracker/shared/messages/MessageType';
import type { Message } from '@ogame-tracker/shared/messages/Message';
import { GlobalOgameMetaData, statsViewUuid } from './global';
import { broadcastMessage } from '@ogame-tracker/shared/communication/broadcastMessage';
import type { Settings } from '@ogame-tracker/shared/models/settings/Settings';
import type { NotifySettingsUpdateMessage, RequestSettingsMessage, SettingsMessage } from '@ogame-tracker/shared/messages/settings';
import { ogameMetasEqual } from '@ogame-tracker/shared/ogame-web/ogameMetasEqual';
import { getGlobalDatabase } from '@ogame-tracker/shared/db/access';
import { sendMessage } from '@ogame-tracker/shared/communication/sendMessage';

export const useSettingsStore = defineStore('settings', () => {
    const { ready, resolveReady, rejectReady } = createReadiness();

    const settings = ref<Settings>(null!);

    function updateSettings(nextSettings: Settings) {
        console.debug('updating settings', nextSettings);
        const snapshot = toDatabaseRecord(nextSettings);
        settings.value = nextSettings;

        void (async () => {
            const db = await getGlobalDatabase();
            await db.put('settings', snapshot, 0);

            const msg: NotifySettingsUpdateMessage = {
                ogameMeta: GlobalOgameMetaData,
                senderUuid: statsViewUuid,
                type: MessageType.NotifySettingsUpdate,
            }
            await broadcastMessage(msg);
        })().catch(console.error);
    }

    async function initialize() {
        initCommunication();
        requestData();
    }

    function initCommunication() {
        listenForMessages(onMessage);
    }

    function requestData() {
        const requestMessage: RequestSettingsMessage = {
            type: MessageType.RequestSettings,
            ogameMeta: GlobalOgameMetaData,
            senderUuid: statsViewUuid,
        };
        sendMessage(requestMessage);
    }

    async function onMessage(msg: Message) {
        const { type, ogameMeta } = msg;
        if (!ogameMetasEqual(ogameMeta, GlobalOgameMetaData)) {
            return;
        }

        if (msg.senderUuid == statsViewUuid) {
            return;
        }

        switch (type) {
            case MessageType.NotifySettingsUpdate: {
                requestData();
                break;
            }

            case MessageType.Settings: {
                const message = msg as SettingsMessage;
                settings.value = message.data;

                resolveReady();
                break;
            }
        }
    }

    void initialize().catch(rejectReady);

    return {
        ready,
        settings,
        updateSettings,
    };
});

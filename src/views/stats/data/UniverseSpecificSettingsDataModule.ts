import { toDatabaseRecord } from './toDatabaseRecord';
import { defineStore } from 'pinia';
import { shallowRef } from 'vue';
import { createReadiness, listenForMessages } from './lifecycle';
import { broadcastMessage } from '@ogame-tracker/shared/communication/broadcastMessage';
import { getPlayerDatabase } from '@ogame-tracker/shared/db/access';
import type { Message } from '@ogame-tracker/shared/messages/Message';
import { MessageType } from '@ogame-tracker/shared/messages/MessageType';
import type { NotifyUniverseSpecificSettingsUpdateMessage } from '@ogame-tracker/shared/messages/universe-specific-settings';
import { loadUniverseSpecificSettings } from '@ogame-tracker/shared/models/universe-specific-settings/loadUniverseSpecificSettings';
import type { UniverseSpecificSettings } from '@ogame-tracker/shared/models/universe-specific-settings/UniverseSpecificSettings';
import { ogameMetasEqual } from '@ogame-tracker/shared/ogame-web/ogameMetasEqual';
import { GlobalOgameMetaData, statsViewUuid } from './global';

export const useUniverseSpecificSettingsStore = defineStore('universeSpecificSettings', () => {
    const { ready, resolveReady, rejectReady } = createReadiness();

    const settings = shallowRef<UniverseSpecificSettings>(null!);

    function updateSettings(nextSettings: UniverseSpecificSettings) {
        console.debug('updating universe specific settings', nextSettings);
        const snapshot = toDatabaseRecord(nextSettings);
        settings.value = nextSettings;

        void (async () => {
            const db = await getPlayerDatabase(GlobalOgameMetaData);
            await db.put('universeSpecificSettings', snapshot, 0);

            const msg: NotifyUniverseSpecificSettingsUpdateMessage = {
                ogameMeta: GlobalOgameMetaData,
                senderUuid: statsViewUuid,
                type: MessageType.NotifyUniverseSpecificSettingsUpdate,
            };
            await broadcastMessage(msg);
        })().catch(console.error);
    }

    async function initialize() {
        initCommunication();
        await loadData();
    }

    function initCommunication() {
        listenForMessages(onMessage);
    }

    async function loadData() {
        settings.value = await loadUniverseSpecificSettings(GlobalOgameMetaData);

        resolveReady();
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
            case MessageType.NotifyUniverseSpecificSettingsUpdate: {
                await loadData();
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

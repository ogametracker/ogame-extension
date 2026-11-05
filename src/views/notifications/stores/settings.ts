import { defineStore } from 'pinia';
import { onScopeDispose, shallowRef } from 'vue';
import { v4 } from 'uuid';
import { sendMessage } from '@ogame-tracker/shared/communication/sendMessage';
import { ogameMetasEqual } from '@ogame-tracker/shared/ogame-web/ogameMetasEqual';
import { MessageType } from '@ogame-tracker/shared/messages/MessageType';
import type { MessageOgameMeta } from '@ogame-tracker/shared/messages/Message';
import type { NotifySettingsUpdateMessage, RequestSettingsMessage, SettingsMessage } from '@ogame-tracker/shared/messages/settings';
import type { Settings } from '@ogame-tracker/shared/models/settings/Settings';

export const useSettingsStore = defineStore('notification-settings', () => {
    const settings = shallowRef<Settings>();
    const senderUuid = v4();
    let ready: Promise<void> | undefined;
    let disconnect: (() => void) | undefined;

    function connect(account: MessageOgameMeta): Promise<void> {
        return ready ??= new Promise(resolve => {
            const request: RequestSettingsMessage = {
                type: MessageType.RequestSettings,
                ogameMeta: account,
                senderUuid,
            };
            const onMessage = (message: NotifySettingsUpdateMessage | SettingsMessage) => {
                if (message.senderUuid === senderUuid || !ogameMetasEqual(message.ogameMeta, account)) {
                    return;
                }

                switch (message.type) {
                case MessageType.NotifySettingsUpdate:
                    sendMessage(request);
                    break;
                case MessageType.Settings:
                    settings.value = message.data;
                    resolve();
                    break;
                }
            };

            chrome.runtime.onMessage.addListener(onMessage);
            disconnect = () => chrome.runtime.onMessage.removeListener(onMessage);
            sendMessage(request);
        });
    }

    onScopeDispose(() => disconnect?.());
    return { settings, connect };
});

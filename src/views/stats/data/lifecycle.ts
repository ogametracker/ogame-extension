import { onScopeDispose } from 'vue';
import type { Message } from '@ogame-tracker/shared/messages/Message';

export function createReadiness() {
    let resolveReady!: () => void;
    let rejectReady!: (error: unknown) => void;
    const ready = new Promise<void>((resolve, reject) => {
        resolveReady = resolve;
        rejectReady = reject;
    });

    // Some stores finish loading before their route has a consumer for ready.
    void ready.catch(console.error);
    return { ready, resolveReady, rejectReady };
}

export function listenForMessages(handle: (message: Message) => void | Promise<void>) {
    const listener = (message: Message) => {
        void Promise.resolve().then(() => handle(message)).catch(console.error);
    };
    chrome.runtime.onMessage.addListener(listener);
    onScopeDispose(() => chrome.runtime.onMessage.removeListener(listener));
}

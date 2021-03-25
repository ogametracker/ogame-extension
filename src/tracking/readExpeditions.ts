import ExpoEvent from "@/models/expeditions/ExpoEvent";
import ExpoModule from "@/store/modules/ExpoModule";

const tabIdExpeditionMessages = '22';

class UnknownExpoEventError extends Error { }

export default async function readExpeditions() {
    const messagePage = document.querySelector('div[id^="ui-id-"][aria-hidden="false"] > #fleetsgenericpage');
    const parent = messagePage?.parentElement;
    if (messagePage == null || parent == null)
        return;

    const labelId = parent.getAttribute('aria-labelledby');
    if (labelId == null)
        return;

    const tabId = document.getElementById(labelId)?.getAttribute('data-tabid');
    if (tabId != tabIdExpeditionMessages)
        return;

    const knownExpos = ExpoModule.exposById;
    let unknownMessageCount = 0;
    let newMessageCount = 0;

    const messageContainers = messagePage.querySelectorAll('.msg[data-msg-id]');
    for (const messageContainer of messageContainers) {
        const expoId = parseInt(messageContainer.getAttribute('data-msg-id')!);
        if (knownExpos[expoId] != null)
            continue;

        try {
            const messageContent = messageContainer.querySelector('.msg_content')!.textContent!;

            const expoEvent = getExpoEvent(messageContent, messageContainer);
        } catch (e) {
            if (e instanceof UnknownExpoEventError) {
                messageContainer.classList.add('unknown-expo');
                unknownMessageCount++;
            }
            console.error(e);
        }
    }

    if(unknownMessageCount > 0) {
        //TODO: Notification
    }

    if(newMessageCount > 0) {
        //TODO: Notification
    }
}

function getExpoEvent(message: string, messageContainer: Element): ExpoEvent {

}
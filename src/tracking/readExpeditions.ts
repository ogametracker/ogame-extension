import i18n from "@/i18n"; 
import ExpoEvent from "@/models/expeditions/ExpoEvent";
import ExpoType from "@/models/expeditions/ExpoType";
import ExpoModule from "@/store/modules/ExpoModule";
import { parse } from "date-fns";

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

            const expoEvent = getExpoEvent(expoId, messageContent, messageContainer);
        } catch (e) {
            if (e instanceof UnknownExpoEventError) {
                messageContainer.classList.add('unknown-expo');
                unknownMessageCount++;
            }
            console.error(e);
        }
    }

    if (unknownMessageCount > 0) {
        //TODO: Notification
    }

    if (newMessageCount > 0) {
        //TODO: Notification
    }
}

function getExpoEvent(id: number, message: string, messageContainer: Element): ExpoEvent {
    const expoInfo = getDarkMatterExpo(message)
        ?? getResourceExpo(message)
        ?? getFleetExpo(message)
        ?? getItemExpo(message, messageContainer)
        ?? getEarlyExpo(message)
        ?? getDelayExpo(message)
        ?? getTraderExpo(message)
        ?? getLostFleetExpo(message)
        ?? getAliensExpo(message)
        ?? getPiratesExpo(message);
    if (expoInfo == null) {
        throw new UnknownExpoEventError();
    }

    expoInfo.id = id;

    const dateText = messageContainer.querySelector('.msg_head .msg_date.fright')!.textContent!
    const date = parse(dateText, 'dd.MM.yyyy hh:mm:ss', new Date());
    expoInfo.date = date.getTime();

    return expoInfo;
}

function getDarkMatterExpo(message: string): ExpoEvent | null {
    const regex = i18n.messages.ogame.expoMessages.darkMatter.regex as RegExp;
    const match = message.match(regex);
    return null;
}


function getResourceExpo(message: string): ExpoEvent | null {
    throw new Error("Function not implemented.");
}


function getFleetExpo(message: string): ExpoEvent | null {
    throw new Error("Function not implemented.");
}


function getItemExpo(message: string, messageContainer: Element): ExpoEvent | null {
    throw new Error("Function not implemented.");
}


function getEarlyExpo(message: string): ExpoEvent | null {
    throw new Error("Function not implemented.");
}


function getDelayExpo(message: string): ExpoEvent | null {
    throw new Error("Function not implemented.");
}


function getTraderExpo(message: string): ExpoEvent | null {
    throw new Error("Function not implemented.");
}


function getLostFleetExpo(message: string): ExpoEvent | null {
    throw new Error("Function not implemented.");
}


function getAliensExpo(message: string): ExpoEvent | null {
    throw new Error("Function not implemented.");
}


function getPiratesExpo(message: string): ExpoEvent | null {
    throw new Error("Function not implemented.");
}

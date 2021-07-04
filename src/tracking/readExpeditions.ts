import i18n from "@/i18n";
import ExpoEvent, { ExpoEventDarkMatter, ExpoEventResources, ExpoFindableShips, ExpoEventFleet, ExpoEventItem, ExpoEventEarly, ExpoEventDelay, ExpoEventTrader, ExpoEventLostFleet, ExpoEventAliens, ExpoEventPirates, ExpoEventNothing } from "@/models/expeditions/ExpoEvent";
import ExpoSize from "@/models/expeditions/ExpoSize";
import ExpoType from "@/models/expeditions/ExpoType";
import Resource from "@/models/Resource";
import Ship from "@/models/Ship";
import ExpoModule from "@/store/modules/ExpoModule";
import NotificationModule from "@/store/modules/NotificationModule";
import getNumericEnumValues from "@/utils/getNumericEnumValues";
import { parse } from "date-fns";


class UnknownExpoEventError extends Error { }

const tabIdExpeditionMessages = '22';
const expoIdsWithError: number[] = [];

export default async function readExpeditions() {
    const messagePage = document.querySelector('div[id^="ui-id-"][aria-hidden="false"] > #fleetsgenericpage');
    const parent = messagePage?.parentElement;
    if (messagePage == null || parent == null)
        return;

    const labelId = parent.getAttribute('aria-labelledby');
    if (labelId == null)
        return;

    const tabId = document.getElementById(labelId)?.parentElement?.getAttribute('data-tabid');
    if (tabId != tabIdExpeditionMessages)
        return;

    const knownExpos = ExpoModule.exposById;
    let errorMessageCount = 0;
    let newMessageCount = 0;

    const messageContainers = messagePage.querySelectorAll('.msg[data-msg-id]');
    for (const messageContainer of messageContainers) {
        const expoId = parseInt(messageContainer.getAttribute('data-msg-id')!);
        if (knownExpos[expoId] != null){
            addExpoResultText(knownExpos[expoId], messageContainer);
            messageContainer.classList.add('msg-extension-read');
            continue;
        } 
        if(expoIdsWithError.includes(expoId))
            continue;

        try {
            const message = messageContainer.querySelector('.msg_content')!.textContent!
                .trim()
                .replace(/\s+/g, ' ');

            const expoEvent = getExpoEvent(expoId, message, messageContainer);

            ExpoModule.add(expoEvent);
            newMessageCount++;

            addExpoResultText(expoEvent, messageContainer);
            messageContainer.classList.add('msg-extension-read');

            if (expoEvent.type == ExpoType.lostFleet) {
                //TODO: localization
                NotificationModule.addNotification({
                    type: 'warning',
                    title: 'Flottenverlust',
                    text: 'Eine Expedition ist nicht zurückgekehrt.',
                    timeout: 5000,
                });
            }
        } catch (e) {
            messageContainer.classList.add('msg-error');
            errorMessageCount++;
            
            expoIdsWithError.push(expoId);
            console.error(e, expoId);
        }
    }

    if (errorMessageCount > 0) {
        //TODO: localization
        NotificationModule.addNotification({
            type: 'error',
            title: 'Fehler',
            text: `Es wurden ${errorMessageCount} Expeditionen nicht eingelesen. Die fehlerhaften Expeditionsbericht wurden farblich markiert.`
        });
    }

    if (newMessageCount > 0) {
        //TODO: localization
        NotificationModule.addNotification({
            type: 'info',
            title: 'Neue Expeditionen',
            text: `Es wurden ${newMessageCount} neue Expeditionen eingelesen.`,
            timeout: 5000,
        });

        await ExpoModule.save();
    }
}

function addExpoResultText(expo: ExpoEvent, element: Element) {
    if(element.querySelector('.msg-expo-title') != null) {
        return;
    }

    const headElem = element.querySelector('.msg_head');
    const titleElem = element.querySelector('.msg_title');
    if(headElem == null || titleElem == null) {
        throw new Error("message head or title element not found");
    }

    const typeElem = document.createElement('span');
    typeElem.classList.add('msg-expo-title');

    typeElem.textContent = `${i18n.messages.ogame.expoTypes[expo.type]}`;
    if('size' in expo) {
        typeElem.textContent += ` (${i18n.messages.ogame.expoSizes[expo.size]})`;
    }
    headElem.insertBefore(typeElem, titleElem.nextSibling);
}

function getExpoEvent(id: number, message: string, messageContainer: Element): ExpoEvent {
    const dateText = messageContainer.querySelector('.msg_head .msg_date.fright')!.textContent!;
    const date = parse(dateText, i18n.dateTimeFormats.long, new Date()).getTime();

    const expoInfo = getDarkMatterExpo(id, date, message)
        ?? getResourceExpo(id, date, message)
        ?? getFleetExpo(id, date, message)
        ?? getItemExpo(id, date, message, messageContainer)
        ?? getEarlyExpo(id, date, message)
        ?? getDelayExpo(id, date, message)
        ?? getTraderExpo(id, date, message)
        ?? getLostFleetExpo(id, date, message)
        ?? getAliensExpo(id, date, message)
        ?? getPiratesExpo(id, date, message)
        ?? getNothingExpo(id, date, message);
    if (expoInfo == null) {
        throw new UnknownExpoEventError();
    }

    return expoInfo;
}

function getDarkMatterExpo(id: number, date: number, message: string): ExpoEvent | null {
    const regex = i18n.messages.ogame.expoMessages[ExpoType.darkMatter].regex as RegExp;
    const match = message.match(regex);
    if (match == null)
        return null;

    const amount = parseInt(match[1].replace(/[^\d]/g, ''));
    const size = Object.keys(ExpoSize)
        .find(size => i18n.messages.ogame.expoMessages[ExpoType.darkMatter][size]
            .some((msg: string) => message.includes(msg))) as ExpoSize | null;
    if (size == null)
        return null;

    const result: ExpoEventDarkMatter = {
        id,
        date,
        darkMatter: amount,
        size: size,
        type: ExpoType.darkMatter,
    };
    return result;
}


function getResourceExpo(id: number, date: number, message: string): ExpoEvent | null {
    const regex = i18n.messages.ogame.expoMessages[ExpoType.resources].regex as RegExp;
    const match = message.match(regex);
    if (match == null)
        return null;

    const resourceName = match[1];
    const amount = parseInt(match[2].replace(/[^\d]/g, ''));
    const size = Object.keys(ExpoSize)
        .find(size => i18n.messages.ogame.expoMessages[ExpoType.resources][size]
            .some((msg: string) => message.includes(msg))) as ExpoSize | null;
    if (size == null)
        return null;

    const resource = Object.keys(Resource)
        .find(resource => Object.keys(i18n.messages.ogame.resources)
            .find(r => i18n.messages.ogame.resources[r] == resourceName) == resource) as Resource | undefined;
    if (resource == null)
        return null;

    const result: ExpoEventResources = {
        type: ExpoType.resources,
        id,
        date,
        resources: {
            [Resource.metal]: 0,
            [Resource.crystal]: 0,
            [Resource.deuterium]: 0,
            [resource]: amount,
        },
        size: size,
    };
    return result;
}


function getFleetExpo(id: number, date: number, message: string): ExpoEvent | null {
    const regex = i18n.messages.ogame.expoMessages[ExpoType.fleet].regex as RegExp;
    const match = message.match(regex);
    if (match == null)
        return null;

    const size = Object.keys(ExpoSize)
        .find(size => i18n.messages.ogame.expoMessages[ExpoType.fleet][size]
            .some((msg: string) => message.includes(msg))) as ExpoSize | null;
    if (size == null)
        return null;

    const shipText = message.substr(match.index! + match[0].length);
    const ships: Record<ExpoFindableShips, number | undefined> = {};

    getNumericEnumValues<ExpoFindableShips>(ExpoFindableShips)
        .forEach(ship => {
            const shipName = i18n.messages.ogame.ships[ship];
            const shipRegex = new RegExp(shipName + ': (\\d+)');
            const shipMatch = shipText.match(shipRegex);

            if (shipMatch != null) {
                ships[ship] = parseInt(shipMatch[1]);
            }
        });

    const result: ExpoEventFleet = {
        type: ExpoType.fleet,
        id,
        date,
        size: size,
        fleet: ships,
    };
    return result;
}


function getItemExpo(id: number, date: number, message: string, messageContainer: Element): ExpoEvent | null {
    const regex = i18n.messages.ogame.expoMessages[ExpoType.item].regex as RegExp;
    const match = message.match(regex);
    if (match == null)
        return null;

    const itemLink = messageContainer.querySelector('.msg_content > a');
    if (!(itemLink instanceof HTMLAnchorElement))
        return null;

    const itemUrl = itemLink.href;
    const hashMatch = itemUrl.match(/item=([a-f0-9]+)/);
    if (hashMatch == null)
        return null;

    const result: ExpoEventItem = {
        type: ExpoType.item,
        id,
        date,
        itemHash: hashMatch[1],
    };
    return result;
}


function getEarlyExpo(id: number, date: number, message: string): ExpoEvent | null {
    const isEarly = i18n.messages.ogame.expoMessages[ExpoType.early].some((msg: string) => message.includes(msg));
    if (!isEarly)
        return null;

    const result: ExpoEventEarly = {
        type: ExpoType.early,
        id,
        date,
    };
    return result;
}


function getDelayExpo(id: number, date: number, message: string): ExpoEvent | null {
    const isDelay = i18n.messages.ogame.expoMessages[ExpoType.delay].some((msg: string) => message.includes(msg));
    if (!isDelay)
        return null;

    const result: ExpoEventDelay = {
        type: ExpoType.delay,
        id,
        date,
    };
    return result;
}


function getTraderExpo(id: number, date: number, message: string): ExpoEvent | null {
    const isTrader = i18n.messages.ogame.expoMessages[ExpoType.trader].some((msg: string) => message.includes(msg));
    if (!isTrader)
        return null;

    const result: ExpoEventTrader = {
        type: ExpoType.trader,
        id,
        date,
    };
    return result;
}


function getLostFleetExpo(id: number, date: number, message: string): ExpoEvent | null {
    const isLost = i18n.messages.ogame.expoMessages[ExpoType.lostFleet].some((msg: string) => message.includes(msg));
    if (!isLost)
        return null;

    const result: ExpoEventLostFleet = {
        type: ExpoType.lostFleet,
        id,
        date,
    };
    return result;
}


function getAliensExpo(id: number, date: number, message: string): ExpoEvent | null {
    const size = Object.keys(ExpoSize)
        .find(size => i18n.messages.ogame.expoMessages[ExpoType.aliens][size]
            .some((msg: string) => message.includes(msg))) as ExpoSize | null;
    if (size == null)
        return null;

    const result: ExpoEventAliens = {
        type: ExpoType.aliens,
        id,
        date,
        size,
    };
    return result;
}


function getPiratesExpo(id: number, date: number, message: string): ExpoEvent | null {
    const size = Object.keys(ExpoSize)
        .find(size => i18n.messages.ogame.expoMessages[ExpoType.pirates][size]
            .some((msg: string) => message.includes(msg))) as ExpoSize | null;
    if (size == null)
        return null;

    const result: ExpoEventPirates = {
        type: ExpoType.pirates,
        id,
        date,
        size,
    };
    return result;
}

function getNothingExpo(id: number, date: number, message: string): ExpoEvent | null {
    const isLost = i18n.messages.ogame.expoMessages[ExpoType.nothing].some((msg: string) => message.includes(msg));
    if (!isLost)
        return null;

    const result: ExpoEventNothing = {
        type: ExpoType.nothing,
        id,
        date,
    };
    return result;
}


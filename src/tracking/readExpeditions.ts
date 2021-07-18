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
        if (knownExpos[expoId] != null) {
            addExpoResultText(knownExpos[expoId], messageContainer);
            highlightExpoResult(knownExpos[expoId], messageContainer);
            messageContainer.classList.add('msg-extension-read');
            continue;
        }
        if (expoIdsWithError.includes(expoId))
            continue;

        try {
            const message = messageContainer.querySelector('.msg_content')!.textContent!
                .trim()
                .replace(/\s+/g, ' ');

            const expoEvent = getExpoEvent(expoId, message, messageContainer);

            ExpoModule.add(expoEvent);
            newMessageCount++;

            addExpoResultText(expoEvent, messageContainer);
            highlightExpoResult(expoEvent, messageContainer);
            messageContainer.classList.add('msg-extension-read');

            if (expoEvent.type == ExpoType.lostFleet) {
                NotificationModule.addNotification({
                    type: 'warning',
                    title: i18n.messages.extension.notifications.expeditions.fleetLost.title,
                    text: i18n.messages.extension.notifications.expeditions.fleetLost.text,
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
        NotificationModule.addNotification({
            type: 'error',
            title: i18n.messages.extension.notifications.expeditions.error.title,
            text: i18n.messages.extension.notifications.expeditions.error.text(errorMessageCount),
        });
    }

    if (newMessageCount > 0) {
        NotificationModule.addNotification({
            type: 'info',
            title: i18n.messages.extension.notifications.expeditions.success.title,
            text: i18n.messages.extension.notifications.expeditions.success.text(errorMessageCount),
            timeout: 5000,
        });

        await ExpoModule.save();
    }
}

function highlightExpoResult(expo: ExpoEvent, element: Element) {
    const msgContent = element.querySelector('.msg_content');
    if (msgContent == null) {
        throw new Error('message content not found');
    }

    if (element.classList.contains('msg-expo-highlighted')) {
        return;
    }

    switch (expo.type) {
        case ExpoType.resources: {
            const regex = i18n.messages.ogame.expoMessages.resources.regex;
            const match = msgContent.innerHTML.match(regex);
            if (match?.groups == null) {
                throw new Error();
            }

            msgContent.innerHTML = msgContent.innerHTML
                .replace(match[0], match[0]
                    .replace(match.groups.name, `<span class="msg-expo-highlight">${match.groups.name}</span>`)
                    .replace(match.groups.amount, `<span class="msg-expo-highlight">${match.groups.amount}</span>`)
                );
            break;
        }

        case ExpoType.fleet: {
            const regex = i18n.messages.ogame.expoMessages.fleet.regex;
            const match = msgContent.innerHTML.match(regex);
            if (match?.groups == null) {
                throw new Error();
            }

            msgContent.innerHTML = msgContent.innerHTML
                .replace(match.groups.ships, `<span class="msg-expo-highlight">${match.groups.ships}</span>`);
            break;
        }

        case ExpoType.darkMatter: {
            const regex = i18n.messages.ogame.expoMessages.darkMatter.regex;
            const match = msgContent.innerHTML.match(regex);
            if (match?.groups == null) {
                throw new Error();
            }

            msgContent.innerHTML = msgContent.innerHTML.replace(match[0], match[0]
                .replace(match.groups.name, `<span class="msg-expo-highlight">${match.groups.name}</span>`)
                .replace(match.groups.amount, `<span class="msg-expo-highlight">${match.groups.amount}</span>`)
            );
            break;
        }
    }

    element.classList.add('msg-expo-highlighted');
    element.classList.add(`msg-expo-type-${expo.type}`);
}

function addExpoResultText(expo: ExpoEvent, element: Element) {
    if (element.querySelector('.msg-expo-title') != null) {
        return;
    }

    element.classList.add('msg-expo');
    const headElem = element.querySelector('.msg_head');
    const titleElem = element.querySelector('.msg_title');
    if (headElem == null || titleElem == null) {
        throw new Error("message head or title element not found");
    }

    const typeElem = document.createElement('span');
    typeElem.classList.add('msg-expo-title');

    typeElem.textContent = `${i18n.messages.ogame.expoTypes[expo.type]}`;
    if ('size' in expo) {
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
    const regex = i18n.messages.ogame.expoMessages[ExpoType.darkMatter].regex;
    const match = message.match(regex);
    if (match?.groups == null) {
        return null;
    }

    const amount = parseInt(match.groups.amount.replace(/[^\d]/g, ''));
    const size = Object.values(ExpoSize)
        .find(size => i18n.messages.ogame.expoMessages[ExpoType.darkMatter][size]
            .some((msg: string) => message.includes(msg))
        );

    if (size == null) {
        return null;
    }

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
    const regex = i18n.messages.ogame.expoMessages[ExpoType.resources].regex;
    const match = message.match(regex);
    if (match == null) {
        return null;
    }

    const resourceName = match[1];
    const amount = parseInt(match[2].replace(/[^\d]/g, ''));
    const size = Object.values(ExpoSize)
        .find(size => i18n.messages.ogame.expoMessages[ExpoType.resources][size]
            .some((msg: string) => message.includes(msg))
        );

    if (size == null) {
        return null;
    }

    const resource = Object.values(Resource)
        .find(resource => i18n.messages.ogame.resources[resource] == resourceName);

    if (resource == null) {
        return null;
    }

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
    const regex = i18n.messages.ogame.expoMessages[ExpoType.fleet].regex;
    const match = message.match(regex);
    if (match == null) {
        return null;
    }
    
    const size = Object.values(ExpoSize)
        .find(size => i18n.messages.ogame.expoMessages[ExpoType.fleet][size]
            .some((msg: string) => message.includes(msg))
        );
    if (size == null) {
        return null;
    }

    const shipText = match.groups!.ships;
    const ships: Record<ExpoFindableShips, number | undefined> = {};

    getNumericEnumValues<Ship>(ExpoFindableShips)
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
    const regex = i18n.messages.ogame.expoMessages[ExpoType.item].regex;
    const match = message.match(regex);
    if (match?.groups == null)
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
    const size = Object.values(ExpoSize)
        .find(size => i18n.messages.ogame.expoMessages[ExpoType.aliens][size]
            .some((msg: string) => message.includes(msg))
        );
    if (size == null) {
        return null;
    }

    const result: ExpoEventAliens = {
        type: ExpoType.aliens,
        id,
        date,
        size,
    };
    return result;
}


function getPiratesExpo(id: number, date: number, message: string): ExpoEvent | null {
    const size = Object.values(ExpoSize)
        .find(size => i18n.messages.ogame.expoMessages[ExpoType.pirates][size]
            .some((msg: string) => message.includes(msg))
        );

    if (size == null) {
        return null;
    }

    const result: ExpoEventPirates = {
        type: ExpoType.pirates,
        id,
        date,
        size,
    };
    return result;
}

function getNothingExpo(id: number, date: number, message: string): ExpoEvent | null {
    const isNothing = i18n.messages.ogame.expoMessages[ExpoType.nothing].some((msg: string) => message.includes(msg));

    if (!isNothing) {
        return null;
    }

    const result: ExpoEventNothing = {
        type: ExpoType.nothing,
        id,
        date,
    };
    return result;
}


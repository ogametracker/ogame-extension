import { _throw } from "../../shared/utils/_throw";

export const tabIds = {
    combats: 21,
    expedition: 22,
    misc: 24,
};

const cssBase = 'ogame-tracker';

export const cssClasses = {
    messages: {
        base: `${cssBase}-msg`,
        processed: `${cssBase}-msg--processed`,
        waitingToBeProcessed: `${cssBase}-msg--waiting-to-be-processed`,
        error: `${cssBase}-msg--error`,
        ignored: `${cssBase}-msg--ignored`,
        hideContent: `${cssBase}-msg--hide-content`,
    
        expedition: `${cssBase}-msg--expedition`,
        lifeformDiscovery: `${cssBase}-msg--lifeform-discovery`,
        debrisFieldReport: `${cssBase}-msg--debris-field-report`,
        combatReport:  `${cssBase}-msg--combat-report`,

        customMessageContent: `${cssBase}-msg__content`,
    },
    loader: `${cssBase}-loader`,
};

export function addOrSetCustomMessageContent(msgElem: Element, htmlContent: string | false) {
    let newContent = msgElem.querySelector(`.${cssClasses.messages.customMessageContent}`);
    if (newContent == null) {
        newContent = document.createElement('div');
        newContent.classList.add(cssClasses.messages.customMessageContent);

        const msgContent = msgElem.querySelector('.msgContent') ?? _throw('no message content found');
        msgElem.insertBefore(newContent, msgContent.nextElementSibling);
    }

    if(htmlContent == false) {
        newContent.remove();
    } else {
        newContent.innerHTML = htmlContent;
    }
}

export function formatNumber(number: number) {
    return new Intl.NumberFormat().format(number);
}
import { sendMessage } from "@/shared/communication/sendMessage";
import { ExpeditionDepletionLevel } from "@/shared/models/expeditions/ExpeditionDepletionLevel";
import { LifeformDiscoveryEventType } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEventType";
import { ValidLifeformType } from "@/shared/models/ogame/lifeforms/LifeformType";
import { internalUuid } from "@/shared/uuid";
import { Message } from "../../shared/messages/Message";
import { MessageType } from "../../shared/messages/MessageType";
import { RequestSettingsMessage, SettingsMessage } from "../../shared/messages/settings";
import { CombatResultType } from "../../shared/models/combat-reports/CombatResultType";
import { ExpeditionEventSize } from "../../shared/models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../../shared/models/expeditions/ExpeditionEventType";
import { ResourceType } from "../../shared/models/ogame/resources/ResourceType";
import { ShipType } from "../../shared/models/ogame/ships/ShipType";
import { ColorSettings } from "../../shared/models/settings/Settings";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";
import { ogameMetasEqual } from "../../shared/ogame-web/ogameMetasEqual";

const ogameMeta = getOgameMeta();
let stylesheet: HTMLStyleElement | null = null;

chrome.runtime.onMessage.addListener(message => onMessage(message));
requestSettings();

function onMessage(message: Message<MessageType, any>) {
    if (!ogameMetasEqual(ogameMeta, message.ogameMeta)) {
        return;
    }

    switch (message.type) {
        case MessageType.Settings: {
            const { data: settings } = message as SettingsMessage;
            generateCssVariables(settings.colors);
            break;
        }
    }
}

function requestSettings() {
    const requestMessage: RequestSettingsMessage = {
        type: MessageType.RequestSettings,
        ogameMeta,
        senderUuid: internalUuid,
    };
    sendMessage(requestMessage);
}

function generateCssVariables(colors: ColorSettings) {
    const cssVariables: Record<string, string> = {};

    (Object.keys(colors.resources) as ResourceType[])
        .forEach(resource => cssVariables[`--ogame-tracker--resource--${resource}`] = colors.resources[resource]);

    (Object.keys(colors.ships) as any as ShipType[])
        .forEach(ship => cssVariables[`--ogame-tracker--ship--${ship}`] = colors.ships[ship]);

    (Object.keys(colors.combatResults) as CombatResultType[])
        .forEach(combatResult => cssVariables[`--ogame-tracker--combat-result--${combatResult}`] = colors.combatResults[combatResult]);

    (Object.keys(colors.expeditions.events) as ExpeditionEventType[])
        .forEach(expoEvent => cssVariables[`--ogame-tracker--expedition-event--${expoEvent}`] = colors.expeditions.events[expoEvent]);

    (Object.keys(colors.expeditions.sizes) as ExpeditionEventSize[]).
        forEach(expoSize => cssVariables[`--ogame-tracker--expedition-size--${expoSize}`] = colors.expeditions.sizes[expoSize]);

    cssVariables[`--ogame-tracker--dark-matter`] = colors.expeditions.events.darkMatter;

    (Object.keys(colors.expeditions.depletion) as ExpeditionDepletionLevel[])
        .forEach(depletionLevel => cssVariables[`--ogame-tracker--depletion-level--${depletionLevel}`] = colors.expeditions.depletion[depletionLevel]);

    (Object.keys(colors.lifeformDiscoveries) as LifeformDiscoveryEventType[])
        .forEach(event => cssVariables[`--ogame-tracker--lifeform-discovery-event--${event}`] = colors.lifeformDiscoveries[event]);

    (Object.keys(colors.lifeforms) as ValidLifeformType[])
        .forEach(lifeform => cssVariables[`--ogame-tracker--lifeform--${lifeform}`] = colors.lifeforms[lifeform]);


    const css = Object.keys(cssVariables)
        .map(cssVariable => `${cssVariable}: ${cssVariables[cssVariable]}`)
        .join(';');

    if (stylesheet == null) {
        stylesheet = document.createElement('style');
        document.head.append(stylesheet);
    }
    stylesheet.textContent = `:root { ${css} }`;
}

import { sendMessage } from '@ogame-tracker/shared/communication/sendMessage';
import { ExpeditionDepletionLevel } from '@ogame-tracker/shared/models/expeditions/ExpeditionDepletionLevel';
import { LifeformDiscoveryEventArtifactFindingSize } from '@ogame-tracker/shared/models/lifeform-discoveries/LifeformDiscoveryEventArtifactFindingSize';
import { LifeformDiscoveryEventType } from '@ogame-tracker/shared/models/lifeform-discoveries/LifeformDiscoveryEventType';
import { ValidLifeformType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import { internalUuid } from '@ogame-tracker/shared/uuid';
import { Message } from '@ogame-tracker/shared/messages/Message';
import { MessageType } from '@ogame-tracker/shared/messages/MessageType';
import { RequestSettingsMessage, SettingsMessage } from '@ogame-tracker/shared/messages/settings';
import { CombatResultType } from '@ogame-tracker/shared/models/combat-reports/CombatResultType';
import { ExpeditionEventSize } from '@ogame-tracker/shared/models/expeditions/ExpeditionEventSize';
import { ExpeditionEventType } from '@ogame-tracker/shared/models/expeditions/ExpeditionEventType';
import { ResourceType } from '@ogame-tracker/shared/models/ogame/resources/ResourceType';
import { ShipType } from '@ogame-tracker/shared/models/ogame/ships/ShipType';
import { ColorSettings } from '@ogame-tracker/shared/models/settings/Settings';
import { getOgameMeta } from '@ogame-tracker/shared/ogame-web/getOgameMeta';
import { ogameMetasEqual } from '@ogame-tracker/shared/ogame-web/ogameMetasEqual';

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

    (Object.keys(colors.resources) as ResourceType[]).forEach(
        resource => (cssVariables[`--ogame-tracker--resource--${resource}`] = colors.resources[resource]),
    );

    (Object.keys(colors.ships) as any as ShipType[]).forEach(
        ship => (cssVariables[`--ogame-tracker--ship--${ship}`] = colors.ships[ship]),
    );

    (Object.keys(colors.combatResults) as CombatResultType[]).forEach(
        combatResult =>
            (cssVariables[`--ogame-tracker--combat-result--${combatResult}`] = colors.combatResults[combatResult]),
    );

    (Object.keys(colors.expeditions.events) as ExpeditionEventType[]).forEach(
        expoEvent =>
            (cssVariables[`--ogame-tracker--expedition-event--${expoEvent}`] = colors.expeditions.events[expoEvent]),
    );

    (Object.keys(colors.expeditions.sizes) as ExpeditionEventSize[]).forEach(
        expoSize =>
            (cssVariables[`--ogame-tracker--expedition-size--${expoSize}`] = colors.expeditions.sizes[expoSize]),
    );

    cssVariables[`--ogame-tracker--dark-matter`] = colors.expeditions.events.darkMatter;

    (Object.keys(colors.expeditions.depletion) as ExpeditionDepletionLevel[]).forEach(
        depletionLevel =>
            (cssVariables[`--ogame-tracker--depletion-level--${depletionLevel}`] =
                colors.expeditions.depletion[depletionLevel]),
    );

    (Object.keys(colors.lifeformDiscoveries.events) as LifeformDiscoveryEventType[]).forEach(
        event =>
            (cssVariables[`--ogame-tracker--lifeform-discovery-event--${event}`] =
                colors.lifeformDiscoveries.events[event]),
    );

    (
        Object.keys(colors.lifeformDiscoveries.artifactFindingSizes) as LifeformDiscoveryEventArtifactFindingSize[]
    ).forEach(
        size =>
            (cssVariables[`--ogame-tracker--lifeform-discovery-result--artifacts--size--${size}`] =
                colors.lifeformDiscoveries.artifactFindingSizes[size]),
    );

    (Object.keys(colors.lifeforms) as ValidLifeformType[]).forEach(
        lifeform => (cssVariables[`--ogame-tracker--lifeform--${lifeform}`] = colors.lifeforms[lifeform]),
    );

    const css = Object.keys(cssVariables)
        .map(cssVariable => `${cssVariable}: ${cssVariables[cssVariable]}`)
        .join(';');

    if (stylesheet == null) {
        stylesheet = document.createElement('style');
        document.head.append(stylesheet);
    }
    stylesheet.textContent = `:root { ${css} }`;
}

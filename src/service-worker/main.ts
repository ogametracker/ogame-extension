import { Message } from '@ogame-tracker/shared/messages/Message';
import { MessageType } from '@ogame-tracker/shared/messages/MessageType';
import { _log, _logDebug, _logError, _logWarning } from '@ogame-tracker/shared/utils/_log';
import { _throw } from '@ogame-tracker/shared/utils/_throw';
import { CombatReportService } from './combat-reports/CombatReportService';
import { DebrisFieldReportService } from './debris-fields-reports/DebrisFieldReportService';
import { EmpireService } from './empire/EmpireService';
import { ExpeditionService } from './expeditions/ExpeditionService';
import { LifeformDiscoveryService } from './lifeform-discoveries/LifeformDiscoveryService';
import { InternalService } from './InternalService';
import { MessageService } from './MessageService';
import { ServerSettingsService } from './server-settings/ServerSettingsService';
import { SettingsService } from './settings/SettingsService';
import { UniverseHistoryService } from './universe-history/UniverseHistoryService';
import { UniversesAndAccountsService } from './universes-and-accounts/UniversesAndAccountsService';
import { broadcastMessage } from '@ogame-tracker/shared/communication/broadcastMessage';
import { serviceWorkerUuid } from '@ogame-tracker/shared/uuid';

export const settingsService = new SettingsService();

const services: MessageService[] = [
    settingsService,
    new ExpeditionService(),
    new LifeformDiscoveryService(),
    new CombatReportService(),
    new DebrisFieldReportService(),
    new EmpireService(),
    new UniverseHistoryService(),
    new ServerSettingsService(),
    new UniversesAndAccountsService(),

    new InternalService(),

    // re-broadcast service (fix for missing notifications and other messages in FF)
    {
        onMessage: async message => {
            if (message.senderUuid != serviceWorkerUuid) {
                broadcastMessage(message);
            }
        },
    },
];

try {
    chrome.runtime.onMessage.addListener(async message => await onMessage(message));
} catch (error) {
    _logError(error);
}

async function onMessage(message: Message<MessageType, any>) {
    _logDebug('got message', new Date(), message);

    if (message.ogameMeta.playerId <= 0 || message.ogameMeta.serverId <= 0) {
        _logWarning('skipping message because playerid <= 0 or serverid <= 0', message);
        return;
    }

    for (const service of services) {
        await service.onMessage(message);
    }
}

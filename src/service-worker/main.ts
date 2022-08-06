import { Message } from "../shared/messages/Message";
import { MessageType } from "../shared/messages/MessageType";
import { _log, _logDebug, _logError, _logWarning } from "../shared/utils/_log";
import { _throw } from "../shared/utils/_throw";
import { CombatReportService } from "./combat-reports/CombatReportService";
import { DebrisFieldReportService } from "./debris-fields-reports/DebrisFieldReportService";
import { EmpireService } from "./empire/EmpireService";
import { ExpeditionService } from "./expeditions/ExpeditionService";
import { LifeformDiscoveryService } from "./lifeform-discoveries/LifeformDiscoveryService";
import { InternalService } from "./InternalService";
import { MessageService } from "./MessageService";
import { ServerSettingsService } from "./server-settings/ServerSettingsService";
import { SettingsService } from "./settings/SettingsService";
import { UniverseHistoryService } from "./universe-history/UniverseHistoryService";
import { UniversesAndAccountsService } from "./universes-and-accounts/UniversesAndAccountsService";

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
];

try {
    chrome.runtime.onInstalled.addListener(async () => await showMigrationWindow());

    chrome.runtime.onMessage.addListener(async message => await onMessage(message));
} catch (error) {
    _logError(error);
}

async function showMigrationWindow() {
    const hasData = (await chrome.storage.local.getBytesInUse()) > 0;
    const migrated = await chrome.storage.local.get('migration-v1-to-v2');
    if (!hasData || migrated['migration-v1-to-v2'] == true) {
        return;
    }

    await chrome.tabs.create({
        active: true,
        index: 0,
        url: '/views/migrate.html',
    });
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
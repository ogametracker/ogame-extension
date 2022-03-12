import { Message } from "../shared/messages/Message";
import { MessageType } from "../shared/messages/MessageType";
import { getStorageKeyPrefix } from "../shared/utils/getStorageKeyPrefix";
import { _log, _logDebug, _logError, _logWarning } from "../shared/utils/_log";
import { _throw } from "../shared/utils/_throw";
import { CombatReportService } from "./combat-reports/CombatReportService";
import { DebrisFieldReportService } from "./debris-fields-reports/DebrisFieldReportService";
import { EmpireService } from "./empire/EmpireService";
import { ExpeditionService } from "./expeditions/ExpeditionService";
import { MessageService } from "./MessageService";
import { SettingsService } from "./settings/SettingsService";

const services: MessageService[] = [
    new ExpeditionService(),
    new CombatReportService(),
    new DebrisFieldReportService(),
    new EmpireService(),
    new SettingsService(),
];

try {
    chrome.runtime.onInstalled.addListener(() => performMigrations());

    chrome.runtime.onMessage.addListener(async message => await onMessage(message));
} catch (error) {
    _logError(error);
}

function performMigrations() {
    _logWarning('TODO: perform migrations');
    //TODO: perform migrations
}

async function onMessage(message: Message<MessageType, any>) {
    _logDebug('got message', performance.now(), message);

    const key = getStorageKeyPrefix(message.ogameMeta);

    for (const service of services) {
        await service.onMessage(message);
    }
}
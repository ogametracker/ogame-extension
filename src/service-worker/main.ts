import { Lock } from "semaphore-async-await";
import { Message } from "../shared/messages/Message";
import { MessageType } from "../shared/messages/MessageType";
import { executeMigrations } from "../shared/migrations/executeMigrations";
import { _log, _logDebug, _logError, _logWarning } from "../shared/utils/_log";
import { _throw } from "../shared/utils/_throw";
import { CombatReportService } from "./combat-reports/CombatReportService";
import { DebrisFieldReportService } from "./debris-fields-reports/DebrisFieldReportService";
import { EmpireService } from "./empire/EmpireService";
import { ExpeditionService } from "./expeditions/ExpeditionService";
import { MessageService } from "./MessageService";
import { SettingsService } from "./settings/SettingsService";
import { UniverseHistoryService } from "./universe-players/UniverseHistoryService";

const services: MessageService[] = [
    new ExpeditionService(),
    new CombatReportService(),
    new DebrisFieldReportService(),
    new EmpireService(),
    new SettingsService(),
    new UniverseHistoryService(),
];

const migrationLock = new Lock();
try {
    chrome.runtime.onInstalled.addListener(() => performMigrations());

    chrome.runtime.onMessage.addListener(async message => await onMessage(message));
} catch (error) {
    _logError(error);
}

async function performMigrations() {
    await migrationLock.acquire();
    try {
        _logDebug('performing migrations');
        await executeMigrations();
    } catch (error) {
        //TODO: send notification with error
        console.error(error);
    }
    migrationLock.release();
}

async function onMessage(message: Message<MessageType, any>) {
    await migrationLock.wait();
    migrationLock.release();

    _logDebug('got message', performance.now(), message);

    for (const service of services) {
        await service.onMessage(message);
    }
}
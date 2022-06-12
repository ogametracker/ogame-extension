import Semaphore, { Lock } from "semaphore-async-await";
import { v4 } from "uuid";
import { Message } from "../shared/messages/Message";
import { MessageType } from "../shared/messages/MessageType";
import { executeMigrations } from "../shared/migrations/executeMigrations";
import { _log, _logDebug, _logError, _logWarning } from "../shared/utils/_log";
import { _throw } from "../shared/utils/_throw";
import { CombatReportService } from "./combat-reports/CombatReportService";
import { DebrisFieldReportService } from "./debris-fields-reports/DebrisFieldReportService";
import { EmpireService } from "./empire/EmpireService";
import { ExpeditionService } from "./expeditions/ExpeditionService";
import { KeepAliveService } from "./KeepAliveService";
import { MessageService } from "./MessageService";
import { ServerSettingsService } from "./server-settings/ServerSettingsService";
import { SettingsService } from "./settings/SettingsService";
import { UniverseHistoryService } from "./universe-history/UniverseHistoryService";
import { UniversesAndAccountsService } from "./universes-and-accounts/UniversesAndAccountsService";

const services: MessageService[] = [
    new KeepAliveService(),
    new ExpeditionService(),
    new CombatReportService(),
    new DebrisFieldReportService(),
    new EmpireService(),
    new SettingsService(),
    new UniverseHistoryService(),
    new ServerSettingsService(),
    new UniversesAndAccountsService(),
];

const permits = 1000; // number of parallel processable messages
const migrationLock = new Semaphore(permits);
try {
    chrome.runtime.onInstalled.addListener(() => performMigrations());

    chrome.runtime.onMessage.addListener(async message => await onMessage(message));
} catch (error) {
    _logError(error);
}

async function performMigrations() {
    //TODO: migrate manually => open window for migrations
    // const permits = migrationLock.drainPermits();
    // try {
    //     _logDebug('performing migrations');
    //     await executeMigrations();
    // } catch (error) {
    //     //TODO: send notification with error
    //     console.error(error);
    // }

    // console.log('migrations done');

    // for(let i = 0; i < permits; i++) {
    //     migrationLock.release();
    // }
}

async function onMessage(message: Message<MessageType, any>) {
    await migrationLock.acquire();
    migrationLock.release();

    _logDebug('got message', new Date(), message);

    for (const service of services) {
        await service.onMessage(message);
    }
}
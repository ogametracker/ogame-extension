import { getGlobalDatabase, getPlayerDatabase } from "@/shared/db/access";
import { _logDebug } from "@/shared/utils/_log";
import { V1ToV2Export, V1ToV2ExportedAccount } from ".";

export async function importData(data: V1ToV2Export): Promise<void> {
    _logDebug(`data import: ${data.type}`);

    for (const account of data.accounts) {
        await importAccount(account);
    }
}
async function importAccount(account: V1ToV2ExportedAccount) {
    const globalDb = await getGlobalDatabase();
    await globalDb.put('accounts', {
        serverId: account.serverId,
        serverLanguage: account.language,
        id: account.playerId,
        name: account.playerName,
    });
    await globalDb.put('servers', {
        id: account.serverId,
        language: account.language,
        name: account.universeName,
    });


    const db = await getPlayerDatabase(account);
    const tx = db.transaction(['expeditions', 'combatReports', 'debrisFieldReports'], 'readwrite');

    const expeditionStore = tx.objectStore('expeditions');
    for (const expedition of Object.values(account.data.expeditions)) {
        await expeditionStore.put(expedition);
    }

    const combatReportStore = tx.objectStore('combatReports');
    for (const combatReport of Object.values(account.data.combatReports)) {
        await combatReportStore.put(combatReport);
    }

    const debrisFieldReportStore = tx.objectStore('debrisFieldReports');
    for (const debrisFieldReport of Object.values(account.data.debrisFieldReports)) {
        await debrisFieldReportStore.put(debrisFieldReport);
    }

    await tx.done;
}
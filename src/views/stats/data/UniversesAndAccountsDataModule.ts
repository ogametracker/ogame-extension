import { toDatabaseRecord } from './toDatabaseRecord';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { createReadiness } from './lifecycle';
import { getGlobalDatabase, getPlayerDatabase, getPlayerDatabaseName, getServerDatabase, getServerDatabaseName, getUniverseHistoryDatabaseName } from '@ogame-tracker/shared/db/access';
import type { DbAccount, DbLinkedAccount, DbServer } from '@ogame-tracker/shared/db/schema/global';
import { GlobalOgameMetaData, statsViewUuid } from './global';
import { useCombatReportStore } from './CombatReportDataModule';
import { deleteDB } from 'idb';
import type { StoreNames } from 'idb';
import { sendMessage } from '@ogame-tracker/shared/communication/sendMessage';
import type { DropDatabaseConnectionsMessage } from '@ogame-tracker/shared/messages/internal';
import { MessageType } from '@ogame-tracker/shared/messages/MessageType';
import type { OgameTrackerPlayerDbSchema, OgameTrackerServerDbSchema } from '@ogame-tracker/shared/db/schema';
import { useUniverseHistoryStore } from './UniverseHistoryDataModule';
import { useExpeditionStore } from './ExpeditionDataModule';
import { useDebrisFieldReportStore } from './DebrisFieldReportDataModule';
import { useEmpireStore } from './EmpireDataModule';
import { useServerSettingsStore } from './ServerSettingsDataModule';
import type { MessageOgameMeta } from '@ogame-tracker/shared/messages/Message';

export const useUniversesAndAccountsStore = defineStore('universesAndAccounts', () => {
    const { ready, resolveReady, rejectReady } = createReadiness();

    const accounts = ref<DbAccount[]>([]);

    const servers = ref<DbServer[]>([]);

    async function initialize() {
        await loadData();
    }

    const currentAccount = computed<DbAccount>(() => {
        const accEqual = (a: {
            serverId: number;
            serverLanguage: string;
            id: number;
        }, b: MessageOgameMeta) =>
            a.serverId == b.serverId
            && a.serverLanguage == b.language
            && a.id == b.playerId;

        const account = accounts.value.find(a => accEqual(a, GlobalOgameMetaData));

        if (account == null) {
            return {
                serverId: GlobalOgameMetaData.serverId,
                serverLanguage: GlobalOgameMetaData.language,
                id: GlobalOgameMetaData.playerId,
                name: GlobalOgameMetaData.playerId.toString(),
            };
        }

        return account;
    });

    const currentServer = computed<DbServer>(() => {
        const server = servers.value.find(
            s => s.id == GlobalOgameMetaData.serverId
                && s.language == GlobalOgameMetaData.language
        );

        return server ?? {
            id: GlobalOgameMetaData.serverId,
            language: GlobalOgameMetaData.language,
            name: GlobalOgameMetaData.serverId.toString(),
        };
    });

    async function loadData() {
        const db = await getGlobalDatabase();
        const tx = db.transaction(['accounts', 'servers'], 'readonly');

        accounts.value = (await tx.objectStore('accounts').getAll()).map(account => ({
            ...account,
            linkedAccounts: (account.linkedAccounts ?? []).filter(linked => (
                linked.id !== account.id || linked.serverId !== account.serverId || linked.serverLanguage !== account.serverLanguage
            )),
        }));
        servers.value = await tx.objectStore('servers').getAll();

        await tx.done;

        resolveReady();
    }

    async function deleteCurrentAccount() {
        await useCombatReportStore().clear();
        await useExpeditionStore().clear();
        await useDebrisFieldReportStore().clear();

        await useEmpireStore().clear();

        const globalDb = await getGlobalDatabase();
        await globalDb.delete('accounts', [GlobalOgameMetaData.serverId, GlobalOgameMetaData.language, GlobalOgameMetaData.playerId]);

        const otherAccountsCount = await globalDb.countFromIndex('accounts', 'server', [GlobalOgameMetaData.serverId, GlobalOgameMetaData.language]);
        if (otherAccountsCount > 0) {
            return;
        }

        await useServerSettingsStore().clear();
        await useUniverseHistoryStore().deleteCurrentServer();

        await globalDb.delete('servers', [GlobalOgameMetaData.serverId, GlobalOgameMetaData.language]);
    }

    async function linkAccount(account: DbLinkedAccount) {
        const accountRecord = currentAccount.value;
        console.debug('linking account ', account, 'with', accountRecord);
        if (accountRecord.linkedAccounts == null) {
            accountRecord.linkedAccounts = [];
        }

        const accountIsLinked = accountRecord.linkedAccounts!.some(a => a.id == account.id && a.serverId == account.serverId && a.serverLanguage == account.serverLanguage);
        if (accountIsLinked) {
            return;
        }
        accountRecord.linkedAccounts!.push(account);

        const db = await getGlobalDatabase();
        const tx = db.transaction(['accounts'], 'readwrite');

        await tx.objectStore('accounts').put(toDatabaseRecord(accountRecord));

        await tx.done;

        console.debug('successfully linked account ', account, 'with', accountRecord);
    }

    async function unlinkAccount(account: DbLinkedAccount) {
        const accountRecord = currentAccount.value;
        if (accountRecord.linkedAccounts == null) {
            accountRecord.linkedAccounts = [];
        }
        const index = accountRecord.linkedAccounts!.findIndex(a => a.id == account.id && a.serverId == account.serverId && a.serverLanguage == account.serverLanguage);
        if (index >= 0) {
            accountRecord.linkedAccounts!.splice(index, 1);
        }

        const db = await getGlobalDatabase();
        const tx = db.transaction(['accounts'], 'readwrite');

        await tx.objectStore('accounts').put(toDatabaseRecord(accountRecord));
        await tx.done;
    }

    function sendDropConnectionsMessage() {
        const msg: DropDatabaseConnectionsMessage = {
            ogameMeta: GlobalOgameMetaData,
            type: MessageType.DropDatabaseConnections,
            senderUuid: statsViewUuid,
        };
        sendMessage(msg);
    }

    async function deleteEverything() {
        sendDropConnectionsMessage();

        const allDatabases = await indexedDB.databases();
        for (const db of allDatabases) {
            if (db.name == null) {
                continue;
            }

            await deleteDB(db.name);
        }
    }

    void initialize().catch(rejectReady);

    return {
        ready,
        accounts,
        servers,
        currentAccount,
        currentServer,
        deleteCurrentAccount,
        linkAccount,
        unlinkAccount,
        deleteEverything,
    };
});

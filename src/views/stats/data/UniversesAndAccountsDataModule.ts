import { Component, Vue } from 'vue-property-decorator';
import { getGlobalDatabase, getPlayerDatabase, getPlayerDatabaseName, getServerDatabase, getServerDatabaseName, getUniverseHistoryDatabaseName } from '@/shared/db/access';
import { DbAccount, DbLinkedAccount, DbServer } from '@/shared/db/schema/global';
import { GlobalOgameMetaData, statsViewUuid } from './global';
import { CombatReportDataModule } from './CombatReportDataModule';
import { deleteDB, StoreNames } from 'idb';
import { sendMessage } from '@/shared/communication/sendMessage';
import { DropDatabaseConnectionsMessage } from '@/shared/messages/internal';
import { MessageType } from '@/shared/messages/MessageType';
import { OgameTrackerPlayerDbSchema, OgameTrackerServerDbSchema } from '@/shared/db/schema';
import { UniverseHistoryDataModule } from './UniverseHistoryDataModule';
import { ExpeditionDataModule } from './ExpeditionDataModule';
import { DebrisFieldReportDataModule } from './DebrisFieldReportDataModule';
import { EmpireDataModule } from './EmpireDataModule';
import { ServerSettingsDataModule } from './ServerSettingsDataModule';

@Component
class UniversesAndAccountsDataModuleClass extends Vue {
    private _ready!: Promise<void>;
    private _resolveReady!: () => void;

    public accounts: DbAccount[] = [];
    public servers: DbServer[] = [];

    private async created() {
        this._ready = new Promise<void>(resolve => this._resolveReady = resolve);

        await this.loadData();
    }

    public get ready(): Promise<void> {
        return this._ready;
    }

    public get currentAccount(): DbAccount {
        const account = this.accounts.find(
            a => a.serverId == GlobalOgameMetaData.serverId
                && a.serverLanguage == GlobalOgameMetaData.language
                && a.id == GlobalOgameMetaData.playerId
        );

        return account ?? {
            serverId: GlobalOgameMetaData.serverId,
            serverLanguage: GlobalOgameMetaData.language,
            id: GlobalOgameMetaData.playerId,
            name: GlobalOgameMetaData.playerId.toString(),
        };
    }

    public get currentServer(): DbServer {
        const server = this.servers.find(
            s => s.id == GlobalOgameMetaData.serverId
                && s.language == GlobalOgameMetaData.language
        );

        return server ?? {
            id: GlobalOgameMetaData.serverId,
            language: GlobalOgameMetaData.language,
            name: GlobalOgameMetaData.serverId.toString(),
        };
    }

    private async loadData() {
        const db = await getGlobalDatabase();
        const tx = db.transaction(['accounts', 'servers'], 'readonly');

        this.accounts = await tx.objectStore('accounts').getAll();
        this.servers = await tx.objectStore('servers').getAll();

        await tx.done;

        this._resolveReady();
    }

    public async deleteCurrentAccount() {
        await CombatReportDataModule.clear();
        await ExpeditionDataModule.clear();
        await DebrisFieldReportDataModule.clear();

        await EmpireDataModule.clear();


        const globalDb = await getGlobalDatabase();
        await globalDb.delete('accounts', [GlobalOgameMetaData.serverId, GlobalOgameMetaData.language, GlobalOgameMetaData.playerId]);

        const otherAccountsCount = await globalDb.countFromIndex('accounts', 'server', [GlobalOgameMetaData.serverId, GlobalOgameMetaData.language]);
        if (otherAccountsCount > 0) {
            return;
        }

        await ServerSettingsDataModule.clear();
        await UniverseHistoryDataModule.deleteCurrentServer();

        await globalDb.delete('servers', [GlobalOgameMetaData.serverId, GlobalOgameMetaData.language]);
    }

    public async linkAccount(account: DbLinkedAccount) {
        const currentAccount = this.currentAccount;
        console.debug('linking account ', account, 'with', currentAccount);
        if (currentAccount.linkedAccounts == null) {
            Vue.set(currentAccount, <keyof DbAccount>'linkedAccounts', []);
        }

        const accountIsLinked = currentAccount.linkedAccounts!.some(a => a.id == account.id && a.serverId == account.serverId && a.serverLanguage == account.serverLanguage);
        if (accountIsLinked) {
            return;
        }
        currentAccount.linkedAccounts!.push(account);

        const db = await getGlobalDatabase();
        const tx = db.transaction(['accounts'], 'readwrite');

        await tx.objectStore('accounts').put(currentAccount);

        await tx.done;

        console.debug('successfully linked account ', account, 'with', currentAccount);
    }

    public async unlinkAccount(account: DbLinkedAccount) {
        const currentAccount = this.currentAccount;
        if (currentAccount.linkedAccounts == null) {
            Vue.set(currentAccount, <keyof DbAccount>'linkedAccounts', []);
        }
        const index = currentAccount.linkedAccounts!.findIndex(a => a.id == account.id && a.serverId == account.serverId && a.serverLanguage == account.serverLanguage);
        if (index >= 0) {
            currentAccount.linkedAccounts!.splice(index, 1);
        }

        const db = await getGlobalDatabase();
        const tx = db.transaction(['accounts'], 'readwrite');

        await tx.objectStore('accounts').put(currentAccount);
        await tx.done;
    }

    private sendDropConnectionsMessage() {
        const msg: DropDatabaseConnectionsMessage = {
            ogameMeta: GlobalOgameMetaData,
            type: MessageType.DropDatabaseConnections,
            senderUuid: statsViewUuid,
        };
        sendMessage(msg);
    }

    public async deleteEverything() {
        this.sendDropConnectionsMessage();

        const allDatabases = await indexedDB.databases();
        for (const db of allDatabases) {
            if (db.name == null) {
                continue;
            }

            await deleteDB(db.name);
        }
    }
}

export const UniversesAndAccountsDataModule = new UniversesAndAccountsDataModuleClass();
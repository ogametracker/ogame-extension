import { Component, Vue } from 'vue-property-decorator';
import { getGlobalDatabase } from '@/shared/db/access';
import { DbAccount, DbServer } from '@/shared/db/schema/global';
import { GlobalOgameMetaData } from './global';

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

        this._resolveReady();
    }
}

export const UniversesAndAccountsDataModule = new UniversesAndAccountsDataModuleClass();
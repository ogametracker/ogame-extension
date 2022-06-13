import { Component, Vue } from 'vue-property-decorator';
import { getGlobalDatabase } from '@/shared/db/access';
import { DbAccount, DbServer } from '@/shared/db/schema/global';

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

    private async loadData() {
        const db = await getGlobalDatabase();
        const tx = db.transaction(['accounts', 'servers'], 'readonly');

        this.accounts = await tx.objectStore('accounts').getAll();
        this.servers = await tx.objectStore('servers').getAll();

        this._resolveReady();
    }
}

export const UniversesAndAccountsDataModule = new UniversesAndAccountsDataModuleClass();
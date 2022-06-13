import { Component, Vue } from 'vue-property-decorator';
import { getGlobalDatabase } from '@/shared/db/access';
import { DbAccount, DbServer } from '@/shared/db/schema';

@Component
class UniversesAndAccountsDataModuleClass extends Vue {
    public readonly ready = new Promise<void>(resolve => this._resolveReady = resolve);
    private _resolveReady!: () => void;

    public accounts: DbAccount[] = [];
    public servers: DbServer[] = [];

    private async created() {
        await this.loadData();
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
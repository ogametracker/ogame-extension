import { MessageType } from '@/shared/messages/MessageType';
import { Message, MessageOgameMeta } from '@/shared/messages/Message';
import { GlobalOgameMetaData } from './global';
import { Component, Vue } from 'vue-property-decorator';
import { startOfDay } from 'date-fns';
import { ogameMetasEqual } from '@/shared/ogame-web/ogameMetasEqual';
import { getPlayerDatabase } from '@/shared/db/access';
import { createRecord } from '@/shared/utils/createRecord';
import { LifeformDiscoveryEventType, LifeformDiscoveryEventTypes } from '@/shared/models/lifeform-discoveries/LifeformDiscoveryEventType';
import { LifeformDiscoveryEvent } from '@/shared/models/lifeform-discoveries/LifeformDiscoveryEvent';
import { ValidLifeformType, ValidLifeformTypes } from '@/shared/models/ogame/lifeforms/LifeformType';
import { NewLifeformDiscoveryMessage } from '@/shared/messages/tracking/lifeform-discoveries';
import { LifeformDiscoveryEventArtifactFindingSize, LifeformDiscoveryEventArtifactFindingSizes } from '@/shared/models/lifeform-discoveries/LifeformDiscoveryEventArtifactFindingSize';
import { UniversesAndAccountsDataModule } from './UniversesAndAccountsDataModule';

export interface DailyLifeformDiscoveryResult {
    date: number;
    events: Record<LifeformDiscoveryEventType, number>;
    foundLifeforms: ValidLifeformType[];
    lifeformExperience: Record<ValidLifeformType, number>;
    artifacts: number;
    artifactSizes: Record<LifeformDiscoveryEventArtifactFindingSize, number>;
}

export interface LifeformDiscoveryProgressInfo {
    discoveredDate?: number;
    discoveriesCount: number;
    gainedExperience: number;
}

@Component
class LifeformDiscoveryDataModuleClass extends Vue {
    public dailyResults: Partial<Record<number, DailyLifeformDiscoveryResult>> = {};
    public readonly lifeforms: Record<ValidLifeformType, LifeformDiscoveryProgressInfo> = createRecord(ValidLifeformTypes, lf => ({
        discoveriesCount: 0,
        gainedExperience: 0,
    }));
    private internal_firstDate: number | null = null;
    private internal_count = 0;

    private _ready!: Promise<void>;
    private _resolveReady!: () => void;

    public get ready(): Promise<void> {
        return this._ready;
    }

    public get count() {
        return this.internal_count;
    }

    public get dailyResultsArray(): DailyLifeformDiscoveryResult[] {
        return Object.values(this.dailyResults) as DailyLifeformDiscoveryResult[];
    }

    private async created() {
        this._ready = new Promise<void>(resolve => this._resolveReady = resolve);

        this.initCommunication();
        await this.loadData();
    }

    private getAccounts() {
        const la = UniversesAndAccountsDataModule.currentAccount.linkedAccounts ?? [];
        const linkedAccounts = la.map<MessageOgameMeta>(acc => ({
            playerId: acc.id,
            language: acc.serverLanguage,
            serverId: acc.serverId,
            userLanguage: 'doesnt-matter',
        }));
        const accounts: MessageOgameMeta[] = [
            GlobalOgameMetaData,
            ...linkedAccounts,
        ];

        return accounts;
    }

    private async loadData() {
        await this.$nextTick();
        await UniversesAndAccountsDataModule.ready;

        const accounts = this.getAccounts();

        let minDate: number | null = null;
        for (const account of accounts) {
            const db = await getPlayerDatabase(account);

            const lifeformDiscoveries = await db.getAll('lifeformDiscoveries');
            lifeformDiscoveries.forEach(discovery => {
                this.addLifeformDiscovery(discovery);

                minDate = Math.min(minDate ?? Number.MAX_SAFE_INTEGER, discovery.date);
            });
            this.internal_firstDate = minDate;
        }

        this._resolveReady();
    }

    public async getRawData() {
        const lifeformDiscoveries: LifeformDiscoveryEvent[] = [];
        const accounts = this.getAccounts();
        
        for (const account of accounts) {
            const db = await getPlayerDatabase(account);
            const accLfMissions = await db.getAll('lifeformDiscoveries');
            lifeformDiscoveries.push(...accLfMissions);
        }

        return lifeformDiscoveries;
    }

    private addLifeformDiscovery(discovery: LifeformDiscoveryEvent) {
        this.addLifeformDiscoveryToDailyResult(discovery);
        this.addLifeformDiscoveryToLifeformInfos(discovery);
    }

    private addTimeout: number | undefined = undefined;
    private addDiscoveries: LifeformDiscoveryEvent[] = [];

    private addLifeformDiscovery_delayed(discovery: LifeformDiscoveryEvent) {
        this.addDiscoveries.push(discovery);

        clearTimeout(this.addTimeout);
        this.addTimeout = setTimeout(() => {
            const addDiscoveries = this.addDiscoveries;
            this.addDiscoveries = [];
            addDiscoveries.forEach(discovery => this.addLifeformDiscovery(discovery));
        }, 500);
    }

    private addLifeformDiscoveryToLifeformInfos(discovery: LifeformDiscoveryEvent) {
        if (discovery.type == LifeformDiscoveryEventType.newLifeformFound) {
            this.lifeforms[discovery.lifeform].discoveredDate = discovery.date;
            this.lifeforms[discovery.lifeform].discoveriesCount++;
        }
        else if (discovery.type == LifeformDiscoveryEventType.knownLifeformFound) {
            this.lifeforms[discovery.lifeform].discoveriesCount++;
            this.lifeforms[discovery.lifeform].gainedExperience += discovery.experience;
        }
    }

    private addLifeformDiscoveryToDailyResult(discovery: LifeformDiscoveryEvent) {
        this.internal_count++;

        const day = startOfDay(discovery.date).getTime();

        let dailyResult = this.dailyResults[day];
        if (dailyResult == null) {
            dailyResult = this.getNewDailyResult(day);
            this.$set(this.dailyResults, day, dailyResult);
        }

        dailyResult.events[discovery.type]++;

        switch (discovery.type) {
            case LifeformDiscoveryEventType.knownLifeformFound: {
                dailyResult.lifeformExperience[discovery.lifeform] += discovery.experience;
                break;
            }
            case LifeformDiscoveryEventType.newLifeformFound: {
                dailyResult.foundLifeforms.push(discovery.lifeform);
                break;
            }

            case LifeformDiscoveryEventType.artifacts: {
                dailyResult.artifacts += discovery.artifacts;
                dailyResult.artifactSizes[discovery.size]++;
                break;
            }
        }
    }

    private getNewDailyResult(date: number): DailyLifeformDiscoveryResult {
        return {
            date,
            events: createRecord(LifeformDiscoveryEventTypes, 0),
            foundLifeforms: [],
            lifeformExperience: createRecord(ValidLifeformTypes, 0),
            artifacts: 0,
            artifactSizes: createRecord(LifeformDiscoveryEventArtifactFindingSizes, 0),
        };
    }

    private initCommunication() {
        chrome.runtime.onMessage.addListener(message => this.onMessage(message));
    }

    private onMessage(msg: Message) {
        const { type, ogameMeta } = msg;
        if (!ogameMetasEqual(ogameMeta, GlobalOgameMetaData)) {
            return;
        }

        switch (type) {
            case MessageType.NewLifeformDiscovery: {
                const { data: discovery } = msg as NewLifeformDiscoveryMessage;
                this.addLifeformDiscovery_delayed(discovery);
                break;
            }
        }
    }

    public get firstDay(): number {
        return startOfDay(this.internal_firstDate ?? Date.now()).getTime();
    }

    public async clear(): Promise<void> {
        const db = await getPlayerDatabase(GlobalOgameMetaData);
        await db.clear('lifeformDiscoveries');
    }
}

export const LifeformDiscoveryDataModule = new LifeformDiscoveryDataModuleClass();
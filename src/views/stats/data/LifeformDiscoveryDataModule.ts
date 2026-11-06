import { defineStore } from 'pinia';
import { computed, onScopeDispose, ref } from 'vue';
import { createReadiness, listenForMessages } from './lifecycle';
import { MessageType } from '@ogame-tracker/shared/messages/MessageType';
import type { Message, MessageOgameMeta } from '@ogame-tracker/shared/messages/Message';
import { GlobalOgameMetaData } from './global';
import { startOfDay } from 'date-fns';
import { ogameMetasEqual } from '@ogame-tracker/shared/ogame-web/ogameMetasEqual';
import { getPlayerDatabase } from '@ogame-tracker/shared/db/access';
import { createRecord } from '@ogame-tracker/shared/utils/createRecord';
import { LifeformDiscoveryEventType, LifeformDiscoveryEventTypes } from '@ogame-tracker/shared/models/lifeform-discoveries/LifeformDiscoveryEventType';
import type { LifeformDiscoveryEvent } from '@ogame-tracker/shared/models/lifeform-discoveries/LifeformDiscoveryEvent';
import { ValidLifeformTypes } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import type { ValidLifeformType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import type { NewLifeformDiscoveryMessage } from '@ogame-tracker/shared/messages/tracking/lifeform-discoveries';
import { LifeformDiscoveryEventArtifactFindingSize, LifeformDiscoveryEventArtifactFindingSizes } from '@ogame-tracker/shared/models/lifeform-discoveries/LifeformDiscoveryEventArtifactFindingSize';
import { useUniversesAndAccountsStore } from './UniversesAndAccountsDataModule';

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

export const useLifeformDiscoveryStore = defineStore('lifeformDiscovery', () => {
    const { ready, resolveReady, rejectReady } = createReadiness();

    const dailyResults = ref<Partial<Record<number, DailyLifeformDiscoveryResult>>>({});

    const lifeforms = ref<Record<ValidLifeformType, LifeformDiscoveryProgressInfo>>(createRecord(ValidLifeformTypes, lf => ({
        discoveriesCount: 0,
        gainedExperience: 0,
    })));

    const internal_firstDate = ref<number | null>(null);

    const internal_count = ref(0);

    const count = computed(() => {
        return internal_count.value;
    });

    const dailyResultsArray = computed<DailyLifeformDiscoveryResult[]>(() => {
        return Object.values(dailyResults.value) as DailyLifeformDiscoveryResult[];
    });

    async function initialize() {
        initCommunication();
        await loadData();
    }

    function getAccounts() {
        const la = useUniversesAndAccountsStore().currentAccount.linkedAccounts ?? [];
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

    async function loadData() {
        await useUniversesAndAccountsStore().ready;

        const accounts = getAccounts();

        let minDate: number | null = null;
        for (const account of accounts) {
            const db = await getPlayerDatabase(account);

            const lifeformDiscoveries = await db.getAll('lifeformDiscoveries');
            lifeformDiscoveries.forEach(discovery => {
                addLifeformDiscovery(discovery);

                minDate = Math.min(minDate ?? Number.MAX_SAFE_INTEGER, discovery.date);
            });
            internal_firstDate.value = minDate;
        }

        resolveReady();
    }

    async function getRawData() {
        const lifeformDiscoveries: LifeformDiscoveryEvent[] = [];
        const accounts = getAccounts();

        for (const account of accounts) {
            const db = await getPlayerDatabase(account);
            const accLfMissions = await db.getAll('lifeformDiscoveries');
            lifeformDiscoveries.push(...accLfMissions);
        }

        return lifeformDiscoveries;
    }

    function addLifeformDiscovery(discovery: LifeformDiscoveryEvent) {
        addLifeformDiscoveryToDailyResult(discovery);
        addLifeformDiscoveryToLifeformInfos(discovery);
    }

    let addTimeout: number | undefined = undefined;

    let addDiscoveries: LifeformDiscoveryEvent[] = [];

    function addLifeformDiscovery_delayed(discovery: LifeformDiscoveryEvent) {
        addDiscoveries.push(discovery);

        clearTimeout(addTimeout);
        addTimeout = window.setTimeout(() => {
            const pending = addDiscoveries;
            addDiscoveries = [];
            pending.forEach(discovery => addLifeformDiscovery(discovery));
        }, 500);
    }

    function addLifeformDiscoveryToLifeformInfos(discovery: LifeformDiscoveryEvent) {
        if (discovery.type == LifeformDiscoveryEventType.newLifeformFound) {
            lifeforms.value[discovery.lifeform].discoveredDate = discovery.date;
            lifeforms.value[discovery.lifeform].discoveriesCount++;
        }
        else if (discovery.type == LifeformDiscoveryEventType.knownLifeformFound) {
            lifeforms.value[discovery.lifeform].discoveriesCount++;
            lifeforms.value[discovery.lifeform].gainedExperience += discovery.experience;
        }
    }

    function addLifeformDiscoveryToDailyResult(discovery: LifeformDiscoveryEvent) {
        internal_count.value++;

        const day = startOfDay(discovery.date).getTime();

        dailyResults.value[day] ??= getNewDailyResult(day);
        const dailyResult = dailyResults.value[day];

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

    function getNewDailyResult(date: number): DailyLifeformDiscoveryResult {
        return {
            date,
            events: createRecord(LifeformDiscoveryEventTypes, 0),
            foundLifeforms: [],
            lifeformExperience: createRecord(ValidLifeformTypes, 0),
            artifacts: 0,
            artifactSizes: createRecord(LifeformDiscoveryEventArtifactFindingSizes, 0),
        };
    }

    function initCommunication() {
        listenForMessages(onMessage);
    }

    function onMessage(msg: Message) {
        const { type, ogameMeta } = msg;
        if (!ogameMetasEqual(ogameMeta, GlobalOgameMetaData)) {
            return;
        }

        switch (type) {
            case MessageType.NewLifeformDiscovery: {
                const { data: discovery } = msg as NewLifeformDiscoveryMessage;
                addLifeformDiscovery_delayed(discovery);
                break;
            }
        }
    }

    const firstDay = computed<number>(() => {
        return startOfDay(internal_firstDate.value ?? Date.now()).getTime();
    });

    async function clear(): Promise<void> {
        const db = await getPlayerDatabase(GlobalOgameMetaData);
        await db.clear('lifeformDiscoveries');
    }

    onScopeDispose(() => clearTimeout(addTimeout));

    void initialize().catch(rejectReady);

    return {
        ready,
        dailyResults,
        lifeforms,
        internal_firstDate,
        internal_count,
        count,
        dailyResultsArray,
        getRawData,
        firstDay,
        clear,
    };
});

import { defineStore } from 'pinia';
import { computed, onScopeDispose, ref } from 'vue';
import { createReadiness, listenForMessages } from './lifecycle';
import type { DebrisFieldReport } from '@ogame-tracker/shared/models/debris-field-reports/DebrisFieldReport';
import { MessageType } from '@ogame-tracker/shared/messages/MessageType';
import type { NewDebrisFieldReportMessage } from '@ogame-tracker/shared/messages/tracking/debris-fields';
import type { Message, MessageOgameMeta } from '@ogame-tracker/shared/messages/Message';
import { GlobalOgameMetaData } from './global';
import { startOfDay } from 'date-fns';
import { ogameMetasEqual } from '@ogame-tracker/shared/ogame-web/ogameMetasEqual';
import { getPlayerDatabase } from '@ogame-tracker/shared/db/access';
import { useUniversesAndAccountsStore } from './UniversesAndAccountsDataModule';
import { ResourceType } from '@ogame-tracker/shared/models/ogame/resources/ResourceType';

export type DebrisFieldResources = Record<ResourceType, number>;

export interface DailyDebrisFieldReportResult {
    date: number;
    total: DebrisFieldResources;
    normal: DebrisFieldResources;
    expedition: DebrisFieldResources;
}

export const useDebrisFieldReportStore = defineStore('debrisFieldReport', () => {
    const { ready, resolveReady, rejectReady } = createReadiness();

    const dailyResults = ref<Partial<Record<number, DailyDebrisFieldReportResult>>>({});

    const internal_firstDate = ref<number | null>(null);

    const internal_count = ref(0);

    const internal_minId = ref(0);

    const minId = computed(() => {
        return internal_minId.value;
    });

    const count = computed(() => {
        return internal_count.value;
    });

    const dailyResultsArray = computed<DailyDebrisFieldReportResult[]>(() => {
        return Object.values(dailyResults.value) as DailyDebrisFieldReportResult[];
    });

    async function initialize() {
        initCommunication();
        await loadData();
    }

    async function loadData() {
        await useUniversesAndAccountsStore().ready;

        const la = useUniversesAndAccountsStore().currentAccount.linkedAccounts ?? [];
        const linkedAccounts = la.map<MessageOgameMeta>(acc => ({
            playerId: acc.id,
            language: acc.serverLanguage,
            serverId: acc.serverId,
            userLanguage: 'doesnt-matter',
        }));
        const accounts: MessageOgameMeta[] = [GlobalOgameMetaData, ...linkedAccounts];

        let minDate: number | null = null;
        for (const account of accounts) {
            const db = await getPlayerDatabase(account);

            const reports = await db.getAll('debrisFieldReports');
            reports.forEach(report => {
                addDebrisFieldReportToDailyResult(report);

                minDate = Math.min(minDate ?? Number.MAX_SAFE_INTEGER, report.date);
            });
            internal_firstDate.value = minDate;
        }

        resolveReady();
    }

    let addTimeout: number | undefined = undefined;

    let addReports: DebrisFieldReport[] = [];

    function addDebrisFieldReportToDailyResult_delayed(report: DebrisFieldReport) {
        addReports.push(report);

        clearTimeout(addTimeout);
        addTimeout = window.setTimeout(() => {
            const pending = addReports;
            addReports = [];
            pending.forEach(report => addDebrisFieldReportToDailyResult(report));
        }, 500);
    }

    function addDebrisFieldReportToDailyResult(report: DebrisFieldReport) {
        internal_count.value++;

        const day = startOfDay(report.date).getTime();

        dailyResults.value[day] ??= getNewDailyResult(day);
        const dailyResult = dailyResults.value[day];

        dailyResult.total.metal += report.metal;
        dailyResult.total.crystal += report.crystal;
        dailyResult.total.deuterium += report.deuterium ?? 0;

        if (report.isExpeditionDebrisField) {
            dailyResult.expedition.metal += report.metal;
            dailyResult.expedition.crystal += report.crystal;
            dailyResult.expedition.deuterium += report.deuterium ?? 0;
        } else {
            dailyResult.normal.metal += report.metal;
            dailyResult.normal.crystal += report.crystal;
            dailyResult.normal.deuterium += report.deuterium ?? 0;
        }

        internal_minId.value = Math.min(internal_minId.value, report.id);
    }

    function getNewDailyResult(date: number): DailyDebrisFieldReportResult {
        return {
            date,
            total: {
                metal: 0,
                crystal: 0,
                deuterium: 0,
            },
            normal: {
                metal: 0,
                crystal: 0,
                deuterium: 0,
            },
            expedition: {
                metal: 0,
                crystal: 0,
                deuterium: 0,
            },
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
            case MessageType.NewDebrisFieldReport: {
                const { data } = msg as NewDebrisFieldReportMessage;
                addDebrisFieldReportToDailyResult_delayed(data);
                break;
            }
        }
    }

    const firstDay = computed<number>(() => {
        return startOfDay(internal_firstDate.value ?? Date.now()).getTime();
    });

    async function clear(): Promise<void> {
        const db = await getPlayerDatabase(GlobalOgameMetaData);
        await db.clear('debrisFieldReports');
    }

    onScopeDispose(() => clearTimeout(addTimeout));

    void initialize().catch(rejectReady);

    return {
        ready,
        dailyResults,
        internal_firstDate,
        internal_count,
        internal_minId,
        minId,
        count,
        dailyResultsArray,
        firstDay,
        clear,
    };
});

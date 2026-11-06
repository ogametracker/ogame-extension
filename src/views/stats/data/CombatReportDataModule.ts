import { defineStore } from 'pinia';
import { computed, onScopeDispose, ref } from 'vue';
import { createReadiness, listenForMessages } from './lifecycle';
import type { CombatReport } from '@ogame-tracker/shared/models/combat-reports/CombatReport';
import { MessageType } from '@ogame-tracker/shared/messages/MessageType';
import type { NewCombatReportMessage } from '@ogame-tracker/shared/messages/tracking/combat-reports';
import type { Message, MessageOgameMeta } from '@ogame-tracker/shared/messages/Message';
import { GlobalOgameMetaData } from './global';
import { startOfDay } from 'date-fns';
import { ogameMetasEqual } from '@ogame-tracker/shared/ogame-web/ogameMetasEqual';
import { getPlayerDatabase } from '@ogame-tracker/shared/db/access';
import { ShipType } from '@ogame-tracker/shared/models/ogame/ships/ShipType';
import { CombatResultType, CombatResultTypes } from '@ogame-tracker/shared/models/combat-reports/CombatResultType';
import { ResourceType, ResourceTypes } from '@ogame-tracker/shared/models/ogame/resources/ResourceType';
import { createRecord } from '@ogame-tracker/shared/utils/createRecord';
import { ShipTypes, ShipByTypes } from '@ogame-tracker/shared/models/ogame/ships/ShipTypes';
import { multiplyCost } from '@ogame-tracker/shared/models/ogame/common/Cost';
import { useUniversesAndAccountsStore } from './UniversesAndAccountsDataModule';

export interface DailyCombatReportResult {
    date: number;
    results: {
        onExpeditions: Record<CombatResultType, number>;
        againstPlayers: Record<CombatResultType, number>;
    };
    lostShips: {
        onExpeditions: {
            ships: Record<ShipType, number>;
            resourceUnits: Record<ResourceType, number>;
        };
        againstPlayers: {
            ships: Record<ShipType, number>;
            resourceUnits: Record<ResourceType, number>;
        };
    };

    loot: {
        gained: Record<ResourceType, number>;
        lost: Record<ResourceType, number>;
        total: Record<ResourceType, number>;
    }
}

export const useCombatReportStore = defineStore('combatReport', () => {
    const { ready, resolveReady, rejectReady } = createReadiness();

    const dailyResults = ref<Partial<Record<number, DailyCombatReportResult>>>({});

    const internal_firstDate = ref<number | null>(null);

    const internal_count = ref(0);

    const count = computed(() => {
        return internal_count.value;
    });

    const dailyResultsArray = computed<DailyCombatReportResult[]>(() => {
        return Object.values(dailyResults.value) as DailyCombatReportResult[];
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
        const accounts: MessageOgameMeta[] = [
            GlobalOgameMetaData,
            ...linkedAccounts,
        ];

        let minDate: number | null = null;
        for (const account of accounts) {
            const db = await getPlayerDatabase(account);

            const reports = await db.getAll('combatReports');
            reports.forEach(report => {
                addCombatReportToDailyResult(report);

                minDate = Math.min(minDate ?? Number.MAX_SAFE_INTEGER, report.date);
            });
            internal_firstDate.value = minDate;
        }

        resolveReady();
    }

    let addTimeout: number | undefined = undefined;

    let addCombatReports: CombatReport[] = [];

    function addCombatReportToDailyResult_delayed(report: CombatReport) {
        addCombatReports.push(report);

        clearTimeout(addTimeout);
        addTimeout = window.setTimeout(() => {
            const addCombats = addCombatReports;
            addCombatReports = [];
            addCombats.forEach(report => addCombatReportToDailyResult(report));
        }, 500);
    }

    function addCombatReportToDailyResult(report: CombatReport) {
        internal_count.value++;

        const day = startOfDay(report.date).getTime();

        dailyResults.value[day] ??= getNewDailyResult(day);
        const dailyResult = dailyResults.value[day];

        if (report.isExpedition) {
            dailyResult.results.onExpeditions[report.result]++;
        } else {
            dailyResult.results.againstPlayers[report.result]++;
        }

        const lostShips = report.isExpedition ? dailyResult.lostShips.onExpeditions : dailyResult.lostShips.againstPlayers;
        for (const ship of ShipTypes) {
            lostShips.ships[ship] += report.lostShips[ship];

            const shipData = ShipByTypes[ship];
            const resourceUnits = multiplyCost(shipData.cost, report.lostShips[ship]);

            ResourceTypes.forEach(resource => lostShips.resourceUnits[resource] += resourceUnits[resource]);
        }

        for (const resource of ResourceTypes) {
            const amount = report.loot[resource];

            dailyResult.loot.total[resource] += amount;

            if (amount < 0) {
                dailyResult.loot.lost[resource] += amount;
            } else {
                dailyResult.loot.gained[resource] += amount;
            }
        }
    }

    function getNewDailyResult(date: number): DailyCombatReportResult {
        return {
            date,
            loot: {
                lost: createRecord(ResourceTypes, 0),
                gained: createRecord(ResourceTypes, 0),
                total: createRecord(ResourceTypes, 0),
            },
            lostShips: {
                onExpeditions: {
                    ships: createRecord(ShipTypes, 0),
                    resourceUnits: createRecord(ResourceTypes, 0),
                },
                againstPlayers: {
                    ships: createRecord(ShipTypes, 0),
                    resourceUnits: createRecord(ResourceTypes, 0),
                },
            },
            results: {
                onExpeditions: createRecord(CombatResultTypes, 0),
                againstPlayers: createRecord(CombatResultTypes, 0),
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
            case MessageType.NewCombatReport: {
                const { data } = msg as NewCombatReportMessage;
                addCombatReportToDailyResult_delayed(data);
                break;
            }
        }
    }

    const firstDay = computed<number>(() => {
        return startOfDay(internal_firstDate.value ?? Date.now()).getTime();
    });

    async function clear(): Promise<void> {
        const db = await getPlayerDatabase(GlobalOgameMetaData);
        await db.clear('combatReports');
    }

    onScopeDispose(() => clearTimeout(addTimeout));

    void initialize().catch(rejectReady);

    return {
        ready,
        dailyResults,
        internal_firstDate,
        internal_count,
        count,
        dailyResultsArray,
        firstDay,
        clear,
    };
});

import { defineStore } from 'pinia';
import { computed, onScopeDispose, ref } from 'vue';
import { createReadiness, listenForMessages } from './lifecycle';
import { ExpeditionFindableShipTypes } from '@ogame-tracker/shared/models/expeditions/ExpeditionEvents';
import type {
    ExpeditionEvent,
    ExpeditionFindableShipType,
} from '@ogame-tracker/shared/models/expeditions/ExpeditionEvents';
import { MessageType } from '@ogame-tracker/shared/messages/MessageType';
import type { NewExpeditionMessage } from '@ogame-tracker/shared/messages/tracking/expeditions';
import type { Message, MessageOgameMeta } from '@ogame-tracker/shared/messages/Message';
import { GlobalOgameMetaData } from './global';
import { startOfDay } from 'date-fns';
import { ogameMetasEqual } from '@ogame-tracker/shared/ogame-web/ogameMetasEqual';
import { getPlayerDatabase } from '@ogame-tracker/shared/db/access';
import { ResourceType, ResourceTypes } from '@ogame-tracker/shared/models/ogame/resources/ResourceType';
import {
    ExpeditionEventType,
    ExpeditionEventTypes,
} from '@ogame-tracker/shared/models/expeditions/ExpeditionEventType';
import { ItemHash } from '@ogame-tracker/shared/models/ogame/items/ItemHash';
import {
    ExpeditionEventSize,
    ExpeditionEventSizes,
} from '@ogame-tracker/shared/models/expeditions/ExpeditionEventSize';
import { ShipByTypes } from '@ogame-tracker/shared/models/ogame/ships/ShipTypes';
import { multiplyCost } from '@ogame-tracker/shared/models/ogame/common/Cost';
import { createRecord } from '@ogame-tracker/shared/utils/createRecord';
import {
    ExpeditionDepletionLevel,
    ExpeditionDepletionLevels,
} from '@ogame-tracker/shared/models/expeditions/ExpeditionDepletionLevel';
import { useUniversesAndAccountsStore } from './UniversesAndAccountsDataModule';

export interface DailyExpeditionResult {
    date: number;
    events: Record<ExpeditionEventType, number>;
    findings: {
        resources: Record<ResourceType, number>;
        resourceCount: Record<ResourceType, number>;
        fleet: Record<ExpeditionFindableShipType, number>;
        fleetResourceUnits: Record<ResourceType, number>;
        darkMatter: number;
        items: ItemHash[];
    };
    eventSizes: {
        resources: Record<ExpeditionEventSize, number>;
        resourceCount: Record<ResourceType, Record<ExpeditionEventSize, number>>;
        fleet: Record<ExpeditionEventSize, number>;
        darkMatter: Record<ExpeditionEventSize, number>;
    };
    depletion: Record<ExpeditionDepletionLevel | 'unknown', number>;
}

export const useExpeditionStore = defineStore('expedition', () => {
    const { ready, resolveReady, rejectReady } = createReadiness();

    const dailyResults = ref<Partial<Record<number, DailyExpeditionResult>>>({});

    const internal_firstDate = ref<number | null>(null);

    const internal_count = ref(0);

    const count = computed(() => {
        return internal_count.value;
    });

    const dailyResultsArray = computed<DailyExpeditionResult[]>(() => {
        return Object.values(dailyResults.value) as DailyExpeditionResult[];
    });

    async function initialize() {
        initCommunication();
        await loadData();
    }

    async function loadData() {
        const expeditions = await getRawData();

        let minDate: number | null = null;
        expeditions.forEach(expedition => {
            addExpeditionToDailyResult(expedition);

            minDate = Math.min(minDate ?? Number.MAX_SAFE_INTEGER, expedition.date);
        });
        internal_firstDate.value = minDate;

        resolveReady();
    }

    async function getRawData(): Promise<ExpeditionEvent[]> {
        await useUniversesAndAccountsStore().ready;

        const la = useUniversesAndAccountsStore().currentAccount.linkedAccounts ?? [];
        const linkedAccounts = la.map<MessageOgameMeta>(acc => ({
            playerId: acc.id,
            language: acc.serverLanguage,
            serverId: acc.serverId,
            userLanguage: 'doesnt-matter',
        }));
        const accounts: MessageOgameMeta[] = [GlobalOgameMetaData, ...linkedAccounts];

        const rawExpeditions: ExpeditionEvent[] = [];
        for (const account of accounts) {
            const db = await getPlayerDatabase(account);

            const expeditions = await db.getAll('expeditions');
            rawExpeditions.push(...expeditions);
        }
        return rawExpeditions;
    }

    let addTimeout: number | undefined = undefined;

    let addExpos: ExpeditionEvent[] = [];

    function addExpeditionToDailyResult_delayed(expo: ExpeditionEvent) {
        addExpos.push(expo);

        clearTimeout(addTimeout);
        addTimeout = window.setTimeout(() => {
            const pending = addExpos;
            addExpos = [];
            pending.forEach(expo => addExpeditionToDailyResult(expo));
        }, 500);
    }

    function addExpeditionToDailyResult(expedition: ExpeditionEvent) {
        internal_count.value++;

        const day = startOfDay(expedition.date).getTime();

        dailyResults.value[day] ??= getNewDailyResult(day);
        const dailyResult = dailyResults.value[day];

        const mappedType =
            (
                {
                    [ExpeditionEventType.aliens]: ExpeditionEventType.combat,
                    [ExpeditionEventType.pirates]: ExpeditionEventType.combat,
                } as Partial<Record<ExpeditionEventType, ExpeditionEventType>>
            )[expedition.type] ?? expedition.type;

        dailyResult.events[mappedType]++;
        dailyResult.depletion[expedition.depletion ?? 'unknown']++;

        switch (expedition.type) {
            case ExpeditionEventType.resources: {
                const resource = ResourceTypes.find(res => expedition.resources[res] > 0);

                dailyResult.eventSizes.resources[expedition.size]++;

                for (const resource of ResourceTypes) {
                    dailyResult.findings.resources[resource] += expedition.resources[resource];
                }

                if (resource != null) {
                    dailyResult.eventSizes.resourceCount[resource][expedition.size]++;
                    dailyResult.findings.resourceCount[resource]++;
                }
                break;
            }

            case ExpeditionEventType.darkMatter: {
                dailyResult.eventSizes.darkMatter[expedition.size]++;
                dailyResult.findings.darkMatter += expedition.darkMatter;
                break;
            }

            case ExpeditionEventType.item: {
                dailyResult.findings.items.push(expedition.itemHash);
                break;
            }

            case ExpeditionEventType.fleet: {
                dailyResult.eventSizes.fleet[expedition.size]++;

                for (const ship of ExpeditionFindableShipTypes) {
                    const count = expedition.fleet[ship] ?? 0;
                    dailyResult.findings.fleet[ship] += count;

                    const shipData = ShipByTypes[ship];
                    const resourceUnits = multiplyCost(shipData.cost, count);

                    for (const resource of ResourceTypes) {
                        dailyResult.findings.fleetResourceUnits[resource] += resourceUnits[resource];
                    }
                }
                break;
            }
        }
    }

    function getNewDailyResult(date: number): DailyExpeditionResult {
        return {
            date,
            events: createRecord(ExpeditionEventTypes, 0),
            eventSizes: {
                resources: createRecord(ExpeditionEventSizes, 0),
                resourceCount: createRecord(ResourceTypes, () => createRecord(ExpeditionEventSizes, 0)),
                fleet: createRecord(ExpeditionEventSizes, 0),
                darkMatter: createRecord(ExpeditionEventSizes, 0),
            },
            findings: {
                darkMatter: 0,
                items: [],
                fleet: createRecord(ExpeditionFindableShipTypes, 0),
                fleetResourceUnits: createRecord(ResourceTypes, 0),
                resources: createRecord(ResourceTypes, 0),
                resourceCount: createRecord(ResourceTypes, 0),
            },
            depletion: {
                ...createRecord(ExpeditionDepletionLevels, 0),
                unknown: 0,
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
            case MessageType.NewExpedition: {
                const { data: expedition } = msg as NewExpeditionMessage;
                addExpeditionToDailyResult_delayed(expedition);
                break;
            }
        }
    }

    const firstDay = computed<number>(() => {
        return startOfDay(internal_firstDate.value ?? Date.now()).getTime();
    });

    async function clear(): Promise<void> {
        const db = await getPlayerDatabase(GlobalOgameMetaData);
        await db.clear('expeditions');
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
        getRawData,
        firstDay,
        clear,
    };
});

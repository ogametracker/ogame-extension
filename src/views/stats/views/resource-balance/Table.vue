<template>
    <div class="table-container">
        <div>
            <RangedStatsTable
                :dataItems="events"
                :items="items"
                :footerItems="footerItems"
                show-average
                :averageNumberFormatOptions="avgNumberFormat"
            >
                <template #cell-label="{ value }">
                    <span v-text="value" class="mr-2" />

                    <OResource :resource="resourceTypes[value]" :size="resourceIconSize" />
                </template>
            </RangedStatsTable>
        </div>

        <FloatingMenu v-model="showSettings" left class="floating-settings">
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <ConversionRateSettings />
            <ShowConvertedResourcesInCellsSettings />
            <hr class="two-column" />
            <ExpeditionShipResourceUnitsFactorSettings />
            <LostShipResourceUnitsFactorSettings />
            <hr class="two-column" />
            <IncludeShipsFoundOnExpeditionsInResourceBalanceSettings />
            <IncludeShipsLostInCombatsInResourceBalance />
            <IncludeLostLootResourcesInResourceBalance />
            <hr class="two-column" />
            <DetailedResourceBalanceSettings />
            <hr class="two-column" />
            <DateRangeSettings class="two-column" />
        </FloatingMenu>
    </div>
</template>

<script setup lang="ts">
import FloatingMenu from '@stats/components/common/FloatingMenu.vue';
import OResource from '@ogame-tracker/view-shared/components/ogame/OResource.vue';
import { computed, ref } from 'vue';
import { translations } from '@stats/i18n';
import RangedStatsTable from '@stats/components/stats/RangedStatsTable.vue';
import type { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
import { ResourceType, ResourceTypes } from '@ogame-tracker/shared/models/ogame/resources/ResourceType';
import { useCombatReportStore } from '@stats/data/CombatReportDataModule';
import type { DailyCombatReportResult } from '@stats/data/CombatReportDataModule';
import { useDebrisFieldReportStore } from '../../data/DebrisFieldReportDataModule';
import type { DailyDebrisFieldReportResult } from '../../data/DebrisFieldReportDataModule';
import { useExpeditionStore } from '../../data/ExpeditionDataModule';
import type { DailyExpeditionResult } from '../../data/ExpeditionDataModule';
import { useSettingsStore } from '../../data/SettingsDataModule';
import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
import DetailedResourceBalanceSettings from '@stats/components/settings/resource-balance/DetailedResourceBalanceSettings.vue';
import ConversionRateSettings from '@stats/components/settings/ConversionRateSettings.vue';
import ExpeditionShipResourceUnitsFactorSettings from '@stats/components/settings/ExpeditionShipResourceUnitsFactorSettings.vue';
import LostShipResourceUnitsFactorSettings from '@stats/components/settings/LostShipResourceUnitsFactorSettings.vue';
import { addDays, differenceInDays, startOfDay } from 'date-fns';
import ShowConvertedResourcesInCellsSettings from '@stats/components/settings/ShowConvertedResourcesInCellsSettings.vue';
import IncludeShipsFoundOnExpeditionsInResourceBalanceSettings from '@stats/components/settings/resource-balance/IncludeShipsFoundOnExpeditionsInResourceBalanceSettings.vue';
import IncludeShipsLostInCombatsInResourceBalance from '@stats/components/settings/resource-balance/IncludeShipsLostInCombatsInResourceBalance.vue';
import IncludeLostLootResourcesInResourceBalance from '@stats/components/settings/resource-balance/IncludeLostLootResourcesInResourceBalance.vue';
import { getMsuOrDsu } from '../../models/settings/getMsuOrDsu';

type EventType = 'expedition' | 'combat-report' | 'debris-field-report';

const EventTypes: EventType[] = ['expedition', 'combat-report', 'debris-field-report'];

interface DailyEvents {
    date: number;

    expeditions?: DailyExpeditionResult;
    combats?: DailyCombatReportResult;
    debrisFields?: DailyDebrisFieldReportResult;
}

const settingsStore = useSettingsStore();

const combatReportStore = useCombatReportStore();

const debrisFieldReportStore = useDebrisFieldReportStore();

const expeditionStore = useExpeditionStore();

const showSettings = ref(false);

const avgNumberFormat: Intl.NumberFormatOptions = {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
};

const includeFoundShipsFactor = computed<Record<ResourceType, number>>(() => {
    const { factor, deuteriumFactor } = settingsStore.settings.expeditionFoundShipsResourceUnits;
    const settingFactor = includeFoundShips.value ? 1 : 0;

    return {
        [ResourceType.metal]: factor * settingFactor,
        [ResourceType.crystal]: factor * settingFactor,
        [ResourceType.deuterium]: deuteriumFactor * settingFactor,
    };
});

const includeFoundShips = computed(
    () => settingsStore.settings.resourceBalance.includeExpeditionFoundShipsResourceUnits,
);

const includeLostShips = computed(() => settingsStore.settings.resourceBalance.includeLostShipsResourceUnits);

const includeLostShipsFactor = computed<Record<ResourceType, number>>(() => {
    const { factor, deuteriumFactor } = settingsStore.settings.lostShipsResourceUnits;
    const settingFactor = includeLostShips.value ? 1 : 0;

    return {
        [ResourceType.metal]: factor * settingFactor,
        [ResourceType.crystal]: factor * settingFactor,
        [ResourceType.deuterium]: deuteriumFactor * settingFactor,
    };
});

const includeLostLoot = computed(() => settingsStore.settings.resourceBalance.includeLostLootResources);

const resourceTypes = computed<Record<string, ResourceType>>(() => {
    return {
        [translations().extension.resources.metal]: ResourceType.metal,
        [translations().extension.resources.crystal]: ResourceType.crystal,
        [translations().extension.resources.deuterium]: ResourceType.deuterium,
    };
});

const events = computed<DailyEvents[]>(() => {
    const minDay = Math.min(combatReportStore.firstDay, debrisFieldReportStore.firstDay, expeditionStore.firstDay);
    const dayCount = differenceInDays(startOfDay(Date.now()), minDay);
    const days = Array.from({ length: dayCount + 1 }).map((_, add) => addDays(minDay, add).getTime());

    return days
        .map<DailyEvents>(day => ({
            date: day,
            expeditions: expeditionStore.dailyResults[day],
            combats: combatReportStore.dailyResults[day],
            debrisFields: debrisFieldReportStore.dailyResults[day],
        }))
        .filter(ev => (ev.expeditions ?? ev.combats ?? ev.debrisFields) != null);
});

const settings = computed(() => settingsStore.settings.resourceBalance);

const resourceIconSize = computed(() => {
    if (settings.value.showDetailedBreakdown) {
        return '36px';
    }
    return '24px';
});

const items = computed<RangedStatsTableItem<DailyEvents>[]>(() => {
    if (settings.value.showDetailedBreakdown) {
        const types: Record<ResourceType, (EventType | null)[]> = {
            [ResourceType.metal]: ['expedition', 'combat-report', 'debris-field-report', null],
            [ResourceType.crystal]: ['expedition', 'combat-report', 'debris-field-report', null],
            [ResourceType.deuterium]: ['expedition', 'combat-report', 'debris-field-report', null],
        };

        return ResourceTypes.map<RangedStatsTableItem<DailyEvents>>(resource => ({
            label: translations().extension.resources[resource],
            items: types[resource].map(eventType => ({
                label:
                    eventType == null
                        ? translations().extension.common.sum
                        : translations().extension.resourceBalance[eventType],
                getValue: nextEvents => getResources(nextEvents, eventType, resource),
                class: eventType == null ? 'sum-item' : '',
                labelClass: eventType == null ? 'sum-item' : '',
            })),
        }));
    }

    return ResourceTypes.map(resource => ({
        label: translations().extension.resources[resource],
        getValue: nextEvents => getResources(nextEvents, null, resource),
    }));
});

function getResources(nextEvents: DailyEvents[], eventType: EventType | null, resource: ResourceType): number {
    return nextEvents.reduce((acc, event) => {
        switch (eventType) {
            case 'expedition':
                return acc + getResource({ date: event.date, expeditions: event.expeditions }, resource);
            case 'combat-report':
                return acc + getResource({ date: event.date, combats: event.combats }, resource);
            case 'debris-field-report':
                return acc + getResource({ date: event.date, debrisFields: event.debrisFields }, resource);
            case null:
                return acc + getResource(event, resource);
        }
    }, 0);
}

function getResource(dayEvents: DailyEvents, resource: ResourceType): number {
    return (
        getExpeditionResourceAmount(dayEvents.expeditions, resource)
        + getCombatResourceAmount(dayEvents.combats, resource)
        + getDebrisFieldResourceAmount(dayEvents.debrisFields, resource)
    );
}

function getExpeditionResourceAmount(expeditions: DailyExpeditionResult | undefined, resource: ResourceType): number {
    if (expeditions == null) {
        return 0;
    }

    const localIncludeFoundShipsFactor = includeFoundShipsFactor.value[resource];
    const total =
        expeditions.findings.resources[resource]
        + expeditions.findings.fleetResourceUnits[resource] * localIncludeFoundShipsFactor;

    return total;
}

function getCombatResourceAmount(dailyReports: DailyCombatReportResult | undefined, resource: ResourceType): number {
    if (dailyReports == null) {
        return 0;
    }

    const lostLootFactor = includeLostLoot.value ? 1 : 0;
    const lootResources = dailyReports.loot.lost[resource] * lostLootFactor + dailyReports.loot.gained[resource];

    const localIncludeLostShipsFactor = includeLostShipsFactor.value[resource];
    const lostShipResourceUnits =
        (dailyReports.lostShips.onExpeditions.resourceUnits[resource]
            + dailyReports.lostShips.againstPlayers.resourceUnits[resource])
        * localIncludeLostShipsFactor;

    const total = lootResources - lostShipResourceUnits;

    return total;
}

function getDebrisFieldResourceAmount(
    reports: DailyDebrisFieldReportResult | undefined,
    resource: ResourceType,
): number {
    if (reports == null) {
        return 0;
    }

    return reports.total[resource];
}

const footerItems = computed<RangedStatsTableItem<DailyEvents>[]>(() => {
    const result: RangedStatsTableItem<DailyEvents>[] = [
        {
            label: translations().extension.common.resourceUnits,
            getValue: nextEvents =>
                ResourceTypes.reduce(
                    (total, resource) =>
                        total
                        + EventTypes.reduce(
                            (total, eventType) => total + getResources(nextEvents, eventType, resource),
                            0,
                        ),
                    0,
                ),
        },
    ];

    if (settingsStore.settings.showCellsWithConvertedResourceUnits) {
        result.push({
            label: `${translations().extension.common.resourceUnits} (${settingsStore.settings.conversionRates.mode == 'msu' ? translations().extension.common.msu : translations().extension.common.dsu})`,
            getValue: nextEvents =>
                ResourceTypes.reduce(
                    (total, resource) =>
                        total
                        + EventTypes.reduce(
                            (total, eventType) =>
                                total
                                + getMsuOrDsu({
                                    [resource]: getResources(nextEvents, eventType, resource),
                                }),
                            0,
                        ),
                    0,
                ),
        });
    }

    return result;
});
</script>

<style lang="scss" scoped>
.table-container {
    display: grid;
    column-gap: 4px;
    grid-template-columns: 1fr auto;
    align-items: start;
    height: 100%;

    :deep(.sum-item) {
        font-weight: bold;
        border-top: 1px solid rgba(var(--color), 0.5);
        margin-top: 1px;
    }
}

.floating-settings:deep(.floating-menu) {
    display: grid;
    grid-template-columns: auto auto;
    column-gap: 8px;

    .two-column {
        grid-column: 1 / span 2;
    }

    hr {
        width: 100%;
    }
}
</style>

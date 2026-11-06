<template>
    <div>
        <div class="table">
            <table>
                <thead>
                    <tr>
                        <td />
                        <td />
                        <td v-text="translations().extension.settings.dateRanges.headers.label" />
                        <td v-text="translations().extension.settings.dateRanges.headers.type" />
                        <td colspan="2" v-text="translations().extension.settings.dateRanges.headers.rangeStart" />
                        <td colspan="2" v-text="translations().extension.settings.dateRanges.headers.rangeContains" />
                        <td>
                            <ResetButton @reset="resetDateRanges()" />
                        </td>
                    </tr>
                </thead>
                <Draggable
                    tag="tbody"
                    v-model="items"
                    :item-key="rangeKey"
                    handle=".grab"
                    @change="onItemsUpdated()"
                >
                    <template #item="{ element: range }">
                    <tr>
                        <td>
                            <span class="grab mdi mdi-drag" />
                        </td>
                        <td>
                            <span
                                v-if="range.type != 'all'"
                                class="delete mdi mdi-delete"
                                @click="deleteRange(range)"
                            />
                        </td>
                        <td>
                            <input
                                v-if="range.type != 'all'"
                                type="text"
                                v-model.lazy="range.label"
                                @change="onItemsUpdated()"
                            />
                            <span
                                v-else
                                v-text="translations().extension.settings.dateRanges.since(translations().extension.settings.dateRanges.firstDayTemplate)"
                            />
                        </td>
                        <td>
                            <select
                                v-if="range.type != 'all'"
                                v-model="range.type"
                                @change="onItemsUpdated()"
                            >
                                <option
                                    v-for="rangeType in rangeTypes"
                                    :key="rangeType"
                                    :value="rangeType"
                                    v-text="translations().extension.settings.dateRanges[rangeType]"
                                />
                            </select>
                        </td>
                        <td>
                            <input
                                v-if="range.type != 'all'"
                                type="number"
                                v-model="range.skip"
                                @change="onItemsUpdated()"
                            />
                        </td>
                        <td style="text-align: left; padding-left: 0">
                            <span v-text="translations().extension.settings.dateRanges[`${range.type}sAgo`]" />
                        </td>
                        <td>
                            <input
                                v-if="range.type != 'all'"
                                type="number"
                                v-model="range.take"
                                @change="onItemsUpdated()"
                            />
                        </td>
                        <td style="text-align: left; padding-left: 0">
                            <span v-text="translations().extension.settings.dateRanges[`${range.type}s`]" />
                        </td>
                        <td v-text="getRangeText(range)" style="font-style: italic;" />
                    </tr>
                    </template>
                </Draggable>
                <tfoot>
                    <tr>
                        <td />
                        <td>
                            <span
                                class="add mdi mdi-plus"
                                @click="addNewRange()"
                            />
                        </td>
                        <td colspan="7" />
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { translations, formatDate } from '@stats/i18n';
import type { DateRange, DateRangeType } from '@ogame-tracker/shared/models/settings/DateRange';
import { getDefaultSettings } from '@ogame-tracker/shared/models/settings/getDefaultSettings';
import { useSettingsStore } from '../../data/SettingsDataModule';
import { getRangeDays } from '../../utils/dateRanges';
import ResetButton from './ResetButton.vue';
import Draggable from 'vuedraggable';

const settingsStore = useSettingsStore();

const items = ref<DateRange[]>([]);
const rangeKeys = new WeakMap<DateRange, number>();
let nextRangeKey = 0;

function rangeKey(range: DateRange): number {
    const existing = rangeKeys.get(range);
    if (existing != null) {
        return existing;
    }
    const key = nextRangeKey++;
    rangeKeys.set(range, key);
    return key;
}

const rangeTypes: DateRangeType[] = [
    'day',
    'week',
    'month',
    'year',
];

function getRangeText(range: DateRange): string {
    if (range.type == 'all') {
        return '';
    }

    const rangeDays = getRangeDays(range);
    if (rangeDays.firstDay == rangeDays.lastDay) {
        return formatDate(rangeDays.firstDay, 'date');
    }

    return `${formatDate(rangeDays.firstDay, 'date')} - ${formatDate(rangeDays.lastDay, 'date')}`;
}

function initItems() {
    items.value = [...settingsStore.settings.dateRanges];
}

async function deleteRange(item: DateRange) {
    items.value = items.value.filter(i => i != item);
    await onItemsUpdated();
}

function addNewRange() {
    items.value.push({
        type: 'day',
        skip: 0,
        take: 1,
        label: translations().extension.settings.dateRanges.defaultNames.newRange,
    });
    onItemsUpdated();
}

function onItemsUpdated() {
    settingsStore.updateSettings({
        ...settingsStore.settings,
        dateRanges: [...items.value],
    });
}

const settings = computed(() => settingsStore.settings);

function onSettingsChanged() {
    initItems();
}

function resetDateRanges() {
    const defaultRanges = getDefaultSettings(settingsStore.settings.extensionLanguage).dateRanges;

    settingsStore.updateSettings({
        ...settingsStore.settings,
        dateRanges: defaultRanges,
    });

    initItems();
}

watch(() => settings.value, onSettingsChanged);

onMounted(() => {
    initItems();
});
</script>

<style lang="scss" scoped>
    .mdi {
        opacity: 0.5;
        transform: scale(1.5);
        display: inline-block;

        &:hover {
            opacity: 1;
        }
    }

    .delete,
    .add {
        cursor: pointer;
    }

    .grab {
        cursor: grab;
    }

    input[type="number"] {
        width: 64px;
        margin-right: 0.5rem;
    }
</style>

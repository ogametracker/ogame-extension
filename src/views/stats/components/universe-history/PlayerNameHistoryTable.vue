<template>
    <LoadingSpinner v-if="loading" />
    <GridTable v-else :columns="nameHistoryColumns" :items="nameHistoryItems" inline>
        <template #cell-start="{ value }">
            <span v-if="value != null" v-text="formatDate(value, 'date')" />
            <span v-else v-text="'?'" />
        </template>

        <template #cell-->-</template>

        <template #cell-end="{ value }">
            <span v-if="value != null" v-text="formatDate(value, 'date')" />
            <span v-else v-text="translations().extension.universeHistory.today" />
        </template>
    </GridTable>
</template>

<script setup lang="ts">
import GridTable from '@stats/components/common/GridTable.vue';
import LoadingSpinner from '@stats/components/common/LoadingSpinner.vue';
import { computed, ref, watch } from 'vue';
import { translations, formatDate } from '@stats/i18n';
import type { OgameTrackerUniverseHistoryPlayerName } from '@ogame-tracker/shared/db/schema/universe-history';
import { useUniverseHistoryStore } from '../../data/UniverseHistoryDataModule';
import type { GridTableColumn } from '../common/GridTable.vue';

interface NameHistoryItem {
    name: string;
    start: number | null;
    end: number | null;
}

const props = defineProps({
    playerId: { required: true, type: Number },
});

const universeHistoryStore = useUniverseHistoryStore();

const history = ref<OgameTrackerUniverseHistoryPlayerName[]>([]);

const loading = ref(true);

async function onPlayerIdChanged() {
    history.value = await universeHistoryStore.getPlayerNameHistory(props.playerId);
    loading.value = false;
}

const nameHistoryColumns = computed<GridTableColumn<keyof NameHistoryItem | '-'>[]>(() => {
    return [
        {
            key: 'name',
            label: translations().extension.universeHistory.name,
        },
        {
            key: 'start',
            label: translations().extension.universeHistory.from,
        },
        {
            key: '-',
        },
        {
            key: 'end',
            label: translations().extension.universeHistory.until,
        },
    ];
});

const nameHistoryItems = computed<NameHistoryItem[]>(() => {
    return history.value
        .map<NameHistoryItem>((item, i, nextHistory) => {
            const start = i == 0 ? null : item.date;
            const end = nextHistory[i + 1]?.date ?? null;

            return {
                name: item.name,
                start,
                end,
            };
        })
        .reverse();
});

watch(() => props.playerId, onPlayerIdChanged, { immediate: true });
</script>

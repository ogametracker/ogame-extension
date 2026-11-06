<template>
    <loading-spinner v-if="loading" />
    <grid-table v-else :columns="columns" :items="items" inline>
        <template #cell-members="{ value }">
            <div class="member-list">
                <span v-for="(player, i) in value" :key="i" v-text="player" />
            </div>
        </template>

        <template #cell-start="{ value }">
            <span v-if="value != null" v-text="formatDate(value, 'date')" />
            <span v-else v-text="'?'" />
        </template>

        <template #cell-->-</template>

        <template #cell-end="{ value }">
            <span v-if="value != null" v-text="formatDate(value, 'date')" />
            <span v-else v-text="translations().extension.universeHistory.today" />
        </template>
    </grid-table>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { translations, formatDate } from '@stats/i18n';
import type { OgameTrackerUniverseHistoryAllianceMembers } from '@ogame-tracker/shared/db/schema/universe-history';
import { useUniverseHistoryStore } from '../../data/UniverseHistoryDataModule';
import type { GridTableColumn } from '../common/GridTable.vue';

interface MembersHistoryItem {
    members: string[];
    start: number | null;
    end: number | null;
}

const props = defineProps({
    allianceId: { required: true, type: Number },
});

const universeHistoryStore = useUniverseHistoryStore();

const history = ref<OgameTrackerUniverseHistoryAllianceMembers[]>([]);

const playerNames = ref<Record<number, string>>({});

const loading = ref(true);

async function onAllianceIdChanged() {
    history.value = await universeHistoryStore.getAllianceMemberHistory(props.allianceId);
    playerNames.value = await universeHistoryStore.getLatestPlayerNamesById();
    loading.value = false;
}

const columns = computed<GridTableColumn<keyof MembersHistoryItem | '-'>[]>(() => {
    return [
        {
            key: 'members',
            label: translations().extension.universeHistory.members,
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

const items = computed<MembersHistoryItem[]>(() => {
    return history.value.map<MembersHistoryItem>((item, i, nextHistory) => {
        const start = i == 0 ? null : item.date;
        const end = nextHistory[i + 1]?.date ?? null;

        return {
            members: item.members.map(id => playerNames.value[id]).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())),
            start,
            end,
        };
    }).reverse();
});

watch(() => props.allianceId, onAllianceIdChanged, { immediate: true });
</script>

<style lang="scss" scoped>
    .member-list {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        justify-items: start;
        column-gap: 16px;
        width: 100%;
    }
</style>

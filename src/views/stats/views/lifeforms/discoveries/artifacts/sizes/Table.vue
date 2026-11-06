<template>
    <div class="table-container">
        <ranged-stats-table :dataItems="missions" :items="items" :footerItems="footerItems" show-percentage>
            <template #cell-label="{ value }">
                <span v-text="value" />

                <span
                    v-if="value == translations().extension.empire.lifeforms.artifactFindingSizes[LifeformDiscoveryEventArtifactFindingSize.small]"
                    class="mdi mdi-hexagon-slice-1"
                    :style="{ color: colors[LifeformDiscoveryEventArtifactFindingSize.small] }"
                />
                <span
                    v-else-if="value == translations().extension.empire.lifeforms.artifactFindingSizes[LifeformDiscoveryEventArtifactFindingSize.medium]"
                    class="mdi mdi-hexagon-slice-3"
                    :style="{ color: colors[LifeformDiscoveryEventArtifactFindingSize.medium] }"
                />
                <span
                    v-else-if="value == translations().extension.empire.lifeforms.artifactFindingSizes[LifeformDiscoveryEventArtifactFindingSize.large]"
                    class="mdi mdi-hexagon-slice-5"
                    :style="{ color: colors[LifeformDiscoveryEventArtifactFindingSize.large] }"
                />
                <span
                    v-else-if="value == translations().extension.empire.lifeforms.artifactFindingSizes[LifeformDiscoveryEventArtifactFindingSize.storageFull]"
                    class="mdi mdi-hexagon-outline"
                    :style="{ color: colors[LifeformDiscoveryEventArtifactFindingSize.storageFull] }"
                />
            </template>
        </ranged-stats-table>

        <floating-menu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <date-range-settings />
        </floating-menu>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { translations } from '@stats/i18n';
import RangedStatsTable from '@stats/components/stats/RangedStatsTable.vue';
import type { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
import { useSettingsStore } from '@stats/data/SettingsDataModule';
import { useLifeformDiscoveryStore } from '@stats/data/LifeformDiscoveryDataModule';
import type { DailyLifeformDiscoveryResult } from '@stats/data/LifeformDiscoveryDataModule';
import { LifeformDiscoveryEventArtifactFindingSize, LifeformDiscoveryEventArtifactFindingSizes } from '@ogame-tracker/shared/models/lifeform-discoveries/LifeformDiscoveryEventArtifactFindingSize';

const settingsStore = useSettingsStore();

const lifeformDiscoveryStore = useLifeformDiscoveryStore();

const showSettings = ref(false);

const colors = computed(() => settingsStore.settings.colors.lifeformDiscoveries.artifactFindingSizes);

const missions = computed(() => lifeformDiscoveryStore.dailyResultsArray);

const items = computed<RangedStatsTableItem<DailyLifeformDiscoveryResult>[]>(() => {
    return LifeformDiscoveryEventArtifactFindingSizes.map(size => ({
        label: translations().extension.empire.lifeforms.artifactFindingSizes[size],
        getValue: nextMissions => nextMissions.reduce((acc, cur) => acc + cur.artifactSizes[size], 0),
    }));
});

const footerItems = computed<RangedStatsTableItem<DailyLifeformDiscoveryResult>[]>(() => {
    return [{
        label: translations().extension.common.sum,
        getValue: expos => expos.reduce((acc, cur) => acc + cur.events.artifacts, 0),
    }];
});
</script>

<style lang="scss" scoped>
    .ranged-stats-table .mdi {
        transform: translateX(-30%) scale(1.6);
        width: 24px;
        display: inline-block;
    }

    .table-container {
        display: grid;
        column-gap: 4px;
        grid-template-columns: 1fr auto;
        align-items: start;
        height: 100%;
    }
</style>

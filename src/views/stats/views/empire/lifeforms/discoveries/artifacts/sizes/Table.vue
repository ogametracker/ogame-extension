<template>
    <div class="table-container">
        <ranged-stats-table :dataItems="missions" :items="items" :footerItems="footerItems" show-percentage>
            <template #cell-label="{ value }">
                <span v-text="value" />

                <span
                    v-if="value == $i18n.$t.extension.empire.lifeforms.artifactFindingSizes.small"
                    class="mdi mdi-hexagon-slice-1"
                    :style="{ color: colors.small }"
                />
                <span
                    v-else-if="value == $i18n.$t.extension.empire.lifeforms.artifactFindingSizes.medium"
                    class="mdi mdi-hexagon-slice-3"
                    :style="{ color: colors.medium }"
                />
                <span
                    v-else-if="value == $i18n.$t.extension.empire.lifeforms.artifactFindingSizes.large"
                    class="mdi mdi-hexagon-slice-5"
                    :style="{ color: colors.large }"
                />
                <span
                    v-else-if="value == $i18n.$t.extension.empire.lifeforms.artifactFindingSizes.storageFull"
                    class="mdi mdi-hexagon-outline"
                    :style="{ color: colors.storageFull }"
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

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import RangedStatsTable, { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
    import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import { DailyLifeformDiscoveryResult, LifeformDiscoveryDataModule } from '@/views/stats/data/LifeformDiscoveryDataModule';
    import { LifeformDiscoveryEventArtifactFindingSizes } from '@/shared/models/lifeform-discoveries/LifeformDiscoveryEventArtifactFindingSize';

    @Component({
        components: {
            RangedStatsTable,
            DateRangeSettings,
        },
    })
    export default class Table extends Vue {
        private showSettings = false;

        private get colors() {
            return SettingsDataModule.settings.colors.lifeformDiscoveries.artifactFindingSizes;
        }

        private get missions() {
            return LifeformDiscoveryDataModule.dailyResultsArray;
        }

        private get items(): RangedStatsTableItem<DailyLifeformDiscoveryResult>[] {
            return LifeformDiscoveryEventArtifactFindingSizes.map(size => ({
                label: this.$i18n.$t.extension.empire.lifeforms.artifactFindingSizes[size],
                getValue: missions => missions.reduce((acc, cur) => acc + cur.artifactSizes[size], 0),
            }));
        }

        private get footerItems(): RangedStatsTableItem<DailyLifeformDiscoveryResult>[] {
            return [{
                label: this.$i18n.$t.extension.common.sum,
                getValue: expos => expos.reduce((acc, cur) => acc + cur.events.artifacts, 0),
            }];
        }
    }
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
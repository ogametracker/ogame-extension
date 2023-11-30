<template>
    <div class="table-container">
        <ranged-stats-table :dataItems="missions" :items="items" show-percentage>
            <template #cell-label="{ value }">
                <span v-text="value" class="mr-2" />
                <span class="mdi mdi-pyramid" :style="{ color: color }" />
            </template>
        </ranged-stats-table>

        <floating-menu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <date-range-settings />
            <LifeformDiscoveryColorSettings />
        </floating-menu>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import RangedStatsTable, { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
    import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import LifeformDiscoveryColorSettings from '@/views/stats/components/settings/colors/LifeformDiscoveryColorSettings.vue';
    import { DailyLifeformDiscoveryResult, LifeformDiscoveryDataModule } from '@/views/stats/data/LifeformDiscoveryDataModule';
    import { LifeformDiscoveryEventArtifactFindingSizes } from '@/shared/models/lifeform-discoveries/LifeformDiscoveryEventArtifactFindingSize';

    @Component({
        components: {
            RangedStatsTable,
            DateRangeSettings,
            LifeformDiscoveryColorSettings,
        },
    })
    export default class Table extends Vue {
        private showSettings = false;

        private get color() {
            return SettingsDataModule.settings.colors.lifeformDiscoveries.events.artifacts;
        }

        private get missions() {
            return LifeformDiscoveryDataModule.dailyResultsArray;
        }

        private get items(): RangedStatsTableItem<DailyLifeformDiscoveryResult>[] {
            return [{
                label: this.$i18n.$t.extension.empire.lifeforms.artifacts,
                getValue: missions => missions.reduce((acc, expo) => acc + expo.artifacts, 0),
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
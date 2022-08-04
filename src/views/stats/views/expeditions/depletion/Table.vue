<template>
    <div class="table-container">
        <ranged-stats-table :dataItems="expos" :items="items" :footerItems="footerItems" show-percentage show-average :averageNumberFormatOptions="avgFormat">
            <template #cell-label="{ value }">
                <span v-text="value" class="mr-2" />

                <span
                    class="mdi"
                    :class="{
                        unknown: 'mdi-help',
                        none: 'mdi-signal-cellular-outline',
                        low: 'mdi-signal-cellular-1',
                        medium: 'mdi-signal-cellular-2',
                        high: 'mdi-signal-cellular-3',
                    }[depletionLevelsByLabel[value]]"
                    :style="{ color: colors[depletionLevelsByLabel[value]] }"
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
    import { DailyExpeditionResult, ExpeditionDataModule } from '@/views/stats/data/ExpeditionDataModule';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
    import ExpeditionEventResourcesIcon from '@/views/_shared/components/ExpeditionEventResourcesIcon.vue';
    import { ExpeditionDepletionLevel, ExpeditionDepletionLevels } from '@/shared/models/expeditions/ExpeditionDepletionLevel';
    import { createRecord } from '@/shared/utils/createRecord';
    import { _throw } from '@/shared/utils/_throw';

    @Component({
        components: {
            RangedStatsTable,
            DateRangeSettings,
            ExpeditionEventResourcesIcon,
        },
    })
    export default class Table extends Vue {
        private showSettings = false;

        private avgFormat: Intl.NumberFormatOptions = {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        };

        private get colors() {
            return SettingsDataModule.settings.colors.expeditions.depletion;
        }

        private get expos() {
            return ExpeditionDataModule.dailyResultsArray;
        }

        private readonly depletionLevels: (ExpeditionDepletionLevel | 'unknown')[] = [...ExpeditionDepletionLevels, 'unknown'];

        private get items(): RangedStatsTableItem<DailyExpeditionResult>[] {
            return this.depletionLevels.map<RangedStatsTableItem<DailyExpeditionResult>>(level => ({
                label: this.$i18n.$t.expeditions.depletionLevels[level],
                getValue: expos => expos.reduce((acc, expo) => acc + expo.depletion[level], 0),
            }));
        }

        private get footerItems(): RangedStatsTableItem<DailyExpeditionResult>[] {
            return [{
                label: this.$i18n.$t.common.sum,
                getValue: expos => this.depletionLevels.reduce(
                    (acc, type) => acc + expos.reduce((acc, expo) => acc + expo.depletion[type], 0),
                    0
                ),
            }];
        }

        private get depletionLevelsByLabel(): Record<string, ExpeditionDepletionLevel | 'unknown'> {
            return createRecord(
                this.depletionLevels.map(level => this.$i18n.$t.expeditions.depletionLevels[level]),
                label => this.depletionLevels.find(level => label == this.$i18n.$t.expeditions.depletionLevels[level]) ?? _throw(`failed to find depletion level for label '${label}'`),
            );
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
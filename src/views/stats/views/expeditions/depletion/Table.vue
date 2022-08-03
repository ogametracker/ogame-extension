<template>
    <div class="table-container">
        <ranged-stats-table :dataItems="expos" :items="items" :footerItems="footerItems" show-percentage show-average :averageNumberFormatOptions="avgFormat">
            <template #cell-label="{ value }">
                <span v-text="value" class="mr-2" />

                <span
                    class="mdi"
                    :class="{

                    }[]"
                    :style="{ color: colors.lostFleet }"
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
    import { ExpeditionEventTypes } from '@/shared/models/expeditions/ExpeditionEventType';
    import { DailyExpeditionResult, ExpeditionDataModule } from '@/views/stats/data/ExpeditionDataModule';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
    import { ItemHash } from '@/shared/models/ogame/items/ItemHash';
    import ExpeditionEventResourcesIcon from '@/views/_shared/components/ExpeditionEventResourcesIcon.vue';
    import { ExpeditionDepletionLevel, ExpeditionDepletionLevels } from '@/shared/models/expeditions/ExpeditionDepletionLevel';

    @Component({
        components: {
            RangedStatsTable,
            DateRangeSettings,
            ExpeditionEventResourcesIcon,
        },
    })
    export default class Table extends Vue {
        private showSettings = false;
        private readonly detroidItem = ItemHash.detroid_bronze;

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

        private get items(): RangedStatsTableItem<DailyExpeditionResult>[] {
            const levels: (ExpeditionDepletionLevel | 'unknown')[] = [...ExpeditionDepletionLevels, 'unknown'];
            return levels.map<RangedStatsTableItem<DailyExpeditionResult>>(level => ({
                label: this.$i18n.$t.expeditions.depletionLevels[level],
                getValue: expos => expos.reduce((acc, expo) => acc + expo.depletion[level], 0),
            }));
        }

        private get footerItems(): RangedStatsTableItem<DailyExpeditionResult>[] {
            const levels: (ExpeditionDepletionLevel | 'unknown')[] = [...ExpeditionDepletionLevels, 'unknown'];
            
            return [{
                label: this.$i18n.$t.common.sum,
                getValue: expos => ExpeditionEventTypes.reduce(
                    (acc, type) => acc + expos.reduce((acc, expo) => acc + expo.events[type], 0),
                    0
                ),
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
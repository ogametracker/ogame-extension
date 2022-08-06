<template>
    <div class="table-container">
        <ranged-stats-table
            :dataItems="discoveries"
            :items="items"
            :footerItems="footerItems"
            show-average
            show-percentage
            :averageNumberFormatOptions="avgNumberFormat"
        >
            <template #cell-label="{ value }">
                <span v-text="value" class="mr-2" />

                <o-lifeform :lifeform="lifeformTypes[value]" size="24px" />
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
    import { DailyLifeformDiscoveryResult, LifeformDiscoveryDataModule } from '@/views/stats/data/LifeformDiscoveryDataModule';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import { LifeformType, ValidLifeformTypes } from '@/shared/models/ogame/lifeforms/LifeformType';

    @Component({
        components: {
            RangedStatsTable,
            DateRangeSettings,
        },
    })
    export default class Table extends Vue {
        private showSettings = false;

        private readonly avgNumberFormat: Intl.NumberFormatOptions = {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        };

        private get discoveries() {
            return LifeformDiscoveryDataModule.dailyResultsArray;
        }

        private get colors() {
            return SettingsDataModule.settings.colors.lifeforms;
        }

        private get lifeformTypes(): Record<string, LifeformType> {
            return {
                [this.$i18n.$t.lifeforms.humans]: LifeformType.humans,
                [this.$i18n.$t.lifeforms.rocktal]: LifeformType.rocktal,
                [this.$i18n.$t.lifeforms.mechas]: LifeformType.mechas,
                [this.$i18n.$t.lifeforms.kaelesh]: LifeformType.kaelesh,
            };
        }

        private get items(): RangedStatsTableItem<DailyLifeformDiscoveryResult>[] {
            return ValidLifeformTypes.map(lifeform => ({
                label: this.$i18n.$t.lifeforms[lifeform],
                getValue: discoveries => discoveries.reduce(
                    (acc, disc) => acc + disc.lifeformExperience[lifeform],
                    0
                ),
            }));
        }

        private get footerItems(): RangedStatsTableItem<DailyLifeformDiscoveryResult>[] {
            return [{
                label: this.$i18n.$t.common.sum,
                getValue: discoveries => discoveries.reduce(
                    (acc, disc) => acc + Object.values(disc.lifeformExperience).reduce((acc, cur) => acc + cur, 0),
                    0
                ),
            }];
        }
    }
</script>
<style lang="scss" scoped>
    .table-container {
        display: grid;
        column-gap: 4px;
        grid-template-columns: 1fr auto;
        align-items: start;
        height: 100%;
    }
</style>
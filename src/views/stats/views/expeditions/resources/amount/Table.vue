<template>
    <div class="table-container">
        <ranged-stats-table :dataItems="expos" :items="items" :footerItems="footerItems" show-average :averageNumberFormatOptions="avgNumberFormat">
            <template #cell-label="{ value }">
                <span v-text="value" class="mr-2" />

                <o-resource :resource="resourceTypes[value]" size="24px" />
            </template>
        </ranged-stats-table>

        <floating-menu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <conversion-rate-settings />
            <hr />
            <show-converted-resources-in-cells-settings />
            <hr />
            <date-range-settings />
        </floating-menu>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import RangedStatsTable, { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
    import { ResourceType, ResourceTypes } from '@/shared/models/ogame/resources/ResourceType';
    import { DailyExpeditionResult, ExpeditionDataModule } from '@/views/stats/data/ExpeditionDataModule';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
    import ConversionRateSettings from '@/views/stats/components/settings/ConversionRateSettings.vue';
    import ShowConvertedResourcesInCellsSettings from '@stats/components/settings/ShowConvertedResourcesInCellsSettings.vue';
import { getMsuOrDsu } from '@/views/stats/models/settings/getMsuOrDsu';

    @Component({
        components: {
            RangedStatsTable,
            DateRangeSettings,
            ConversionRateSettings,
            ShowConvertedResourcesInCellsSettings,
        },
    })
    export default class Table extends Vue {
        private showSettings = false;

        private readonly avgNumberFormat: Intl.NumberFormatOptions = {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        };

        private get expos() {
            return ExpeditionDataModule.dailyResultsArray;
        }

        private get resourceTypes(): Record<string, ResourceType> {
            return {
                [this.$i18n.$t.extension.resources.metal]: ResourceType.metal,
                [this.$i18n.$t.extension.resources.crystal]: ResourceType.crystal,
                [this.$i18n.$t.extension.resources.deuterium]: ResourceType.deuterium,
            };
        }

        private get items(): RangedStatsTableItem<DailyExpeditionResult>[] {
            return ResourceTypes.map(resource => ({
                label: this.$i18n.$t.extension.resources[resource],
                getValue: expos => expos.reduce((acc, expo) => acc + expo.findings.resources[resource], 0),
            }));
        }

        private get footerItems(): RangedStatsTableItem<DailyExpeditionResult>[] {
            const result: RangedStatsTableItem<DailyExpeditionResult>[] = [
                {
                    label: this.$i18n.$t.extension.common.resourceUnits,
                    getValue: expos => expos.reduce(
                        (acc, expo) => acc
                            + expo.findings.resources.metal
                            + expo.findings.resources.crystal
                            + expo.findings.resources.deuterium,
                        0
                    ),
                },
            ];

            if (SettingsDataModule.settings.showCellsWithConvertedResourceUnits) {
                result.push({
                    label: `${this.$i18n.$t.extension.common.resourceUnits} (${SettingsDataModule.settings.conversionRates.mode == 'msu' ? this.$i18n.$t.extension.common.msu : this.$i18n.$t.extension.common.dsu})`,
                    getValue: expos => expos.reduce(
                        (acc, expo) => acc + getMsuOrDsu(expo.findings.resources),
                        0
                    ),
                });
            }

            return result;
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
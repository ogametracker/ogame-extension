<template>
    <div class="table-container">
        <ranged-stats-table :dataItems="combats" :items="items" :footerItems="footerItems" show-average :averageNumberFormatOptions="avgNumberFormat">
            <template #cell-label="{ value }">
                <span v-text="value" class="mr-2" />

                <o-resource :resource="resourceTypes[value]" size="24px" />
            </template>
        </ranged-stats-table>

        <floating-menu v-model="showSettings" left class="floating-settings">
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <conversion-rate-settings />
            <combat-tracking-ignore-espionage-combats-settings />
            <hr class="two-column" />
            <show-converted-resources-in-cells-settings />
            <hr class="two-column" />
            <date-range-settings class="two-column"  />
        </floating-menu>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import RangedStatsTable, { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
    import { ResourceType, ResourceTypes } from '@/shared/models/ogame/resources/ResourceType';
    import { CombatReportDataModule, DailyCombatReportResult } from '@/views/stats/data/CombatReportDataModule';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
    import ConversionRateSettings from '@/views/stats/components/settings/ConversionRateSettings.vue';
    import CombatTrackingIgnoreEspionageCombatsSettings from '@stats/components/settings/CombatTrackingIgnoreEspionageCombatsSettings.vue';
    import ShowConvertedResourcesInCellsSettings from '@stats/components/settings/ShowConvertedResourcesInCellsSettings.vue';
    import { getMsuOrDsu } from '@/views/stats/models/settings/getMsuOrDsu';

    @Component({
        components: {
            RangedStatsTable,
            DateRangeSettings,
            ConversionRateSettings,
            CombatTrackingIgnoreEspionageCombatsSettings,
            ShowConvertedResourcesInCellsSettings,
        },
    })
    export default class Table extends Vue {
        private showSettings = false;

        private readonly avgNumberFormat: Intl.NumberFormatOptions = {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        };

        private get combats() {
            return CombatReportDataModule.dailyResultsArray;
        }

        private get resourceTypes(): Record<string, ResourceType> {
            return {
                [this.$i18n.$t.extension.resources.metal]: ResourceType.metal,
                [this.$i18n.$t.extension.resources.crystal]: ResourceType.crystal,
                [this.$i18n.$t.extension.resources.deuterium]: ResourceType.deuterium,
            };
        }

        private get items(): RangedStatsTableItem<DailyCombatReportResult>[] {
            return ResourceTypes.map(resource => ({
                label: this.$i18n.$t.extension.resources[resource],
                getValue: combats => combats.reduce((acc, combat) => acc + combat.loot[resource], 0),
            }));
        }

        private get footerItems(): RangedStatsTableItem<DailyCombatReportResult>[] {
            const result: RangedStatsTableItem<DailyCombatReportResult>[] = [
                {
                    label: this.$i18n.$t.extension.common.resourceUnits,
                    getValue: combats => combats.reduce(
                        (acc, combat) => acc + combat.loot.metal + combat.loot.crystal + combat.loot.deuterium,
                        0
                    ),
                },
            ];

            if (SettingsDataModule.settings.showCellsWithConvertedResourceUnits) {
                result.push({
                    label: `${this.$i18n.$t.extension.common.resourceUnits} (${SettingsDataModule.settings.conversionRates.mode == 'msu' ? this.$i18n.$t.extension.common.msu : this.$i18n.$t.extension.common.dsu})`,
                    getValue: combats => combats.reduce(
                        (acc, combat) => acc + getMsuOrDsu(combat.loot),
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

    .floating-settings::v-deep .floating-menu {
        display: grid;
        grid-template-columns: auto auto;
        column-gap: 8px;

        .two-column {
            grid-column: 1 / span 2;
        }

        hr {
            width: 100%;
        }
    }
</style>
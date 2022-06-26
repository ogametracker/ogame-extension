<template>
    <div class="table-container">
        <ranged-stats-table
            :dataItems="combats"
            :items="items"
            :footerItems="footerItems"
            show-average
        >
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

            <msu-conversion-rate-settings />
            <hr />
            <combat-tracking-ignore-espionage-combats-settings />
            <hr />
            <date-range-settings />
        </floating-menu>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import RangedStatsTable, { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
    import { ResourceType, ResourceTypes } from '@/shared/models/ogame/resources/ResourceType';
    import { CombatReportDataModule, DailyCombatReportResult } from '@/views/stats/data/CombatReportDataModule';
    import { CombatReport } from '@/shared/models/combat-reports/CombatReport';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
    import MsuConversionRateSettings from '@stats/components/settings/MsuConversionRateSettings.vue';
    import CombatTrackingIgnoreEspionageCombatsSettings from '@stats/components/settings/CombatTrackingIgnoreEspionageCombatsSettings.vue';

    @Component({
        components: {
            RangedStatsTable,
            DateRangeSettings,
            MsuConversionRateSettings,
            CombatTrackingIgnoreEspionageCombatsSettings,
        },
    })
    export default class Table extends Vue {
        private showSettings = false;

        private get msuConversionRates() {
            return SettingsDataModule.settings.msuConversionRates;
        }

        private get combats() {
            return CombatReportDataModule.dailyResultsArray;
        }

        private get resourceTypes(): Record<string, ResourceType> {
            return {    
                [this.$i18n.$t.resources.metal]: ResourceType.metal,
                [this.$i18n.$t.resources.crystal]: ResourceType.crystal,
                [this.$i18n.$t.resources.deuterium]: ResourceType.deuterium,
            };
        }

        private get items(): RangedStatsTableItem<DailyCombatReportResult>[] {
            return ResourceTypes.map(resource => ({
                label: this.$i18n.$t.resources[resource],
                getValue: combats => combats.reduce((acc, combat) => acc + combat.loot[resource], 0) ,
            }));
        }

        private get footerItems(): RangedStatsTableItem<DailyCombatReportResult>[] {
            return [
                {
                    label: this.$i18n.$t.common.resourceUnits,
                    getValue: combats => combats.reduce(
                        (acc, combat) => acc + combat.loot.metal + combat.loot.crystal + combat.loot.deuterium,
                        0
                    ),
                },
                {
                    label: this.$i18n.$t.common.resourceUnitsMsu,
                    getValue: combats => combats.reduce(
                        (acc, combat) => acc
                            + combat.loot.metal
                            + combat.loot.crystal * this.msuConversionRates.crystal
                            + combat.loot.deuterium * this.msuConversionRates.deuterium,
                        0
                    ),
                },
            ];
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
<template>
    <div class="table-container">
        <ranged-stats-table
            :dataItems="expos"
            :filter="(expo) => filterExpo(expo)"
            :items="items"
            :footerItems="footerItems"
            show-average
        >
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

            <msu-conversion-rate-settings />
            <expedition-ship-resource-units-factor-settings />
            <hr class="two-column" />
            <date-range-settings class="two-column" />
        </floating-menu>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import RangedStatsTable, { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
    import { ExpeditionEvent, ExpeditionEventFleet, ExpeditionFindableShipType } from '@/shared/models/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/expeditions/ExpeditionEventType';
    import { ResourceType } from '@/shared/models/ogame/resources/ResourceType';
    import { getNumericEnumValues } from '@/shared/utils/getNumericEnumValues';
    import { ExpeditionDataModule } from '@/views/stats/data/ExpeditionDataModule';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
    import { multiplyCost } from '@/shared/models/ogame/common/Cost';
    import { Ships } from '@/shared/models/ogame/ships/Ships';
    import { ShipType } from '@/shared/models/ogame/ships/ShipType';
    import MsuConversionRateSettings from '@stats/components/settings/MsuConversionRateSettings.vue';
    import ExpeditionShipResourceUnitsFactorSettings from '@stats/components/settings/ExpeditionShipResourceUnitsFactorSettings.vue';

    @Component({
        components: {
            RangedStatsTable,
            DateRangeSettings,
            MsuConversionRateSettings,
            ExpeditionShipResourceUnitsFactorSettings,
        },
    })
    export default class Table extends Vue {
        private showSettings = false;

        private get msuConversionRates() {
            return SettingsDataModule.settings.msuConversionRates;
        }

        private filterExpo(expo: ExpeditionEvent): boolean {
            return expo.type == ExpeditionEventType.fleet;
        }

        private get expos() {
            return ExpeditionDataModule.expeditions;
        }

        private get resourceTypes(): Record<string, ResourceType> {
            return {    
                [this.$i18n.$t.resources.metal]: ResourceType.metal,
                [this.$i18n.$t.resources.crystal]: ResourceType.crystal,
                [this.$i18n.$t.resources.deuterium]: ResourceType.deuterium,
            };
        }

        private get items(): RangedStatsTableItem<ExpeditionEventFleet>[] {
            return Object.values(ResourceType).map(resource => ({
                label: this.$i18n.$t.resources[resource],
                getValue: expos => expos.reduce(
                    (acc, expo) => acc + getNumericEnumValues<ShipType>(ExpeditionFindableShipType).reduce(
                        (acc, ship) => acc + multiplyCost(Ships[ship].getCost(), expo.fleet[ship] ?? 0)[resource]
                    ), 0),
            }));
        }

        private get footerItems(): RangedStatsTableItem<ExpeditionEventFleet>[] {
            return [
                {
                    label: this.$i18n.$t.resources.sum,
                    getValue: expos => expos.reduce(
                        (acc, expo) => acc + getNumericEnumValues<ShipType>(ExpeditionFindableShipType).reduce(
                            (acc, ship) => {
                                const res = multiplyCost(Ships[ship].getCost(), expo.fleet[ship] ?? 0);
                                return acc + res.metal + res.crystal + res.deuterium;
                            }), 0),
                },
                {
                    label: this.$i18n.$t.resources.sumMsu,
                    getValue: expos => expos.reduce(
                        (acc, expo) => acc + getNumericEnumValues<ShipType>(ExpeditionFindableShipType).reduce(
                            (acc, ship) => {
                                const res = multiplyCost(Ships[ship].getCost(), expo.fleet[ship] ?? 0);
                                return acc + res.metal + res.crystal * this.msuConversionRates.crystal + res.deuterium * this.msuConversionRates.deuterium;
                            }), 0),
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
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
                <span v-text="value" />

                <o-resource :resource="value" size="24px" />
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
    import { ExpeditionEvent, ExpeditionEventFleet, ExpeditionFindableShipType } from '@/shared/models/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/expeditions/ExpeditionEventType';
    import { ResourceType } from '@/shared/models/ogame/resources/ResourceType';
    import { getNumericEnumValues } from '@/shared/utils/getNumericEnumValues';
    import { getResources } from './getResources';
    import { ExpeditionDataModule } from '@/views/stats/data/ExpeditionDataModule';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';

    @Component({
        components: {
            RangedStatsTable,
            DateRangeSettings,
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

        private get items(): RangedStatsTableItem<ExpeditionEventFleet>[] {
            return Object.values(ResourceType).map(resource => ({
                label: resource,
                getValue: expos => expos.reduce(
                    (acc, expo) => acc + getNumericEnumValues(ExpeditionFindableShipType).reduce(
                        (acc, ship) => acc + getResources(ship, expo.fleet[ship] ?? 0)[resource]
                    ), 0),
            }));
        }

        private get footerItems(): RangedStatsTableItem<ExpeditionEventFleet>[] {
            return [
                {
                    label: `LOCA: Total`,
                    getValue: expos => expos.reduce(
                        (acc, expo) => acc + getNumericEnumValues(ExpeditionFindableShipType).reduce(
                            (acc, ship) => {
                                const res = getResources(ship, expo.fleet[ship] ?? 0);
                                return acc + res.metal + res.crystal + res.deuterium;
                            }), 0),
                },
                {
                    label: `LOCA: Total (MSU)`,
                    getValue: expos => expos.reduce(
                        (acc, expo) => acc + getNumericEnumValues(ExpeditionFindableShipType).reduce(
                            (acc, ship) => {
                                const res = getResources(ship, expo.fleet[ship] ?? 0);
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
</style>
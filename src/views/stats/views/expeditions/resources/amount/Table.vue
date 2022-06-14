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

        <floating-menu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <msu-conversion-rate-settings />
            <hr />
            <date-range-settings />
        </floating-menu>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import RangedStatsTable, { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
    import { ExpeditionEvent, ExpeditionEventResources } from '@/shared/models/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/expeditions/ExpeditionEventType';
    import { ResourceType } from '@/shared/models/ogame/resources/ResourceType';
    import { ExpeditionDataModule } from '@/views/stats/data/ExpeditionDataModule';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
    import MsuConversionRateSettings from '@stats/components/settings/MsuConversionRateSettings.vue';

    @Component({
        components: {
            RangedStatsTable,
            DateRangeSettings,
            MsuConversionRateSettings,
        },
    })
    export default class Table extends Vue {
        private showSettings = false;

        private get msuConversionRates() {
            return SettingsDataModule.settings.msuConversionRates;
        }

        private filterExpo(expo: ExpeditionEvent): boolean {
            return expo.type == ExpeditionEventType.resources;
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

        private get items(): RangedStatsTableItem<ExpeditionEventResources>[] {
            return Object.values(ResourceType).map(resource => ({
                label: this.$i18n.$t.resources[resource],
                getValue: expos => expos.reduce((acc, expo) => acc + expo.resources[resource], 0),
            }));
        }

        private get footerItems(): RangedStatsTableItem<ExpeditionEventResources>[] {
            return [
                {
                    label: this.$i18n.$t.resources.sum,
                    getValue: expos => expos.reduce(
                        (acc, expo) => acc + expo.resources.metal + expo.resources.crystal + expo.resources.deuterium,
                        0
                    ),
                },
                {
                    label: this.$i18n.$t.resources.sumMsu,
                    getValue: expos => expos.reduce(
                        (acc, expo) => acc
                            + expo.resources.metal
                            + expo.resources.crystal * this.msuConversionRates.crystal
                            + expo.resources.deuterium * this.msuConversionRates.deuterium,
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
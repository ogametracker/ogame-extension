<template>
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
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import RangedStatsTable, { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
    import { ExpeditionEvent, ExpeditionEventResources } from '@/shared/models/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/expeditions/ExpeditionEventType';
    import { ResourceType } from '@/shared/models/ogame/resources/ResourceType';
    import { ExpeditionDataModule } from '@/views/stats/data/ExpeditionDataModule';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';

    @Component({
        components: {
            RangedStatsTable,
        },
    })
    export default class Table extends Vue {
        private get msuConversionRates() {
            return SettingsDataModule.settings.msuConversionRates;
        }

        private filterExpo(expo: ExpeditionEvent): boolean {
            return expo.type == ExpeditionEventType.resources;
        }

        private get expos() {
            return ExpeditionDataModule.expeditions;
        }

        private get items(): RangedStatsTableItem<ExpeditionEventResources>[] {
            return Object.values(ResourceType).map(resource => ({
                label: resource,
                getValue: expos => expos.reduce((acc, expo) => acc + expo.resources[resource], 0),
            }));
        }

        private get footerItems(): RangedStatsTableItem<ExpeditionEventResources>[] {
            return [
                {
                    label: `LOCA: Total`,
                    getValue: expos => expos.reduce(
                        (acc, expo) => acc + expo.resources.metal + expo.resources.crystal + expo.resources.deuterium,
                        0
                    ),
                },
                {
                    label: `LOCA: Total (MSU)`,
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
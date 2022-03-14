<template>
    <ranged-stats-table
        :dataItems="combats"
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
    import { ResourceType } from '@/shared/models/ogame/resources/ResourceType';
    import { CombatReportDataModule } from '@/views/stats/data/CombatReportDataModule';
    import { CombatReport } from '@/shared/models/combat-reports/CombatReport';
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

        private get combats() {
            return CombatReportDataModule.reports;
        }

        private get items(): RangedStatsTableItem<CombatReport>[] {
            return Object.values(ResourceType).map(resource => ({
                label: resource,
                getValue: expos => expos.reduce((acc, expo) => acc + expo.loot[resource], 0),
            }));
        }

        private get footerItems(): RangedStatsTableItem<CombatReport>[] {
            return [
                {
                    label: `LOCA: Total`,
                    getValue: expos => expos.reduce(
                        (acc, expo) => acc + expo.loot.metal + expo.loot.crystal + expo.loot.deuterium,
                        0
                    ),
                },
                {
                    label: `LOCA: Total (MSU)`,
                    getValue: expos => expos.reduce(
                        (acc, expo) => acc 
                            + expo.loot.metal 
                            + expo.loot.crystal * this.msuConversionRates.crystal 
                            + expo.loot.deuterium * this.msuConversionRates.deuterium,
                        0
                    ),
                },
            ];
        }
    }
</script>
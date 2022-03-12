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
    import { ResourceType } from '@/shared/models/v1/ogame/resources/ResourceType';
    import { CombatReportDataModule } from '@/views/stats/data/CombatReportDataModule';
    import { CombatReport } from '@/shared/models/v1/combat-reports/CombatReport';

    @Component({
        components: {
            RangedStatsTable,
        },
    })
    export default class Table extends Vue {
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
                        (acc, expo) => acc + expo.loot.metal + expo.loot.crystal * 2 + expo.loot.deuterium * 3, //TODO: MSU from settings
                        0
                    ),
                },
            ];
        }
    }
</script>
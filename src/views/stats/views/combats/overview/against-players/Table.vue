<template>
    <ranged-stats-table
        :dataItems="combats"
        :filter="(combat) => filterCombat(combat)"
        :items="items"
        :footerItems="footerItems"
        show-average
    />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import RangedStatsTable, { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
    import { CombatReportDataModule } from '@/views/stats/data/CombatReportDataModule';
    import { CombatReport } from '@/shared/models/v1/combat-reports/CombatReport';
    import { CombatResultType } from '@/shared/models/v1/combat-reports/CombatResultType';

    @Component({
        components: {
            RangedStatsTable,
        },
    })
    export default class Table extends Vue {
        private get combats() {
            return CombatReportDataModule.reports;
        }

        private filterCombat(combat: CombatReport): boolean {
            return !combat.isExpedition;
        }

        private get items(): RangedStatsTableItem<CombatReport>[] {
            return Object.values(CombatResultType).map(result => ({
                label: `LOCA: ${result}`,
                getValue: combats => combats.filter(combat => combat.result == result).length,
            }));
        }

        private get footerItems(): RangedStatsTableItem<CombatReport>[] {
            return [
                {
                    label: `LOCA: Total`,
                    getValue: combats => combats.length,
                },
            ];
        }
    }
</script>
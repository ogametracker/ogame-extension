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
    import { ShipType } from '@/shared/models/v1/ogame/ships/ShipType';
    import { getNumericEnumValues } from '@/shared/utils/getNumericEnumValues';

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
            return getNumericEnumValues<ShipType>(ShipType).map(ship => ({
                label: `LOCA: ${ship}`,
                getValue: combats => combats.reduce((acc, combat) => acc + combat.lostShips[ship], 0),
            }));
        }

        private get footerItems(): RangedStatsTableItem<CombatReport>[] {
            return [
                {
                    label: `LOCA: Total`,
                    getValue: combats => combats.reduce(
                        (acc, combat) => acc + Object.values(combat.lostShips).reduce((acc, cur) => acc + cur, 0),
                        0
                    ),
                },
            ];
        }
    }
</script>
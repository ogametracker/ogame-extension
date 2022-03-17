<template>
    <div class="table-container">
        <ranged-stats-table
            :dataItems="combats"
            :filter="(combat) => filterCombat(combat)"
            :items="items"
            :footerItems="footerItems"
            show-average
        />

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
    import { CombatReportDataModule } from '@/views/stats/data/CombatReportDataModule';
    import { CombatReport } from '@/shared/models/combat-reports/CombatReport';
    import { CombatResultType } from '@/shared/models/combat-reports/CombatResultType';
    import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';

    @Component({
        components: {
            RangedStatsTable,
            DateRangeSettings,
        },
    })
    export default class Table extends Vue {
        private showSettings = false;

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
<style lang="scss" scoped>
    .table-container {
        display: grid;
        column-gap: 4px;
        grid-template-columns: 1fr auto;
        align-items: start;
        height: 100%;
    }
</style>
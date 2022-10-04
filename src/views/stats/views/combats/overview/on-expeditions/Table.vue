<template>
    <div class="table-container">
        <ranged-stats-table
            :dataItems="combats"
            :items="items"
            :footerItems="footerItems"
            show-average
            :averageNumberFormatOptions="avgNumberFormat"
        />

        <floating-menu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <combat-tracking-ignore-espionage-combats-settings />
            <hr />
            <date-range-settings />
        </floating-menu>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import RangedStatsTable, { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
    import { CombatReportDataModule, DailyCombatReportResult } from '@/views/stats/data/CombatReportDataModule';
    import { CombatResultTypes } from '@/shared/models/combat-reports/CombatResultType';
    import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
    import CombatTrackingIgnoreEspionageCombatsSettings from '@stats/components/settings/CombatTrackingIgnoreEspionageCombatsSettings.vue';

    @Component({
        components: {
            RangedStatsTable,
            DateRangeSettings,
            CombatTrackingIgnoreEspionageCombatsSettings,
        },
    })
    export default class Table extends Vue {
        private showSettings = false;
        
        private readonly avgNumberFormat: Intl.NumberFormatOptions = {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        };

        private get combats() {
            return CombatReportDataModule.dailyResultsArray;
        }

        private get items(): RangedStatsTableItem<DailyCombatReportResult>[] {
            return CombatResultTypes.map(result => ({
                label: this.$i18n.$t.extension.combats.combatResults[result],
                getValue: combats => combats.reduce((acc, cur) => acc + cur.results.onExpeditions[result], 0),
            }));
        }

        private get footerItems(): RangedStatsTableItem<DailyCombatReportResult>[] {
            return [
                {
                    label: this.$i18n.$t.extension.common.resourceUnits,
                    getValue: combats => CombatResultTypes.reduce((acc, result) => acc + combats.reduce((acc, cur) => acc + cur.results.onExpeditions[result], 0), 0),
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
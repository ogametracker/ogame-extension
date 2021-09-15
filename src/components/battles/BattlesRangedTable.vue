<template>
    <table class="expo-ranged-table">
        <thead>
            <tr>
                <th :style="cellWidthStyle"></th>

                <th
                    :style="cellWidthStyle"
                    v-for="(rangeLabel, index) in tableData.rangeLabels"
                    :key="index"
                >
                    {{ rangeLabel }}
                </th>

                <th :style="cellWidthStyle" v-if="!noPercentage">%</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, itemIndex) in tableData.items" :key="itemIndex">
                <td>
                    {{ item.label }}
                </td>

                <td v-for="(range, rangeIndex) in ranges" :key="rangeIndex">
                    <slot
                        name="value"
                        :value="item.rangeValues[rangeIndex]"
                        v-if="$scopedSlots.value"
                    />

                    <span v-else>
                        {{ $extension.$n(item.rangeValues[rangeIndex]) }}
                    </span>
                </td>

                <td v-if="!noPercentage">
                    {{ $extension.$n(100 * item.percentage) }}
                </td>
            </tr>
            <tr v-if="showTotal" class="total-row">
                <td>
                    {{ $extension.$t.total }}
                </td>

                <td v-for="(range, rangeIndex) in ranges" :key="rangeIndex">
                    {{ $extension.$n(tableData.rangeTotals[rangeIndex]) }}
                </td>

                <td v-if="!noPercentage"></td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
    import BattleReport from '@/models/battles/BattleReport';
    import DateRange from '@/models/settings/DateRange';
    import BattleModule from '@/store/modules/BattleModule';
    import SettingsModule from '@/store/modules/SettingsModule';
    import daysInRange from '@/utils/daysInRange';
    import { PropType } from 'vue';
    import { Component, Prop, Vue } from 'vue-property-decorator';

    export interface BattlesRangedTableItem {
        label: string;
        getValue: (reports: BattleReport[]) => any;
    }

    @Component({})
    export default class BattlesRangedTable extends Vue {
        @Prop({ required: true, type: Array as PropType<BattlesRangedTableItem[]>, default: () => [] })
        private items!: BattlesRangedTableItem[];

        @Prop({ required: false, type: Boolean, default: false })
        private showTotal!: boolean;

        @Prop({ required: false, type: Boolean, default: false })
        private noPercentage!: boolean;

        private get ranges() {
            return SettingsModule.settings.tables.ranges;
        }

        private get cellWidthStyle() {
            const add = this.noPercentage ? 1 : 2;
            return `width: ${100 / (add + this.ranges.length)}%`;
        }

        private get tableData() {
            const ranges = this.ranges;

            const firstReportDate = new Date(this.firstReportDate);
            const reportsByDay = BattleModule.byDay;

            const rangeInfos = ranges.map(range => this.getRangeInfo(range, reportsByDay, firstReportDate));
            const totalRange = this.getRangeInfo({ type: 'all' }, reportsByDay, firstReportDate);

            return {
                rangeLabels: rangeInfos.map(ri => ri.label),
                rangeTotals: rangeInfos.map(ri => ri.total),
                items: this.items.map((item, i) => ({
                    label: item.label,
                    rangeValues: rangeInfos.map(ri => ri.itemValues[i]),
                    percentage: totalRange.itemValues[i] / Math.max(1, totalRange.total),
                }))
            };
        }

        private getRangeInfo(range: DateRange, reportsByDay: { [key: number]: BattleReport[] | undefined }, firstReportDate: Date) {
            const rangeDays = daysInRange(range) ?? Object.keys(reportsByDay).map(d => new Date(parseInt(d)));
            const reportsInRange = rangeDays.flatMap(day => reportsByDay[day.getTime()] ?? []);

            const label = range.label ?? `${this.$extension.$t.since} ${this.$extension.$d(firstReportDate, "short")}`;
            const itemValues = this.items.map(item => item.getValue(reportsInRange));
            const total = itemValues.reduce((total, cur) => total + cur, 0);

            return {
                label,
                itemValues,
                total,
            };
        }

        private get firstReportDate(): number {
            return BattleModule.firstReport?.date ?? Date.now();
        }
    }
</script>
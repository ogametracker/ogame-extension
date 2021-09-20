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

                    <span
                        v-else
                        :class="{
                            faded:
                                fadeZeros && item.rangeValues[rangeIndex] == 0
                        }"
                    >
                        {{ $i18n.$n(item.rangeValues[rangeIndex]) }}
                    </span>
                </td>

                <td v-if="!noPercentage">
                    {{ $i18n.$n(100 * item.percentage) }}
                </td>
            </tr>
            <tr v-if="showTotal" class="total-row">
                <td>
                    {{ $i18n.$t.total }}
                </td>

                <td v-for="(range, rangeIndex) in ranges" :key="rangeIndex">
                    {{ $i18n.$n(tableData.rangeTotals[rangeIndex]) }}
                </td>

                <td v-if="!noPercentage"></td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
    import DateRange from '@/models/settings/DateRange';
    import DebrisFieldReport from '@/models/debrisFields/DebrisFieldReport';
    import SettingsModule from '@/store/modules/SettingsModule';
    import DebrisFieldModule from '@/store/modules/DebrisFieldModule';
    import daysInRange from '@/utils/daysInRange';
    import { PropType } from 'vue';
    import { Component, Prop, Vue } from 'vue-property-decorator';

    export interface DebrisFieldRangeTableItem {
        label: string;
        getValue: (expos: DebrisFieldReport[]) => any;
    }

    @Component({})
    export default class DebrisFieldRangeTable extends Vue {
        @Prop({ required: true, type: Array as PropType<DebrisFieldRangeTableItem[]>, default: () => [] })
        private items!: DebrisFieldRangeTableItem[];

        @Prop({ required: false, type: Boolean, default: false })
        private showTotal!: boolean;

        @Prop({ required: false, type: Boolean, default: false })
        private noPercentage!: boolean;

        @Prop({ required: false, type: Boolean, default: false })
        private fadeZeros!: boolean;

        private get ranges() {
            return SettingsModule.settings.tables.ranges;
        }

        private get cellWidthStyle() {
            const add = this.noPercentage ? 1 : 2;
            return `width: ${100 / (add + this.ranges.length)}%`;
        }

        private get tableData() {
            const ranges = this.ranges;

            const firstReportDate = new Date(this.firstExpoDate);
            const reportsByDay = DebrisFieldModule.byDay;

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

        private getRangeInfo(range: DateRange, exposByDay: { [key: number]: DebrisFieldReport[] | undefined }, firstExpoDate: Date) {
            const rangeDays = daysInRange(range) ?? Object.keys(exposByDay).map(d => new Date(parseInt(d)));
            const exposInRange = rangeDays.flatMap(day => exposByDay[day.getTime()] ?? []);

            const label = range.label ?? `${this.$i18n.$t.since} ${this.$i18n.$d(firstExpoDate, "short")}`;
            const itemValues = this.items.map(item => item.getValue(exposInRange));
            const total = itemValues.reduce((total, cur) => total + cur, 0);

            return {
                label,
                itemValues,
                total,
            };
        }

        private get firstExpoDate(): number {
            return DebrisFieldModule.firstReport?.date ?? Date.now();
        }
    }
</script>
<style lang="scss" scoped>
    .faded {
        opacity: 0.1;
    }
</style>
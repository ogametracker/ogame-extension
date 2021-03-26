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
                        {{ $i18n.formatNumber(item.rangeValues[rangeIndex]) }}
                    </span>
                </td>

                <td v-if="!noPercentage">
                    {{ $i18n.formatNumber(100 * item.percentage) }}
                </td>
            </tr>
            <tr v-if="showTotal" class="total-row">
                <td>
                    {{ $i18n.messages.extension.total }}
                </td>

                <td v-for="(range, rangeIndex) in ranges" :key="rangeIndex">
                    {{  $i18n.formatNumber(tableData.rangeTotals[rangeIndex]) }}
                </td>

                <td v-if="!noPercentage"></td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
    import i18n from '@/i18n';
import ExpoEvent from '@/models/expeditions/ExpoEvent';
    import DateRange from '@/models/settings/DateRange';
    import ExpoModule from '@/store/modules/ExpoModule';
    import SettingsModule from '@/store/modules/SettingsModule';
    import daysInRange from '@/utils/daysInRange';
    import { PropType } from 'vue';
    import { Component, Prop, Vue } from 'vue-property-decorator';

    export interface ExpoRangeTableItem {
        label: string;
        getValue: (expos: ExpoEvent[]) => any;
    }

    @Component({})
    export default class ExpoRangedTable extends Vue {
        @Prop({ required: true, type: Array as PropType<ExpoRangeTableItem[]>, default: () => [] })
        private items!: ExpoRangeTableItem[];

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

            const firstExpoDate = new Date(this.firstExpoDate);
            const exposByDay = ExpoModule.byDay;

            const rangeInfos = ranges.map(range => this.getRangeInfo(range, exposByDay, firstExpoDate));
            const totalRange = this.getRangeInfo({ type: 'all' }, exposByDay, firstExpoDate);

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

        private getRangeInfo(range: DateRange, exposByDay: { [key: number]: ExpoEvent[] | undefined }, firstExpoDate: Date) {
            const rangeDays = daysInRange(range) ?? Object.keys(exposByDay).map(d => new Date(parseInt(d)));
            const exposInRange = rangeDays.flatMap(day => exposByDay[day.getTime()] ?? []);

            const label = range.label ?? `${i18n.messages.extension.since} ${i18n.formatDate(firstExpoDate, "short")}`;
            const itemValues = this.items.map(item => item.getValue(exposInRange));
            const total = itemValues.reduce((total, cur) => total + cur, 0);

            return {
                label,
                itemValues,
                total,
            };
        }

        private get firstExpoDate(): number {
            return ExpoModule.firstExpo?.date ?? Date.now();
        }
    }
</script>
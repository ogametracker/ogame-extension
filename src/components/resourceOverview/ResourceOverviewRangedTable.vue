<template>
    <table class="resource-overview-ranged-table">
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
                    {{ $i18n.formatNumber(tableData.rangeTotals[rangeIndex]) }}
                </td>

                <td v-if="!noPercentage"></td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
    import i18n from '@/i18n';
    import BattleReport from '@/models/battles/BattleReport';
    import DebrisFieldReport from '@/models/debrisFields/DebrisFieldReport';
    import ExpoEvent from '@/models/expeditions/ExpoEvent';
    import DateRange from '@/models/settings/DateRange';
    import BattleModule from '@/store/modules/BattleModule';
    import DebrisFieldModule from '@/store/modules/DebrisFieldModule';
    import ExpoModule from '@/store/modules/ExpoModule';
    import SettingsModule from '@/store/modules/SettingsModule';
    import daysInRange from '@/utils/daysInRange';
    import { PropType } from 'vue';
    import { Component, Prop, Vue } from 'vue-property-decorator';

    export interface ResourceOverviewRangedTableItem {
        label: string;
        getValue: (expos: ExpoEvent[], battles: BattleReport[], debrisFields: DebrisFieldReport[]) => any;
    }

    @Component({})
    export default class ResourceOverviewRangedTable extends Vue {
        @Prop({ required: true, type: Array as PropType<ResourceOverviewRangedTableItem[]>, default: () => [] })
        private items!: ResourceOverviewRangedTableItem[];

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

            const firstExpoDate = new Date(ExpoModule.firstExpo?.date ?? Date.now());
            const firstBattleDate = new Date(BattleModule.firstReport?.date ?? Date.now());
            const firstDebrisDate = new Date(DebrisFieldModule.firstReport?.date ?? Date.now());
            const firstDate = new Date(Math.min(firstExpoDate.getTime(), firstBattleDate.getTime(), firstDebrisDate.getTime()));

            const exposByDay = ExpoModule.byDay;
            const battlesByDay = BattleModule.byDay;
            const debrisByDay = DebrisFieldModule.byDay;

            const rangeInfos = ranges.map(range => this.getRangeInfo(range, exposByDay, battlesByDay, debrisByDay, firstDate));
            const totalRange = this.getRangeInfo({ type: 'all' }, exposByDay, battlesByDay, debrisByDay, firstDate);

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

        private getRangeInfo(
            range: DateRange,
            exposByDay: { [key: number]: ExpoEvent[] | undefined },
            battlesByDay: { [key: number]: BattleReport[] | undefined },
            debrisByDay: { [key: number]: DebrisFieldReport[] | undefined },
            firstDate: Date
        ) {
            let rangeDays = daysInRange(range);
            if(rangeDays == null) {
                const expoDays = Object.keys(exposByDay).map(d => parseInt(d));
                const battleDays = Object.keys(battlesByDay).map(d => parseInt(d));
                const debrisDays = Object.keys(debrisByDay).map(d => parseInt(d));

                const distinctDays = new Set([...expoDays, ...battleDays, ...debrisDays]);
                rangeDays = [...distinctDays].map(d => new Date(d));
            }
            const exposInRange = rangeDays.flatMap(day => exposByDay[day.getTime()] ?? []);
            const battlesInRange = rangeDays.flatMap(day => battlesByDay[day.getTime()] ?? []);
            const debrisInRange = rangeDays.flatMap(day => debrisByDay[day.getTime()] ?? []);

            const label = range.label ?? `${i18n.messages.extension.since} ${i18n.formatDate(firstDate, "short")}`;
            const itemValues = this.items.map(item => item.getValue(exposInRange, battlesInRange, debrisInRange));
            const total = itemValues.reduce((total, cur) => total + cur, 0);

            return {
                label,
                itemValues,
                total,
            };
        }
    }
</script>
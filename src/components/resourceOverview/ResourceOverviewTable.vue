<template>
    <div>
        <checkbox-button v-model="detailed" auto-color simple no-margin>
            {{ $i18n.$t.resourceBalance.detailedView }}
        </checkbox-button>

        <table class="resource-overview-ranged-table" style="margin-top: 4px">
            <thead>
                <tr>
                    <th :style="cellWidthStyle" />
                    <th v-if="detailed" :style="cellWidthStyle" />

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
                <tr
                    v-for="(item, itemIndex) in tableData.items"
                    :key="itemIndex"
                >
                    <td v-text="item.label" />

                    <td v-if="detailed">
                        <div
                            v-for="key in keys"
                            :key="key"
                            v-text="getKeyText(key)"
                            style="white-space: pre;"
                        />
                    </td>

                    <td v-for="(range, rangeIndex) in ranges" :key="rangeIndex">
                        <template v-if="detailed">
                            <div
                                v-for="key in keys"
                                :key="key"
                                :class="{
                                    faded:
                                        fadeZeros &&
                                        item.rangeValues[rangeIndex][key] == 0
                                }"
                                v-text="
                                    $i18n.$n(item.rangeValues[rangeIndex][key])
                                "
                            />
                        </template>
                        <span
                            v-else
                            :class="{
                                faded:
                                    fadeZeros &&
                                    item.rangeValues[rangeIndex].total == 0
                            }"
                            v-text="$i18n.$n(item.rangeValues[rangeIndex].total)"
                        />
                    </td>

                    <td v-if="!noPercentage">
                        {{ $i18n.$n(100 * item.percentage) }}
                    </td>
                </tr>
                <tr v-if="showTotal" class="total-row">
                    <td v-text="$i18n.$t.total" />
                    <td v-if="detailed" />

                    <td v-for="(range, rangeIndex) in ranges" :key="rangeIndex">
                        {{ $i18n.$n(tableData.rangeTotals[rangeIndex]) }}
                    </td>

                    <td v-if="!noPercentage" />
                </tr>
            </tbody>
        </table>
    </div>
</template>
 
<script lang="ts">
    import ExpoType from "@/models/expeditions/ExpoType";
    import { Component, Vue } from "vue-property-decorator";

    import ResourceOverviewRangedTable, { ResourceOverviewRangedTableItem } from "./ResourceOverviewRangedTable.vue";
    import ExpoEvent, { ExpoEventResources } from "@/models/expeditions/ExpoEvent";
    import Resource from "@/models/Resource";
    import SettingsModule from "@/store/modules/SettingsModule";
    import ExpoModule from "@/store/modules/ExpoModule";
    import BattleModule from "@/store/modules/BattleModule";
    import DebrisFieldModule from "@/store/modules/DebrisFieldModule";
    import DateRange from "@/models/settings/DateRange";
    import BattleReport from "@/models/battles/BattleReport";
    import DebrisFieldReport from "@/models/debrisFields/DebrisFieldReport";
    import daysInRange from "@/utils/daysInRange";

    interface TableItemDefinition {
        label: string;
        getValue: (expos: ExpoEvent[], battles: BattleReport[], debrisFields: DebrisFieldReport[]) => TableItemData;
    }

    interface TableItemData {
        expeditions: number;
        combats: number;
        debrisFields: number;
        total: number;
    }

    @Component({
        components: {
            ResourceOverviewRangedTable,
        },
    })
    export default class ResourceOverviewTable extends Vue {
        private readonly showTotal = true;
        private readonly noPercentage = true;
        private readonly fadeZeros = true;

        private detailed = false;

        private readonly keys: (keyof TableItemData)[] = ['expeditions', 'combats', 'debrisFields'];

        private getKeyText(key: keyof TableItemData) {
            switch (key) {
                case 'expeditions': return this.$i18n.$t.resourceBalance.expeditions;
                case 'combats': return this.$i18n.$t.resourceBalance.combats;
                case 'debrisFields': return this.$i18n.$t.resourceBalance.debrisFields;
            }
            throw new Error('invalid key');
        }

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
                    percentage: totalRange.itemValues[i].total / Math.max(1, totalRange.total),
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
            if (rangeDays == null) {
                const expoDays = Object.keys(exposByDay).map(d => parseInt(d));
                const battleDays = Object.keys(battlesByDay).map(d => parseInt(d));
                const debrisDays = Object.keys(debrisByDay).map(d => parseInt(d));

                const distinctDays = new Set([...expoDays, ...battleDays, ...debrisDays]);
                rangeDays = [...distinctDays].map(d => new Date(d));
            }
            const exposInRange = rangeDays.flatMap(day => exposByDay[day.getTime()] ?? []);
            const battlesInRange = rangeDays.flatMap(day => battlesByDay[day.getTime()] ?? []);
            const debrisInRange = rangeDays.flatMap(day => debrisByDay[day.getTime()] ?? []);

            const label = range.label ?? `${this.$i18n.$t.since} ${this.$i18n.$d(firstDate, "date")}`;
            const itemValues = this.items.map(item => item.getValue(exposInRange, battlesInRange, debrisInRange));
            const total = itemValues.reduce((total, cur) => total + cur.total, 0);

            return {
                label,
                itemValues,
                total,
            };
        }

        private get items(): TableItemDefinition[] {
            return Object.keys(Resource).map(resourceName => {
                const resource = resourceName as Resource;
                return {
                    label: this.$i18n.$t.resources[resource],
                    getValue: (expos, battles, debris) => {
                        const expoRess = (expos.filter(expo => expo.type == ExpoType.resources) as ExpoEventResources[])
                            .reduce((acc, cur) => acc + cur.resources[resource], 0);

                        const battleRess = battles.reduce((acc, cur) => acc + cur.loot[resource], 0);
                        const debrisRess = debris.reduce((acc, cur) => acc + (resource == Resource.deuterium ? 0 : resource == Resource.metal ? cur.metal : cur.crystal), 0);

                        return {
                            expeditions: expoRess,
                            combats: battleRess,
                            debrisFields: debrisRess,
                            total: expoRess + battleRess + debrisRess,
                        };
                    }
                };
            });
        }
    }
</script>
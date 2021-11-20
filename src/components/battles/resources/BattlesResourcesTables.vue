<template>
    <div>
        <battles-ranged-table
            :items="itemsByResource"
            no-percentage
            show-total
            fade-zeros
        />

        <br />

        <h2 v-text="$i18n.$t.combats.perGalaxy" />
        <select v-model="rangeIndex" @change="setRange()">
            <option 
                v-for="(range, i) in ranges"
                :key="i"
                :value="i"
                v-text="getLabel(range)"
            />
        </select>
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th v-for="galaxy in galaxies" :key="galaxy">
                        {{ $i18n.$t.combats.galaxy }} {{ galaxy }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="resource in resources" :key="resource">
                    <th v-text="$i18n.$t.resources[resource]" />
                    <th
                        v-for="galaxy in galaxies"
                        :key="galaxy"
                        v-text="
                            $i18n.$n(itemsByGalaxy[resource][galaxy])
                        "
                        :class="{ faded: itemsByGalaxy[resource][galaxy] == 0 }"
                    />
                </tr>
                <tr class="total-row">
                    <td v-text="$i18n.$t.total" />
                    <th
                        v-for="galaxy in galaxies"
                        :key="galaxy"
                        v-text="
                            $i18n.$n(getTotal(galaxy))
                        "
                    />
                </tr>
            </tbody>
        </table>
    </div>
</template>
 
<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import Resource from "@/models/Resource";
    import BattlesRangedTable, { BattlesRangedTableItem } from '@/components/battles/BattlesRangedTable.vue';
    import DateRange from "@/models/settings/DateRange";
    import BattleModule from "@/store/modules/BattleModule";
    import isInRange from "@/utils/isInRange";
    import ServerDataModule from "@/store/modules/ServerDataModule";
    import SettingsModule from "@/store/modules/SettingsModule";

    type AmountByGalaxy = Record<number, number>;

    @Component({
        components: {
            BattlesRangedTable,
        },
    })
    export default class BattlesResourcesTables extends Vue {
        private rangeIndex = 0;
        private selectedRange: DateRange = null!;

        private created() {
            this.selectedRange = this.ranges[0];
        }

        private setRange() {
            this.selectedRange = this.ranges[this.rangeIndex];
        }

        private getTotal(galaxy: number) {
            const items = this.itemsByGalaxy;
            return this.resources.reduce((acc, cur) => acc + items[cur][galaxy], 0);
        }

        private get itemsByResource(): BattlesRangedTableItem[] {
            return this.resources.map(resource => {
                return {
                    label: this.$i18n.$t.resources[resource],
                    getValue: (reports) => reports.reduce((acc, cur) => acc + cur.loot[resource], 0),
                };
            });
        }

        private get ranges() {
            return SettingsModule.settings.tables.ranges;
        }

        private getLabel(range: DateRange) {
            return range.label ?? `${this.$i18n.$t.since} ${this.$i18n.$d(this.firstReportDate, "date")}`;
        }

        private get firstReportDate(): number {
            return BattleModule.firstReport?.date ?? Date.now();
        }

        private get galaxyCount() {
            return ServerDataModule.serverData.galaxies;
        }

        private get galaxies() {
            return Array.from({ length: this.galaxyCount })
                .map((_, i) => i + 1);
        }

        private readonly resources: Resource[] = [Resource.metal, Resource.crystal, Resource.deuterium];

        private get itemsByGalaxy() {
            const seed = {} as Record<Resource, AmountByGalaxy>;
            this.resources.forEach(resource => {
                seed[resource] = {};

                this.galaxies.forEach(galaxy => seed[resource][galaxy] = 0);
            });

            const reports = BattleModule.reports.filter(report => isInRange(report.date, this.selectedRange));
            const reportsByGalaxy = reports.reduce((acc, report) => {
                const galaxy = report.coordinates.galaxy;
                this.resources.forEach(resource => {
                    acc[resource][galaxy] ??= 0;
                    acc[resource][galaxy] += report.loot[resource];
                });
                return acc;
            }, seed);

            return reportsByGalaxy;
        }
    }
</script>
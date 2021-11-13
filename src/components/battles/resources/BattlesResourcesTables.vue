<template>
    <div>
        <battles-ranged-table
            :items="itemsByResource"
            no-percentage
            show-total
            fade-zeros
        />

        <h2>LOCA: Nach Galaxie</h2>
        TODO: Radiobuttons für Date Ranges
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th v-for="galaxy in galaxies" :key="galaxy">
                        LOCA: Galaxie {{ galaxy }}
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
                            $i18n.$n(getItemsByGalaxy(range)[resource][galaxy])
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
    import SettingsModule from "@/store/modules/SettingsModule";

    type AmountByGalaxy = Record<number, number>;

    @Component({
        components: {
            BattlesRangedTable,
        },
    })
    export default class BattlesResourcesTables extends Vue {
        private get itemsByResource(): BattlesRangedTableItem[] {
            return this.resources.map(resource => {
                return {
                    label: this.$i18n.$t.resources[resource],
                    getValue: (reports) => reports.reduce((acc, cur) => acc + cur.loot[resource], 0),
                };
            });
        }

        private get range(): DateRange {
            return { type: 'all' };
            //return SettingsModule.settings.tables.ranges[0];
        }

        private galaxyCount = 0;

        private get galaxies() {
            return Array.from({ length: this.galaxyCount })
                .map((_, i) => i + 1);
        }

        private async mounted() {
            const response = await fetch('/api/serverData.xml');
            const xml = await response.text();
            const galaxyCountMatch = xml.match(/<galaxies>(?<count>\d+)<\/galaxies>/);
            if (galaxyCountMatch == null) {
                throw new Error('failed to get galaxy count');
            }

            this.galaxyCount = parseInt(galaxyCountMatch.groups!.count, 10);
        }

        private readonly resources: Resource[] = [Resource.metal, Resource.crystal, Resource.deuterium];

        private getItemsByGalaxy(range: DateRange) {
            const seed = {} as Record<Resource, AmountByGalaxy>;
            this.resources.forEach(resource => {
                seed[resource] = {};

                this.galaxies.forEach(galaxy => seed[resource][galaxy] = 0);
            });

            const reports = BattleModule.reports.filter(report => isInRange(report.date, range));
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
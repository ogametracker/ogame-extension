<template>
    <div>
        <expo-ranged-table :items="items" />

        <h5>{{ $t("expos.fleet") }}</h5>
        <expo-size-distribution-table :type="expoType" />
    </div>
</template>
 
<script lang="ts">
    import ExpoType from "@/models/expeditions/ExpoType";
    import { Component, Vue } from "vue-property-decorator";
    import Ship from "@/models/Ship";
    import ExpoSizeDistributionTable from '../ExpoSizeDistributionTable.vue';
    import ExpoRangedTable, { ExpoRangeTableItem } from '@/components/expeditions/ExpoRangedTable.vue';

    @Component({
        components: {
            ExpoSizeDistributionTable,
            ExpoRangedTable,
        },
    })
    export default class ExpeditionOverviewTables extends Vue {
        private readonly expoType = ExpoType.fleet;

        private readonly findableShips = [
            Ship.lightFighter,
            Ship.heavyFighter,
            Ship.cruiser,
            Ship.battleship,
            Ship.bomber,
            Ship.battlecruiser,
            Ship.destroyer,
            Ship.reaper,
            Ship.pathfinder,
            Ship.smallCargo,
            Ship.largeCargo,
            Ship.espionageProbe,
        ];

        private get items(): ExpoRangeTableItem[] {
            return this.findableShips.map(ship => ({
                label: this.$t(`ships['${ship}']`) as string,
                getValue: (expos) => expos.filter(
                    expo => expo.type == ExpoType.fleet
                ).reduce((acc, cur) => acc + (cur.fleet?.[ship as Ship] ?? 0), 0)
            }));
        }
    }
</script>
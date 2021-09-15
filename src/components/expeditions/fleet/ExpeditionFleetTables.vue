<template>
    <div>
        <expo-ranged-table :items="items" show-total />

        <h2>{{ $i18n.$t.eventSizes }}</h2>
        <expo-size-distribution-table :type="expoType" />
    </div>
</template>
 
<script lang="ts">
    import ExpoType from "@/models/expeditions/ExpoType";
    import { Component, Vue } from "vue-property-decorator";
    import ExpoSizeDistributionTable from '../ExpoSizeDistributionTable.vue';
    import ExpoRangedTable, { ExpoRangeTableItem } from '@/components/expeditions/ExpoRangedTable.vue';
    import { ExpoEventFleet, ExpoFindableShips } from "@/models/expeditions/ExpoEvent";
    
    import getNumericEnumValues from "@/utils/getNumericEnumValues";
    import Ship from "@/models/Ship";

    @Component({
        components: {
            ExpoSizeDistributionTable,
            ExpoRangedTable,
        },
    })
    export default class ExpeditionOverviewTables extends Vue {
        private readonly expoType = ExpoType.fleet;

        private get items(): ExpoRangeTableItem[] {
            return getNumericEnumValues<Ship>(ExpoFindableShips)
                .map(ship => {
                    return {
                        label: this.$i18n.$t.ships[ship],
                        getValue: (expos) => (expos.filter(expo => expo.type == ExpoType.fleet) as ExpoEventFleet[])
                            .reduce((acc, cur) => acc + (cur.fleet[ship] ?? 0), 0)
                    };
                });
        }
    }
</script>
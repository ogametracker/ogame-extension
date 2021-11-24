<template>
    <div>
        <expo-ranged-table :items="items" show-total fade-zeros />

        <h2 v-text="$i18n.$t.eventSizes" />
        <expo-size-distribution-table :type="expoType" />

        <h2 v-text="$i18n.$t.resourceUnits" />
        <expo-ranged-table :items="itemsUnits" show-total fade-zeros />
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
    import Resource from "@/models/Resource";
    import ShipDictionary from '@/models/ogame/buildables/ShipDictionary';

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

        private get itemsUnits(): ExpoRangeTableItem[] {
            return Object.values(Resource)
                .map(resource => ({
                    label: this.$i18n.$t.resources[resource],
                    getValue: expos => (expos.filter(expo => expo.type == ExpoType.fleet) as ExpoEventFleet[])
                        .reduce((acc, cur) => {
                            return acc + (Object.keys(cur.fleet) as any as Ship[])
                                .reduce((total, ship) => total + ShipDictionary[ship].cost[resource] * (cur.fleet[ship] ?? 0), 0);
                        }, 0)
                }));
        }
    }
</script>
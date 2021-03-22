<template>
    <div>
        <expo-ranged-table :items="items" />

        <h5>{{ $t("expos.resources") }}</h5>
        <expo-size-distribution-table :type="expoType" />
    </div>
</template>
 
<script lang="ts">
    import ExpoType from "@/models/expeditions/ExpoType";
    import { Component, Vue } from "vue-property-decorator";
    import Resource from "@/models/Resource";
    import ExpoRangedTable, { ExpoRangeTableItem } from '@/components/expeditions/ExpoRangedTable.vue';
    import ExpoSizeDistributionTable from '../ExpoSizeDistributionTable.vue';

    @Component({
        components: {
            ExpoSizeDistributionTable,
            ExpoRangedTable,
        },
    })
    export default class ExpeditionOverviewTables extends Vue {
        private readonly expoType = ExpoType.resources;

        private get items(): ExpoRangeTableItem[] {
            return Object.keys(Resource).map(resource => ({
                label: this.$t(`resources['${resource}']`) as string,
                getValue: (expos) => expos.filter(
                    expo => expo.type == ExpoType.resources
                ).reduce((acc, cur) => acc + cur.resources![resource as Resource], 0)
            }));
        }
    }
</script>
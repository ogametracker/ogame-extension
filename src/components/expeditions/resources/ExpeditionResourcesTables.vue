<template>
    <div>
        <expo-ranged-table :items="items" show-total fade-zeros />

        <h2>{{ $i18n.$t.eventSizes }}</h2>
        <expo-size-distribution-table :type="expoType" />
    </div>
</template>
 
<script lang="ts">
    import ExpoType from "@/models/expeditions/ExpoType";
    import { Component, Vue } from "vue-property-decorator";
    import Resource from "@/models/Resource";
    import ExpoRangedTable, { ExpoRangeTableItem } from '@/components/expeditions/ExpoRangedTable.vue';
    import ExpoSizeDistributionTable from '../ExpoSizeDistributionTable.vue';
    import { ExpoEventResources } from "@/models/expeditions/ExpoEvent";
    

    @Component({
        components: {
            ExpoSizeDistributionTable,
            ExpoRangedTable,
        },
    })
    export default class ExpeditionOverviewTables extends Vue {
        private readonly expoType = ExpoType.resources;

        private get items(): ExpoRangeTableItem[] {
            return Object.keys(Resource).map(resourceName => {
                const resource = resourceName as Resource;
                return {
                    label: this.$i18n.$t.resources[resource],
                    getValue: (expos) => (expos.filter(expo => expo.type == ExpoType.resources) as ExpoEventResources[])
                        .reduce((acc, cur) => acc + cur.resources[resource], 0)
                };
            });
        }
    }
</script>
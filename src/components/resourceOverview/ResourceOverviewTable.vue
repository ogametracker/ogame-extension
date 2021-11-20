<template>
    <div>
        <resource-overview-ranged-table :items="items" show-total no-percentage fade-zeros />
    </div>
</template>
 
<script lang="ts">
    import ExpoType from "@/models/expeditions/ExpoType";
    import { Component, Vue } from "vue-property-decorator";
    
    import ResourceOverviewRangedTable, { ResourceOverviewRangedTableItem } from "./ResourceOverviewRangedTable.vue";
    import { ExpoEventResources } from "@/models/expeditions/ExpoEvent";
    import Resource from "@/models/Resource";

    @Component({
        components: {
            ResourceOverviewRangedTable,
        },
    })
    export default class ResourceOverviewTable extends Vue {
        private get items(): ResourceOverviewRangedTableItem[] {
            return Object.keys(Resource).map(resourceName => {
                const resource = resourceName as Resource;
                return {
                    label: this.$i18n.$t.resources[resource],
                    getValue: (expos, battles, debris) => {
                        const expoRess = (expos.filter(expo => expo.type == ExpoType.resources) as ExpoEventResources[])
                            .reduce((acc, cur) => acc + cur.resources[resource], 0);

                        const battleRess = battles.reduce((acc, cur) => acc + cur.loot[resource], 0);
                        const debrisRess = debris.reduce((acc, cur) => acc + (resource == Resource.deuterium ? 0 : resource == Resource.metal ? cur.metal : cur.crystal), 0);

                        return expoRess + battleRess + debrisRess;
                    }
                };
            });
        }
    }
</script>
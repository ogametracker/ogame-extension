<template>
    <div>
        <expo-ranged-table :items="items" />

        <h5>DM-Funde</h5>
        <expo-size-distribution-table :type="expoType" />
    </div>
</template>
 
<script lang="ts">
    import ExpoType from "@/models/expeditions/ExpoType";
    import { Component, Vue } from "vue-property-decorator";
    import ExpoSizeDistributionTable from '../ExpoSizeDistributionTable.vue';
    import ExpoRangedTable, { ExpoRangeTableItem } from '../ExpoRangedTable.vue';

    @Component({
        components: {
            ExpoSizeDistributionTable,
            ExpoRangedTable,
        },
    })
    export default class ExpeditionDarkMatterTables extends Vue {
        private readonly expoType = ExpoType.darkMatter;

        private get items(): ExpoRangeTableItem[] {
            return [{
                label: this.$t(`darkMatter`) as string,
                getValue: (expos) => expos.filter(
                    expo => expo.type == ExpoType.darkMatter
                ).reduce((acc, cur) => acc + (cur.darkMatter ?? 0), 0)
            }];
        }
    }
</script>
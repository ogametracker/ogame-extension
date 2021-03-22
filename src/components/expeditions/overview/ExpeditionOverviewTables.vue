<template>
    <div>
        <expo-ranged-table :items="items" show-total />
    </div>
</template>
 
<script lang="ts">
    import ExpoType from "@/models/expeditions/ExpoType";
    import { Component, Vue } from "vue-property-decorator";
    import ExpoRangedTable, { ExpoRangeTableItem } from '@/components/expeditions/ExpoRangedTable.vue';

    @Component({
        components: {
            ExpoRangedTable,
        },
    })
    export default class ExpeditionOverviewTables extends Vue {
        private get items(): ExpoRangeTableItem[] {
            return Object.keys(ExpoType).map(expoType => ({
                label: this.$t(`expoTypes['${expoType}']`) as string,
                getValue: (expos) => expos.filter(expo => expo.type == expoType).length
            }));
        }
    }
</script>
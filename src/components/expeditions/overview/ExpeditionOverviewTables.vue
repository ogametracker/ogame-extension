<template>
    <div>
        <expo-ranged-table :items="items" show-total fade-zeros />
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
            return Object.values(ExpoType).map(expoType => ({
                label: this.$i18n.$t.expoTypes[expoType],
                getValue: (expos) => expos.filter(expo => expo.type == expoType).length
            }));
        }
    }
</script>
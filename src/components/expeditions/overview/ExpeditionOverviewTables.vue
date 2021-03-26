<template>
    <div>
        <expo-ranged-table :items="items" show-total />
    </div>
</template>
 
<script lang="ts">
    import ExpoType from "@/models/expeditions/ExpoType";
    import { Component, Vue } from "vue-property-decorator";
    import ExpoRangedTable, { ExpoRangeTableItem } from '@/components/expeditions/ExpoRangedTable.vue';
import i18n from "@/i18n";

    @Component({
        components: {
            ExpoRangedTable,
        },
    })
    export default class ExpeditionOverviewTables extends Vue {
        private get items(): ExpoRangeTableItem[] {
            return Object.keys(ExpoType).map(expoType => ({
                label: i18n.messages.ogame.expoTypes[expoType],
                getValue: (expos) => expos.filter(expo => expo.type == expoType).length
            }));
        }
    }
</script>
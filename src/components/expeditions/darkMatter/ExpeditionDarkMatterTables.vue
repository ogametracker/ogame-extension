<template>
    <div>
        <expo-ranged-table :items="items" />

        <h2>{{ $i18n.messages.extension.eventSizes }}</h2>
        <expo-size-distribution-table :type="expoType" />
    </div>
</template>
 
<script lang="ts">
    import ExpoType from "@/models/expeditions/ExpoType";
    import { Component, Vue } from "vue-property-decorator";
    import ExpoSizeDistributionTable from '../ExpoSizeDistributionTable.vue';
    import ExpoRangedTable, { ExpoRangeTableItem } from '../ExpoRangedTable.vue';
    import { ExpoEventDarkMatter } from "@/models/expeditions/ExpoEvent";
    import i18n from "@/i18n";

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
                label: i18n.messages.ogame.premium.darkMatter,
                getValue: (expos) => (expos.filter(expo => expo.type == ExpoType.darkMatter) as ExpoEventDarkMatter[])
                    .reduce((acc, cur) => acc + cur.darkMatter, 0)
            }];
        }
    }
</script>
<template>
    <div>
        <wreckfield-ranged-table :items="items" show-total no-percentage />
    </div>
</template>
 
<script lang="ts">
    import i18n from "@/i18n";
    import { Component, Vue } from "vue-property-decorator";
    import WreckfieldRangedTable, { WreckfieldRangeTableItem } from "./WreckfieldRangedTable.vue";

    @Component({
        components: {
            WreckfieldRangedTable,
        },
    })
    export default class WreckfieldOverviewTables extends Vue {
        private get items(): WreckfieldRangeTableItem[] {
            return [{
                label: i18n.messages.ogame.resources.metal,
                getValue: reports => reports.reduce((acc, report) => acc + report.metal, 0),
            }, {
                label: i18n.messages.ogame.resources.crystal,
                getValue: reports => reports.reduce((acc, report) => acc + report.crystal, 0),
            }];
        }
    }
</script>
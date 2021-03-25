<template>
    <div>
        <wreckfield-ranged-table :items="items" show-total no-percentage />
    </div>
</template>
 
<script lang="ts">
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
                label: this.$t('ogame.resources.metal') as string,
                getValue: reports => reports.reduce((acc, report) => acc + report.metal, 0),
            }, {
                label: this.$t('ogame.resources.crystal') as string,
                getValue: reports => reports.reduce((acc, report) => acc + report.crystal, 0),
            }];
        }
    }
</script>
<template>
    <div>
        <debris-field-ranged-table :items="items" show-total no-percentage />
    </div>
</template>
 
<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import DebrisFieldRangedTable, { DebrisFieldRangeTableItem } from "./DebrisFieldRangedTable.vue";

    @Component({
        components: {
            DebrisFieldRangedTable,
        },
    })
    export default class DebrisFieldOverviewTables extends Vue {
        private get items(): DebrisFieldRangeTableItem[] {
            return [{
                label: this.$ogame.$t.resources.metal,
                getValue: reports => reports.reduce((acc, report) => acc + report.metal, 0),
            }, {
                label: this.$ogame.$t.resources.crystal,
                getValue: reports => reports.reduce((acc, report) => acc + report.crystal, 0),
            }];
        }
    }
</script>
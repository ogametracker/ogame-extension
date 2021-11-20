<template>
    <tab-view :items="items" overflow vertical>
        <template #chart>
            <expedition-fleet-chart />
        </template>
        <template #units-chart>
            <expedition-fleet-units-chart />
        </template>
        <template #tables>
            <expedition-fleet-tables />
        </template>
    </tab-view>
</template>

<script lang="ts">
    import { TabViewItem } from "@/components/common/TabView.vue";
    
    import { Component, Vue } from "vue-property-decorator";
    import ExpeditionFleetChart from "./ExpeditionFleetChart.vue";
    import ExpeditionFleetTables from "./ExpeditionFleetTables.vue";
    import ExpeditionFleetUnitsChart from "./ExpeditionFleetUnitsChart.vue";

    @Component({
        components: {
            ExpeditionFleetChart,
            ExpeditionFleetTables,
            ExpeditionFleetUnitsChart,
        },
    })
    export default class ExpeditionFleet extends Vue {
        private get items(): TabViewItem[] {
            return [
                {
                    name: 'chart',
                    title: this.$i18n.$t.chart,
                },
                {
                    name: 'units-chart',
                    title: `${this.$i18n.$t.chart} ${this.$i18n.$t.resourceUnits}`,
                },
                {
                    name: 'tables',
                    title: this.$i18n.$t.tables,
                },
            ];
        }
    }
</script> 
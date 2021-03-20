<template>
    <b-tabs
        class="min-max-h-100 min-max-w-100 flex-nowrap"
        vertical
        pills
        content-class="min-max-h-100 overflow-auto flex-grow-1"
        active-tab-class="min-max-w-100"
        nav-class="h-100 pr-2 border-right"
        nav-wrapper-class="pl-1"
    >
        <b-tab active title="Diagramm">
            <expedition-overview-chart />
        </b-tab>
        <b-tab title="Tabellen">
            <expedition-overview-tables />
        </b-tab>
    </b-tabs>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import ExpeditionOverviewChart from "./ExpeditionOverviewChart.vue";
    import ExpeditionOverviewTables from "./ExpeditionOverviewTables.vue";

    @Component({
        components: {
            ExpeditionOverviewChart,
            ExpeditionOverviewTables,
        },
    })
    export default class ExpeditionOverview extends Vue {}
</script> 
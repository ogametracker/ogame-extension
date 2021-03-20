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
            <expedition-resources-chart />
        </b-tab>
        <b-tab title="Tabellen">
            <expedition-resources-tables />
        </b-tab>
    </b-tabs>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import ExpeditionResourcesChart from "./ExpeditionResourcesChart.vue";
    import ExpeditionResourcesTables from "./ExpeditionResourcesTables.vue";

    @Component({
        components: {
            ExpeditionResourcesChart,
            ExpeditionResourcesTables,
        },
    })
    export default class ExpeditionResources extends Vue {}
</script> 
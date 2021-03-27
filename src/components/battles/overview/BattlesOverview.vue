<template>
    <battles-overview-chart />
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import BattlesOverviewChart from "./BattlesOverviewChart.vue";

    @Component({
        components: {
            BattlesOverviewChart,
        },
    })
    export default class BattlesOverview extends Vue {
    }
</script> 
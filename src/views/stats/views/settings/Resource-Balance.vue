<template>
    <div class="resource-balance-settings">
        <detailed-resource-balance-settings />
        <include-ships-found-on-expeditions-in-resource-balance-settings />
        <include-ships-lost-in-combats-in-resource-balance />
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import DetailedResourceBalanceSettings from '@/views/stats/components/settings/resource-balance/DetailedResourceBalanceSettings.vue';
    import IncludeShipsFoundOnExpeditionsInResourceBalanceSettings from '@/views/stats/components/settings/resource-balance/IncludeShipsFoundOnExpeditionsInResourceBalanceSettings.vue';
    import IncludeShipsLostInCombatsInResourceBalance from '@/views/stats/components/settings/resource-balance/IncludeShipsLostInCombatsInResourceBalance.vue';

    @Component({
        components: {
            DetailedResourceBalanceSettings,
            IncludeShipsFoundOnExpeditionsInResourceBalanceSettings,
            IncludeShipsLostInCombatsInResourceBalance,
        },
    })
    export default class ResourceBalance extends Vue {


    }
</script>
<style lang="scss" scoped>
    .resource-balance-settings {
        display: grid;
        row-gap: 16px;
    }
</style>
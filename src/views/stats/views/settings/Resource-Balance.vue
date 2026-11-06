<template>
    <div class="resource-balance-settings">
        <detailed-resource-balance-settings />
        <include-ships-found-on-expeditions-in-resource-balance-settings />
        <include-ships-lost-in-combats-in-resource-balance />
        <IncludeLostLootResourcesInResourceBalance />
    </div>
</template>

<script setup lang="ts">
import DetailedResourceBalanceSettings from '@stats/components/settings/resource-balance/DetailedResourceBalanceSettings.vue';
import IncludeShipsFoundOnExpeditionsInResourceBalanceSettings from '@stats/components/settings/resource-balance/IncludeShipsFoundOnExpeditionsInResourceBalanceSettings.vue';
import IncludeShipsLostInCombatsInResourceBalance from '@stats/components/settings/resource-balance/IncludeShipsLostInCombatsInResourceBalance.vue';
import IncludeLostLootResourcesInResourceBalance from '@stats/components/settings/resource-balance/IncludeLostLootResourcesInResourceBalance.vue';
</script>

<style lang="scss" scoped>
    .resource-balance-settings {
        display: grid;
        row-gap: 16px;
    }
</style>

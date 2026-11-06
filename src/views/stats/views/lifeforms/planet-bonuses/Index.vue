<template>
    <page :navItems="navItems" root-route-name="lifeforms/planet-bonuses" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import type { ListNavItem } from '@stats/components/common/ListNav.vue';

const navItems = computed<ListNavItem[]>(() => {
    return [
        {
            to: { name: 'lifeforms/planet-bonuses/resource-production' },
            label: translations().extension.empire.lifeforms.planetBonuses.resourceProduction.header,
        },
        {
            to: { name: 'lifeforms/planet-bonuses/lifeform-research-cost-time' },
            label: translations().extension.empire.lifeforms.planetBonuses.lifeformResearchCostTime.header,
        },
        {
            to: { name: 'lifeforms/planet-bonuses/wreckfield' },
            label: translations().extension.empire.lifeforms.planetBonuses.wreckfield.header,
        },
    ];
});
</script>

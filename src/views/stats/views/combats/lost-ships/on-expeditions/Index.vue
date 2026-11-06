<template>
    <page :nav-items="navItems" :root-route-name="rootRoute" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import type { ListNavItem } from '@stats/components/common/ListNav.vue';

const rootRoute = 'combats/lost-ships/on-expeditions';

const navItems = computed<ListNavItem[]>(() => {
    return [
        {
            label: translations().extension.expeditions.tabHeaders.subHeaders.amount,
            to: { name: 'combats/lost-ships/on-expeditions/amount' },
        },
        {
            label: translations().extension.expeditions.tabHeaders.subHeaders.resources,
            to: { name: 'combats/lost-ships/on-expeditions/resources' },
        },
    ];
});
</script>

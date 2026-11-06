<template>
    <page :nav-items="navItems" :root-route-name="rootRoute" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import type { ListNavItem } from '@stats/components/common/ListNav.vue';

const rootRoute = 'expeditions/dark-matter';

const navItems = computed<ListNavItem[]>(() => {
    return [
        {
            label: translations().extension.expeditions.tabHeaders.subHeaders.amount,
            to: { name: 'expeditions/dark-matter/amount' },
        },
        {
            label: translations().extension.expeditions.tabHeaders.subHeaders.sizes,
            to: { name: 'expeditions/dark-matter/sizes' },
        },
    ];
});
</script>

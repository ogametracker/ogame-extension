<template>
    <Page :nav-items="navItems" :root-route-name="rootRoute" />
</template>

<script setup lang="ts">
import Page from '@stats/components/common/Page.vue';
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import type { ListNavItem } from '@stats/components/common/ListNav.vue';

const rootRoute = 'expeditions/ships';

const navItems = computed<ListNavItem[]>(() => {
    return [
        {
            label: translations().extension.expeditions.tabHeaders.subHeaders.amount,
            to: { name: 'expeditions/ships/amount' },
        },
        {
            label: translations().extension.expeditions.tabHeaders.subHeaders.sizes,
            to: { name: 'expeditions/ships/sizes' },
        },
        {
            label: translations().extension.expeditions.tabHeaders.subHeaders.resources,
            to: { name: 'expeditions/ships/resources' },
        },
    ];
});
</script>

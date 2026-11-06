<template>
    <page :nav-items="navItems" :root-route-name="rootRoute" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import type { ListNavItem } from '@stats/components/common/ListNav.vue';

const rootRoute = 'combats/lost-ships/against-players';

const navItems = computed<ListNavItem[]>(() => {
    return [
        {
            label: translations().extension.combats.tabHeaders.subHeaders.amount,
            to: { name: 'combats/lost-ships/against-players/amount' },
        },
        {
            label: translations().extension.combats.tabHeaders.subHeaders.resources,
            to: { name: 'combats/lost-ships/against-players/resources' },
        },
    ];
});
</script>

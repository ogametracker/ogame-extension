<template>
    <Page :nav-items="navItems" :root-route-name="rootRoute" />
</template>

<script setup lang="ts">
import Page from '@stats/components/common/Page.vue';
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import type { ListNavItem } from '@stats/components/common/ListNav.vue';

const rootRoute = 'combats/overview';

const navItems = computed<ListNavItem[]>(() => {
    return [
        {
            label: translations().extension.combats.tabHeaders.subHeaders.againstPlayers,
            to: { name: 'combats/overview/against-players' },
        },
        {
            label: translations().extension.combats.tabHeaders.subHeaders.onExpeditions,
            to: { name: 'combats/overview/on-expeditions' },
        },
    ];
});
</script>

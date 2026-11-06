<template>
    <Page :nav-items="navItems" :root-route-name="rootRoute" />
</template>

<script setup lang="ts">
import Page from '@stats/components/common/Page.vue';
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import type { ListNavItem } from '@stats/components/common/ListNav.vue';

const rootRoute = 'combats/lost-ships';

const navItems = computed<ListNavItem[]>(() => {
    return [
        {
            label: translations().extension.combats.tabHeaders.subHeaders.againstPlayers,
            to: { name: 'combats/lost-ships/against-players' },
        },
        {
            label: translations().extension.combats.tabHeaders.subHeaders.onExpeditions,
            to: { name: 'combats/lost-ships/on-expeditions' },
        },
    ];
});
</script>

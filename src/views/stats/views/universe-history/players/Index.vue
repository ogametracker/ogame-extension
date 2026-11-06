<template>
    <Page :nav-items="navItems" :root-route-name="rootRoute" />
</template>

<script setup lang="ts">
import Page from '@stats/components/common/Page.vue';
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import type { ListNavItem } from '@stats/components/common/ListNav.vue';

const rootRoute = 'universe-history/players';

const navItems = computed<ListNavItem[]>(() => {
    return [
        {
            label: translations().extension.universeHistory.tabs.subtabs.highscore,
            to: { name: 'universe-history/players/highscore' },
        },
        {
            label: translations().extension.universeHistory.tabs.subtabs.history,
            to: { name: 'universe-history/players/history' },
        },
    ];
});
</script>

<template>
    <page :nav-items="navItems" root-route-name="expeditions/info" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import type { ListNavItem } from '@stats/components/common/ListNav.vue';

const navItems = computed<ListNavItem[]>(() => {
    return [
        {
            label: translations().extension.expeditions.tabHeaders.info.topFinds,
            to: { name: 'expeditions/info/largest-finds' },
        },
        {
            label: translations().extension.expeditions.tabHeaders.info.possibleFinds,
            to: { name: 'expeditions/info/possible-finds' },
        },
    ];
});
</script>

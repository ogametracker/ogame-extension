<template>
    <Page :nav-items="navItems" root-route-name="expeditions/resources/size-breakdown" />
</template>

<script setup lang="ts">
import Page from '@stats/components/common/Page.vue';
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import type { ListNavItem } from '@stats/components/common/ListNav.vue';

const navItems = computed<ListNavItem[]>(() => {
    return [
        {
            label: translations().extension.resources.metal,
            to: { name: 'expeditions/resources/size-breakdown/metal' },
        },
        {
            label: translations().extension.resources.crystal,
            to: { name: 'expeditions/resources/size-breakdown/crystal' },
        },
        {
            label: translations().extension.resources.deuterium,
            to: { name: 'expeditions/resources/size-breakdown/deuterium' },
        },
    ];
});
</script>

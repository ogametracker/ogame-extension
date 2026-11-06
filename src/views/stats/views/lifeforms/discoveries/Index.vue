<template>
    <page :nav-items="navItems" root-route-name="lifeforms/discoveries" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import type { ListNavItem } from '@stats/components/common/ListNav.vue';

const navItems = computed<ListNavItem[]>(() => {
    return [
        {
            label: translations().extension.empire.lifeforms.subHeaders.discoveryResults,
            to: { name: 'lifeforms/discoveries/overview' },
        },
        {
            label: translations().extension.empire.lifeforms.subHeaders.experience,
            to: { name: 'lifeforms/discoveries/experience' },
        },
        {
            label: translations().extension.empire.lifeforms.artifacts,
            to: { name: 'lifeforms/discoveries/artifacts' },
        },
        {
            label: translations().extension.empire.lifeforms.topFinds.topFinds,
            to: { name: 'lifeforms/discoveries/largest-finds' },
        },
    ];
});
</script>

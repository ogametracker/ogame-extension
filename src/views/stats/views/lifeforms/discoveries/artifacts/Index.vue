<template>
    <Page :nav-items="navItems" root-route-name="lifeforms/discoveries/artifacts" />
</template>

<script setup lang="ts">
import Page from '@stats/components/common/Page.vue';
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import type { ListNavItem } from '@stats/components/common/ListNav.vue';

const navItems = computed<ListNavItem[]>(() => {
    return [
        {
            label: translations().extension.expeditions.tabHeaders.subHeaders.amount,
            to: { name: 'lifeforms/discoveries/artifacts/amount' },
        },
        {
            label: translations().extension.expeditions.tabHeaders.subHeaders.sizes,
            to: { name: 'lifeforms/discoveries/artifacts/sizes' },
        },
    ];
});
</script>

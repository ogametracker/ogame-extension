<template>
    <Page class="settings-page" :nav-items="navItems" />
</template>

<script setup lang="ts">
import Page from '@stats/components/common/Page.vue';
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import type { ListNavItem } from '@stats/components/common/ListNav.vue';

const navItems = computed<ListNavItem[]>(() => {
    return [
        {
            label: translations().extension.settings.tabs.common,
            to: { name: 'settings/common' },
        },
        {
            label: translations().extension.settings.tabs.accessbility,
            to: { name: 'settings/accessibility' },
        },
        {
            label: translations().extension.settings.tabs.dateRanges,
            to: { name: 'settings/date-ranges' },
        },
        {
            label: translations().extension.settings.tabs.colors,
            to: { name: 'settings/colors' },
        },
        {
            label: translations().extension.settings.tabs.expeditions,
            to: { name: 'settings/expeditions' },
        },
        {
            label: translations().extension.settings.tabs.combats,
            to: { name: 'settings/combats' },
        },
        {
            label: translations().extension.settings.tabs.debrisFields,
            to: { name: 'settings/debris-fields' },
        },
        {
            label: translations().extension.settings.tabs.resourceBalance,
            to: { name: 'settings/resource-balance' },
        },
        {
            label: translations().extension.settings.tabs.universeHistory,
            to: { name: 'settings/universe-history' },
        },
        {
            label: translations().extension.settings.tabs.importExport,
            to: { name: 'settings/import-export' },
        },
        {
            label: translations().extension.settings.tabs.linkAccounts,
            to: { name: 'settings/linked-accounts' },
        },
        {
            label: translations().extension.settings.tabs.dangerZone,
            to: { name: 'settings/danger-zone' },
            class: 'danger-zone',
        },
    ];
});
</script>

<style lang="scss" scoped>
.settings-page :deep(.danger-zone) {
    --color: 255, 0, 0;
}
</style>

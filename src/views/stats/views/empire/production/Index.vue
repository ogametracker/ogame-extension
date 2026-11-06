<template>
    <TabView :tabs="tabs" root-route-name="empire/production" />
</template>

<script setup lang="ts">
import TabView from '@stats/components/common/TabView.vue';
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import type { Tab } from '@stats/components/common/TabView.vue';

const tabs = computed<Tab[]>(() => {
    return [
        {
            to: { name: 'empire/production/resources' },
            label: translations().extension.empire.production.subHeaders.resourceProduction,
        },
        {
            to: { name: 'empire/production/mines' },
            label: translations().extension.empire.production.subHeaders.mineOverview,
        },
    ];
});
</script>

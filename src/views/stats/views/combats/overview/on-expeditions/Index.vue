<template>
    <tab-view :tabs="tabs" root-route-name="combats/overview/on-expeditions" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import type { Tab } from '@stats/components/common/TabView.vue';

const tabs = computed<Tab[]>(() => {
    return [
        {
            label: translations().extension.common.chart,
            to: { name: 'combats/overview/on-expeditions/chart' },
        },
        {
            label: translations().extension.common.table,
            to: { name: 'combats/overview/on-expeditions/table' },
        },
    ];
});
</script>

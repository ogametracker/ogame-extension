<template>
    <tab-view :tabs="tabs" root-route-name="expeditions/overview" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import type { Tab } from '@stats/components/common/TabView.vue';

const tabs = computed<Tab[]>(() => {
    return [
        {
            label: translations().extension.common.chart,
            to: { name: 'expeditions/overview/chart' },
        },
        {
            label: translations().extension.common.table,
            to: { name: 'expeditions/overview/table' },
        },
    ];
});
</script>

<template>
    <TabView :tabs="tabs" root-route-name="expeditions/depletion" />
</template>

<script setup lang="ts">
import TabView from '@stats/components/common/TabView.vue';
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import type { Tab } from '@stats/components/common/TabView.vue';

const tabs = computed<Tab[]>(() => {
    return [
        {
            label: translations().extension.common.chart,
            to: { name: 'expeditions/depletion/chart' },
        },
        {
            label: translations().extension.common.table,
            to: { name: 'expeditions/depletion/table' },
        },
    ];
});
</script>

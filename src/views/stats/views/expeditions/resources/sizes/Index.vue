<template>
    <tab-view :tabs="tabs" root-route-name="expeditions/resources/sizes" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import type { Tab } from '@stats/components/common/TabView.vue';

const tabs = computed<Tab[]>(() => {
    return [
        {
            to: { name: 'expeditions/resources/sizes/chart' },
            label: translations().extension.common.chart,
        },
        {
            to: { name: 'expeditions/resources/sizes/table' },
            label: translations().extension.common.table,
        },
    ];
});
</script>

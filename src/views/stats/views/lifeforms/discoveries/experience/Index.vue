<template>
    <tab-view :tabs="tabs" root-route-name="lifeforms/discoveries/experience" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import type { Tab } from '@stats/components/common/TabView.vue';

const tabs = computed<Tab[]>(() => {
    return [
        {
            to: { name: 'lifeforms/discoveries/experience/chart' },
            label: translations().extension.common.chart,
        },
        {
            to: { name: 'lifeforms/discoveries/experience/table' },
            label: translations().extension.common.table,
        },
    ];
});
</script>

<template>
    <tab-view :tabs="tabs" root-route-name="expeditions/resources/size-breakdown/crystal" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import type { Tab } from '@stats/components/common/TabView.vue';

const tabs = computed<Tab[]>(() => {
    return [
        {
            to: { name: 'expeditions/resources/size-breakdown/crystal/chart' },
            label: translations().extension.common.chart,
        },
        {
            to: { name: 'expeditions/resources/size-breakdown/crystal/table' },
            label: translations().extension.common.table,
        },
    ];
});
</script>

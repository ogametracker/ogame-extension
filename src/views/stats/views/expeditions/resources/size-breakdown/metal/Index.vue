<template>
    <TabView :tabs="tabs" root-route-name="expeditions/resources/size-breakdown/metal" />
</template>

<script setup lang="ts">
import TabView from '@stats/components/common/TabView.vue';
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import type { Tab } from '@stats/components/common/TabView.vue';

const tabs = computed<Tab[]>(() => {
    return [
        {
            to: { name: 'expeditions/resources/size-breakdown/metal/chart' },
            label: translations().extension.common.chart,
        },
        {
            to: { name: 'expeditions/resources/size-breakdown/metal/table' },
            label: translations().extension.common.table,
        },
    ];
});
</script>

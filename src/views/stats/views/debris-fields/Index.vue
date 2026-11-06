<template>
    <LoadingSpinner v-if="loading" />
    <TabView v-else :tabs="tabs" root-route-name="debris-fields" />
</template>

<script setup lang="ts">
import LoadingSpinner from '@stats/components/common/LoadingSpinner.vue';
import TabView from '@stats/components/common/TabView.vue';
import { computed, onMounted, ref } from 'vue';
import { translations } from '@stats/i18n';
import type { Tab } from '@stats/components/common/TabView.vue';
import { useDebrisFieldReportStore } from '../../data/DebrisFieldReportDataModule';

const debrisFieldReportStore = useDebrisFieldReportStore();

const loading = ref(true);

const tabs = computed<Tab[]>(() => {
    return [
        {
            label: translations().extension.common.chart,
            to: { name: 'debris-fields/chart' },
        },
        {
            label: translations().extension.common.table,
            to: { name: 'debris-fields/table' },
        },
    ];
});

onMounted(async () => {
    await debrisFieldReportStore.ready;
    loading.value = false;
});
</script>

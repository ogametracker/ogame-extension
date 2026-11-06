<template>
    <loading-spinner v-if="loading" />
    <tab-view v-else :tabs="tabs" root-route-name="resource-balance" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { translations } from '@stats/i18n';
import type { Tab } from '@stats/components/common/TabView.vue';
import { useExpeditionStore } from '../../data/ExpeditionDataModule';
import { useCombatReportStore } from '../../data/CombatReportDataModule';
import { useDebrisFieldReportStore } from '../../data/DebrisFieldReportDataModule';

const combatReportStore = useCombatReportStore();

const expeditionStore = useExpeditionStore();

const debrisFieldReportStore = useDebrisFieldReportStore();

const loading = ref(true);

const tabs = computed<Tab[]>(() => {
    return [
        {
            to: { name: 'resource-balance/chart' },
            label: translations().extension.common.chart,
        },
        {
            to: { name: 'resource-balance/table' },
            label: translations().extension.common.table,
        },
    ];
});

onMounted(async () => {
    await combatReportStore.ready;
    await expeditionStore.ready;
    await debrisFieldReportStore.ready;
    loading.value = false;
});
</script>

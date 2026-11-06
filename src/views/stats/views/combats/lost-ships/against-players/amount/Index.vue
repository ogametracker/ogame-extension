<template>
    <tab-view :tabs="tabs" root-route-name="combats/lost-ships/against-players/amount" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import type { Tab } from '@stats/components/common/TabView.vue';

const tabs = computed<Tab[]>(() => {
    return [
        {
            label: translations().extension.common.chart,
            to: { name: 'combats/lost-ships/against-players/amount/chart' },
        },
        {
            label: translations().extension.common.table,
            to: { name: 'combats/lost-ships/against-players/amount/table' },
        },
    ];
});
</script>

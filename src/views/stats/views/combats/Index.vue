<template>
    <loading-spinner v-if="loading" />
    <page v-else :nav-items="navItems" :root-route-name="rootRoute" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { translations } from '@stats/i18n';
import type { ListNavItem } from '@stats/components/common/ListNav.vue';
import { useCombatReportStore } from '../../data/CombatReportDataModule';

const combatReportStore = useCombatReportStore();

const rootRoute = 'combats';

const loading = ref(true);

const navItems = computed<ListNavItem[]>(() => {
    return [
        {
            label: translations().extension.combats.tabHeaders.overview,
            to: { name: 'combats/overview' },
        },
        {
            label: translations().extension.combats.tabHeaders.loot,
            to: { name: 'combats/resources' },
        },
        {
            label: translations().extension.combats.tabHeaders.lostShips,
            to: { name: 'combats/lost-ships' },
        },
    ];
});

onMounted(async () => {
    await combatReportStore.ready;
    loading.value = false;
});
</script>

<template>
    <loading-spinner v-if="loading" />
    <page v-else :nav-items="navItems" :root-route-name="rootRoute" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { translations } from '@stats/i18n';
import type { ListNavItem } from '@stats/components/common/ListNav.vue';
import { useExpeditionStore } from '../../data/ExpeditionDataModule';
import { useEmpireStore } from '../../data/EmpireDataModule';

const expeditionStore = useExpeditionStore();

const empireStore = useEmpireStore();

const rootRoute = 'expeditions';

const loading = ref(true);

const navItems = computed<ListNavItem[]>(() => {
    return [
        {
            label: translations().extension.expeditions.tabHeaders.overview,
            to: { name: 'expeditions/overview' },
        },
        {
            label: translations().extension.expeditions.tabHeaders.foundResources,
            to: { name: 'expeditions/resources' },
        },
        {
            label: translations().extension.expeditions.tabHeaders.foundShips,
            to: { name: 'expeditions/ships' },
        },
        {
            label: translations().extension.expeditions.tabHeaders.foundDarkMatter,
            to: { name: 'expeditions/dark-matter' },
        },
        {
            label: translations().extension.expeditions.tabHeaders.foundItems,
            to: { name: 'expeditions/items' },
        },
        {
            label: translations().extension.expeditions.tabHeaders.depletion,
            to: { name: 'expeditions/depletion' },
        },
        {
            label: translations().extension.expeditions.tabHeaders.info.header,
            to: { name: 'expeditions/info' },
        },
    ];
});

onMounted(async () => {
    await expeditionStore.ready;
    await empireStore.ready;
    loading.value = false;
});
</script>

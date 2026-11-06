<template>
    <loading-spinner v-if="loading" />
    <page v-else :nav-items="navItems" :root-route-name="rootRoute" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { translations } from '@stats/i18n';
import type { ListNavItem } from '../../components/common/ListNav.vue';
import { useEmpireStore } from '../../data/EmpireDataModule';
import { useServerSettingsStore } from '../../data/ServerSettingsDataModule';
import { useUniverseSpecificSettingsStore } from '../../data/UniverseSpecificSettingsDataModule';

const empireStore = useEmpireStore();

const serverSettingsStore = useServerSettingsStore();

const universeSpecificSettingsStore = useUniverseSpecificSettingsStore();

const rootRoute = 'empire';

const loading = ref(true);

const navItems = computed<ListNavItem[]>(() => {
    const items: ListNavItem[] = [
        {
            label: translations().extension.empire.overview.header,
            to: { name: 'empire/overview' },
        },
        {
            label: translations().extension.empire.production.header,
            to: { name: 'empire/production' },
        },
        {
            label: translations().extension.empire.amortization.header,
            to: { name: 'empire/amortization' },
        },
    ];

    //TODO: enable point distribution view when properly implemented
    // items.push({
    //     label: 'LOCA: Point Distribution',
    //     to: { name: 'empire/point-distribution' },
    // });

    return items;
});

onMounted(async () => {
    await empireStore.ready;
    await serverSettingsStore.ready;
    await universeSpecificSettingsStore.ready;

    loading.value = false;
});
</script>

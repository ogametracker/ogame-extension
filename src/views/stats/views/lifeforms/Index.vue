<template>
    <loading-spinner v-if="loading" />
    <page v-else :nav-items="navItems" root-route-name="lifeforms" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { translations } from '@stats/i18n';
import type { ListNavItem } from '@stats/components/common/ListNav.vue';
import { useEmpireStore } from '../../data/EmpireDataModule';
import { useServerSettingsStore } from '../../data/ServerSettingsDataModule';

const empireStore = useEmpireStore();

const serverSettingsStore = useServerSettingsStore();

const loading = ref(true);

const navItems = computed<ListNavItem[]>(() => {
    return [
        {
            to: { name: 'lifeforms/overview' },
            label: translations().extension.empire.lifeforms.subHeaders.overview,
        },
        {
            to: { name: 'lifeforms/bonus-breakdown' },
            label: translations().extension.empire.lifeforms.subHeaders.researchBonuses,
        },
        {
            to: { name: 'lifeforms/planet-bonuses' },
            label: translations().extension.empire.lifeforms.subHeaders.planetBonuses,
        },
        {
            to: { name: 'lifeforms/progress' },
            label: translations().extension.empire.lifeforms.subHeaders.progress,
        },
        {
            to: { name: 'lifeforms/discoveries' },
            label: translations().extension.empire.lifeforms.subHeaders.discoveryMissions,
        },
    ];
});

onMounted(async () => {
    await empireStore.ready;
    await serverSettingsStore.ready;

    loading.value = false;
});
</script>

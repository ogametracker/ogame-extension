<template>
    <div v-if="!ready">
        <LoadingSpinner />
        <div v-if="showLoadingMessage" v-text="translations().extension.universeHistory.loadingTakingLong" />
    </div>
    <Page v-else-if="enabled" :nav-items="navItems" :root-route-name="rootRoute" />
    <UniverseHistoryTrackingSettings v-else />
</template>

<script setup lang="ts">
import LoadingSpinner from '@stats/components/common/LoadingSpinner.vue';
import Page from '@stats/components/common/Page.vue';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { translations } from '@stats/i18n';
import type { ListNavItem } from '@stats/components/common/ListNav.vue';
import { useSettingsStore } from '../../data/SettingsDataModule';
import UniverseHistoryTrackingSettings from '@stats/components/settings/UniverseHistoryTrackingSettings.vue';
import { useUniverseHistoryStore } from '../../data/UniverseHistoryDataModule';
import { useServerSettingsStore } from '../../data/ServerSettingsDataModule';

const serverSettingsStore = useServerSettingsStore();

const universeHistoryStore = useUniverseHistoryStore();

const settingsStore = useSettingsStore();

const rootRoute = 'universe-history';

const ready = ref(false);

const loadingStart = ref(0);

const showLoadingMessage = ref(false);

const timeout = ref(0);

const enabled = computed(() => settingsStore.settings.universeHistory.enabled);

const navItems = computed<ListNavItem[]>(() => {
    return [
        {
            label: translations().extension.universeHistory.tabs.players,
            to: { name: 'universe-history/players' },
        },
        {
            label: translations().extension.universeHistory.tabs.alliances,
            to: { name: 'universe-history/alliances' },
        },
    ];
});

onMounted(async () => {
    loadingStart.value = Date.now();
    timeout.value = window.setTimeout(() => (showLoadingMessage.value = true), 5_000);

    await serverSettingsStore.ready;
    await universeHistoryStore.ready;
    ready.value = true;

    clearTimeout(timeout.value);
});

onUnmounted(() => clearTimeout(timeout.value));
</script>

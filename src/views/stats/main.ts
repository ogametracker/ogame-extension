import { createPinia, disposePinia } from 'pinia';
import { createApp } from 'vue';
import { addIconFonts } from '@ogame-tracker/view-shared/addIconFonts';
import '@ogame-tracker/view-shared/styles/index.scss';
import App from './App.vue';
import { registerCommonComponents } from './components/common';
import { registerOgameComponents } from './components/ogame';
import { useCombatReportStore } from './data/CombatReportDataModule';
import { useDebrisFieldReportStore } from './data/DebrisFieldReportDataModule';
import { useEmpireStore } from './data/EmpireDataModule';
import { useExpeditionStore } from './data/ExpeditionDataModule';
import { useLifeformDiscoveryStore } from './data/LifeformDiscoveryDataModule';
import { useServerSettingsStore } from './data/ServerSettingsDataModule';
import { useSettingsStore } from './data/SettingsDataModule';
import { useUniverseHistoryStore } from './data/UniverseHistoryDataModule';
import { useUniverseSpecificSettingsStore } from './data/UniverseSpecificSettingsDataModule';
import { useUniversesAndAccountsStore } from './data/UniversesAndAccountsDataModule';
import { createStatsRouter } from './router';

async function init() {
    addIconFonts();

    const pinia = createPinia();
    const app = createApp(App);
    app.use(pinia);
    app.onUnmount(() => disposePinia(pinia));

    // Subscribe before initial navigation so tracking can continue as data loads.
    const settings = useSettingsStore(pinia);
    useUniversesAndAccountsStore(pinia);
    useServerSettingsStore(pinia);
    useUniverseSpecificSettingsStore(pinia);
    useUniverseHistoryStore(pinia);
    useCombatReportStore(pinia);
    useDebrisFieldReportStore(pinia);
    useExpeditionStore(pinia);
    useLifeformDiscoveryStore(pinia);
    useEmpireStore(pinia);

    await settings.ready;

    const router = createStatsRouter(settings);
    app.use(router);
    registerCommonComponents(app);
    registerOgameComponents(app);
    await router.isReady();
    app.mount('#stats');
}

void init().catch(console.error);

<template>
    <div v-if="!ready">
        <loading-spinner />
        <div
            v-if="showLoadingMessage"
            v-text="'LOCA: This is taking longer than expected. The database is probably updating right now, please be patient or try again later.'"
        />
    </div>
    <page v-else-if="enabled" :nav-items="navItems" :root-route-name="rootRoute" />
    <universe-history-tracking-settings v-else />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '@stats/components/common/ListNav.vue';
    import { SettingsDataModule } from '../../data/SettingsDataModule';
    import UniverseHistoryTrackingSettings from '@stats/components/settings/UniverseHistoryTrackingSettings.vue';
    import { UniverseHistoryDataModule } from '../../data/UniverseHistoryDataModule';

    @Component({
        components: {
            UniverseHistoryTrackingSettings,
        },
    })
    export default class Expeditions extends Vue {
        private readonly rootRoute = 'universe-history';
        private ready = false;
        private loadingStart = 0;
        private showLoadingMessage = false;
        private timeout = 0;

        private async mounted() {
            this.loadingStart = Date.now();
            this.timeout = setTimeout(() => this.showLoadingMessage = true, 5_000);

            await UniverseHistoryDataModule.ready;
            this.ready = true;

            clearTimeout(this.timeout);
        }

        private get enabled() {
            return SettingsDataModule.settings.universeHistory.enabled;
        }

        private get navItems(): ListNavItem[] {
            return [
                {
                    label: this.$i18n.$t.universeHistory.tabs.players,
                    to: { name: 'universe-history/players' },
                },
                {
                    label: this.$i18n.$t.universeHistory.tabs.alliances,
                    to: { name: 'universe-history/alliances' },
                },
            ];
        }
    }
</script>
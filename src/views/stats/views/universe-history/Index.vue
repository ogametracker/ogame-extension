<template>
    <loading-spinner v-if="!ready" />
    <page
        v-else-if="enabled"
        :nav-items="navItems"
        :root-route-name="rootRoute"
    />
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

        private async mounted() {
            await UniverseHistoryDataModule.ready;
            this.ready = true;
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
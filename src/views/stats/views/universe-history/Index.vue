<template>
    <page
        v-if="ready && enabled"
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

    @Component({
        components: {
            UniverseHistoryTrackingSettings,
        },
    })
    export default class Expeditions extends Vue {
        private readonly rootRoute = 'universe-history';
        private ready = false;
        private enabled = false;

        private async mounted() {
            this.enabled = SettingsDataModule.settings.universeHistory.enabled
            //TODO: await UniverseHistoryDataModule.load();
            this.ready = true;
        }

        private get navItems(): ListNavItem[] {
            return [
                {
                    label: 'LOCA: Players',
                    to: { name: 'universe-history/players' },
                },
                {
                    label: 'LOCA: Alliances',
                    to: { name: 'universe-history/alliances' },
                },
            ];
        }
    }
</script>
<template>
    <page :nav-items="navItems" :root-route-name="rootRoute" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '@stats/components/common/ListNav.vue';

    @Component({})
    export default class Expeditions extends Vue {
        private readonly rootRoute = 'universe-history/alliances';

        private get navItems(): ListNavItem[] {
            return [
                {
                    label: this.$i18n.$t.extension.universeHistory.tabs.subtabs.highscore,
                    to: { name: 'universe-history/alliances/highscore' },
                },
                {
                    label: this.$i18n.$t.extension.universeHistory.tabs.subtabs.history,
                    to: { name: 'universe-history/alliances/history' },
                },
            ];
        }
    }
</script>
<template>
    <page :nav-items="navItems" :root-route-name="rootRoute" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '@stats/components/common/ListNav.vue';
    import { UniverseHistoryDataModule } from '@/views/stats/data/UniverseHistoryDataModule';
    import { PlayerHistory } from '@/shared/models/universe-history/PlayerHistory';

    @Component({})
    export default class Expeditions extends Vue {
        private readonly rootRoute = 'universe-history/players';

        private get navItems(): ListNavItem[] {
            return [
                // {
                //     label: 'LOCA: Highscore',
                //     to: { name: 'universe-history/players/highscore' },
                // },
                // {
                //     label: 'LOCA: History',
                //     to: { name: 'universe-history/players/history' },
                // },
            ];
        }
    }
</script>
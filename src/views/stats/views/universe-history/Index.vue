<template>
    <page v-if="ready" :nav-items="navItems" :root-route-name="rootRoute" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '@stats/components/common/ListNav.vue';
    import { UniverseHistoryDataModule } from '../../data/UniverseHistoryDataModule';

    @Component({})
    export default class Expeditions extends Vue {
        private readonly rootRoute = 'universe-history';
        private ready = false;

        private async mounted() {
            await UniverseHistoryDataModule.load();
            this.ready = true;
        }

        private get navItems(): ListNavItem[] {
            return [
                {
                    label: 'LOCA: Players',
                    to: { name: 'universe-history/players' },
                },
                {
                    label: 'LOCA: Players2',
                    to: { name: 'universe-history/players2' },
                },
                {
                    label: 'LOCA: Alliances',
                    to: { name: 'universe-history/alliances' },
                },
            ];
        }
    }
</script>
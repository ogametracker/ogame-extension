<template>
    <page :nav-items="navItems" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '@stats/components/common/ListNav.vue';
    import { UniverseHistoryDataModule } from '../../data/UniverseHistoryDataModule';

    @Component({})
    export default class Expeditions extends Vue {
        private async mounted() {
            await UniverseHistoryDataModule.load();
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
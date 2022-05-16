<template>
    <page :nav-items="navItems" :root-route-name="rootRoute" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '@stats/components/common/ListNav.vue';
    import { CombatReportDataModule } from '../../data/CombatReportDataModule';

    @Component({})
    export default class Index extends Vue {
        private readonly rootRoute = 'combats';

        private async mounted() {
            //TODO: await CombatReportDataModule.load();
        }

        private get navItems(): ListNavItem[] {
            return [
                {
                    label: 'LOCA: Overview',
                    to: { name: 'combats/overview' },
                },
                {
                    label: 'LOCA: Loot',
                    to: { name: 'combats/resources' },
                },
                {
                    label: 'LOCA: Lost Ships',
                    to: { name: 'combats/lost-ships' },
                },
            ];
        }
    }
</script>
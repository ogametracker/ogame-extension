<template>
    <page :nav-items="navItems" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '@stats/components/common/ListNav.vue';
    import { CombatReportDataModule } from '../../data/CombatReportDataModule';

    @Component({})
    export default class Index extends Vue {
        private async mounted() {
            await CombatReportDataModule.load();
        }

        private get navItems(): ListNavItem[] {
            return [
                {
                    label: 'LOCA: Overview',
                    to: { name: 'combats/overview' },
                },
                {
                    label: 'LOCA: Resource Balance',
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
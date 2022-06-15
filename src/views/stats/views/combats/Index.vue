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
                    label: this.$i18n.$t.combats.tabHeaders.overview,
                    to: { name: 'combats/overview' },
                },
                {
                    label: this.$i18n.$t.combats.tabHeaders.loot,
                    to: { name: 'combats/resources' },
                },
                {
                    label: this.$i18n.$t.combats.tabHeaders.lostShips,
                    to: { name: 'combats/lost-ships' },
                },
            ];
        }
    }
</script>
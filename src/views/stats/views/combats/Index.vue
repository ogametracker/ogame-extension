<template>
    <loading-spinner v-if="loading" />
    <page v-else :nav-items="navItems" :root-route-name="rootRoute" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '@stats/components/common/ListNav.vue';
    import { CombatReportDataModule } from '../../data/CombatReportDataModule';

    @Component({})
    export default class Index extends Vue {
        private readonly rootRoute = 'combats';
        private loading = true;

        private async mounted() {
            await CombatReportDataModule.ready;
            this.loading = false;
        }

        private get navItems(): ListNavItem[] {
            return [
                {
                    label: this.$i18n.$t.extension.combats.tabHeaders.overview,
                    to: { name: 'combats/overview' },
                },
                {
                    label: this.$i18n.$t.extension.combats.tabHeaders.loot,
                    to: { name: 'combats/resources' },
                },
                {
                    label: this.$i18n.$t.extension.combats.tabHeaders.lostShips,
                    to: { name: 'combats/lost-ships' },
                },
            ];
        }
    }
</script>
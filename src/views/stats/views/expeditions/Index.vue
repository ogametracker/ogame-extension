<template>
    <loading-spinner v-if="loading" />
    <page v-else :nav-items="navItems" :root-route-name="rootRoute" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '@stats/components/common/ListNav.vue';
    import { ExpeditionDataModule } from '../../data/ExpeditionDataModule';

    @Component({})
    export default class Expeditions extends Vue {
        private readonly rootRoute = 'expeditions';
        private loading = true;

        async mounted() {
            await ExpeditionDataModule.ready;
            this.loading = false;
        }

        private get navItems(): ListNavItem[] {
            return [
                {
                    label: this.$i18n.$t.expeditions.tabHeaders.overview,
                    to: { name: 'expeditions/overview' },
                },
                {
                    label: this.$i18n.$t.expeditions.tabHeaders.foundResources,
                    to: { name: 'expeditions/resources' },
                },
                {
                    label: this.$i18n.$t.expeditions.tabHeaders.foundShips,
                    to: { name: 'expeditions/ships' },
                },
                {
                    label: this.$i18n.$t.expeditions.tabHeaders.foundDarkMatter,
                    to: { name: 'expeditions/dark-matter' },
                },
                {
                    label: this.$i18n.$t.expeditions.tabHeaders.foundItems,
                    to: { name: 'expeditions/items' },
                },
            ];
        }
    }
</script>
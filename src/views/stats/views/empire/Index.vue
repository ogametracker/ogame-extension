<template>
    <loading-spinner v-if="loading" />
    <page v-else :nav-items="navItems" :root-route-name="rootRoute" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '../../components/common/ListNav.vue';
    import { EmpireDataModule } from '../../data/EmpireDataModule';
    import { ServerSettingsDataModule } from '../../data/ServerSettingsDataModule';
    import { UniverseSpecificSettingsDataModule } from '../../data/UniverseSpecificSettingsDataModule';

    @Component({})
    export default class Index extends Vue {
        private readonly rootRoute = 'empire';
        private loading = true;

        async mounted() {
            await EmpireDataModule.ready;
            await ServerSettingsDataModule.ready;
            await UniverseSpecificSettingsDataModule.ready;

            this.loading = false;
        }

        private get navItems(): ListNavItem[] {
            const items: ListNavItem[] = [
                {
                    label: this.$i18n.$t.extension.empire.overview.header,
                    to: { name: 'empire/overview' },
                },
                {
                    label: this.$i18n.$t.extension.empire.production.header,
                    to: { name: 'empire/production' },
                },
                {
                    label: this.$i18n.$t.extension.empire.amortization.header,
                    to: { name: 'empire/amortization' },
                },
            ];


            //TODO: enable point distribution view when properly implemented
            // items.push({
            //     label: 'LOCA: Point Distribution',
            //     to: { name: 'empire/point-distribution' },
            // });

            return items;
        }
    }
</script>
<template>
    <loading-spinner v-if="loading" />
    <page v-else :nav-items="navItems" :root-route-name="rootRoute" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '../../components/common/ListNav.vue';
    import { EmpireDataModule } from '../../data/EmpireDataModule';
    import { ServerSettingsDataModule } from '../../data/ServerSettingsDataModule';

    @Component({})
    export default class Index extends Vue {
        private readonly rootRoute = 'empire';
        private loading = true;

        async mounted() {
            await EmpireDataModule.ready;
            await ServerSettingsDataModule.ready;
            this.loading = false;
        }

        private get navItems(): ListNavItem[] {
            return [
                {
                    label: this.$i18n.$t.empire.production.header,
                    to: { name: 'empire/production' },
                },
                {
                    label: this.$i18n.$t.empire.amortization.header,
                    to: { name: 'empire/amortization' },
                },
                {
                    label: 'LOCA: lifeforms',
                    to: { name: 'empire/lifeforms' },
                },
            ];
        }
    }
</script>
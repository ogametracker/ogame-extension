<template>
    <page :nav-items="navItems" :root-route-name="rootRoute" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '../../components/common/ListNav.vue';
    import { EmpireDataModule } from '../../data/EmpireDataModule';
    import { ServerSettingsDataModule } from '../../data/ServerSettingsDataModule';

    @Component({})
    export default class Index extends Vue {
        private readonly rootRoute = 'empire';

        async mounted() {
            await Promise.all([
                //TODO: EmpireDataModule.load(),
                //TODO: ServerSettingsDataModule.load(),
            ]);            
        }

        private get navItems(): ListNavItem[] {
            return [
                {
                    label: 'LOCA: Production',
                    to: { name: 'empire/production' },
                },
                {
                    label: 'LOCA: Amortization',
                    to: { name: 'empire/amortization' },
                },
            ];
        }
    }
</script>
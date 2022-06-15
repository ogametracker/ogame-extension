<template>
    <page :nav-items="navItems" :root-route-name="rootRoute" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '../../components/common/ListNav.vue';

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
                    label: this.$i18n.$t.empire.production.header,
                    to: { name: 'empire/production' },
                },
                {
                    label: this.$i18n.$t.empire.amortization.header,
                    to: { name: 'empire/amortization' },
                },
            ];
        }
    }
</script>
<template>
    <page :nav-items="navItems" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '../../components/common/ListNav.vue';
    import { EmpireDataModule } from '../../data/EmpireDataModule';

    @Component({})
    export default class Index extends Vue {
        async mounted() {
            await EmpireDataModule.load();
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
<template>
    <page :nav-items="navItems" :root-route-name="rootRoute" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '@stats/components/common/ListNav.vue';
    import { ExpeditionDataModule } from '../../data/ExpeditionDataModule';

    @Component({})
    export default class Expeditions extends Vue {
        private readonly rootRoute = 'expeditions';

        async mounted() {
            await ExpeditionDataModule.load();
        }

        private get navItems(): ListNavItem[] {
            return [
                {
                    label: 'LOCA: Übersicht',
                    to: { name: 'expeditions/overview' },
                },
                {
                    label: 'LOCA: Rohstofffunde',
                    to: { name: 'expeditions/resources' },
                },
                {
                    label: 'LOCA: Flottenfunde',
                    to: { name: 'expeditions/ships' },
                },
                {
                    label: 'LOCA: DM-Funde',
                    to: { name: 'expeditions/dark-matter' },
                },
                {
                    label: 'LOCA: Itemfunde',
                    to: { name: 'expeditions/items' },
                },
            ];
        }
    }
</script>
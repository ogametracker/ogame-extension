<template>
    <div>
        expeditions/Index
        <page :nav-items="navItems" />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '@stats/components/common/ListNav.vue';

    @Component({})
    export default class Expeditions extends Vue {
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
                {
                    label: 'LOCA: Verteilung',
                    to: { name: 'expeditions/distribution' },
                },
            ];
        }
    }
</script>
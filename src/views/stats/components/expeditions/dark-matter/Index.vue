<template>
    <page :nav-items="navItems" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '../../common/ListNav.vue';

    @Component({})
    export default class Index extends Vue {
        private get navItems(): ListNavItem[] {
            return [
                {
                    label: 'LOCA: Diagramm',
                    to: { name: 'expeditions/dark-matter/charts' },
                },
                {
                    label: 'LOCA: Tabellen',
                    to: { name: 'expeditions/dark-matter/tables' },
                },
            ];
        }
    }
</script>
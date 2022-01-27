<template>
    <page :nav-items="navItems" />
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '@stats/components/common/ListNav.vue';

    @Component({})
    export default class Index extends Vue {
        private get navItems(): ListNavItem[] {
            return [
                {
                    label: 'LOCA: Diagramm',
                    to: { name: 'expeditions/overview/charts' },
                },
                {
                    label: 'LOCA: Tabellen',
                    to: { name: 'expeditions/overview/tables' },
                },
            ];
        }
    }
</script>
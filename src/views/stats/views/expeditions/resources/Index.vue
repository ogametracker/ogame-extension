<template>
    <page :nav-items="navItems" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '@stats/components/common/ListNav.vue';

    @Component({})
    export default class Index extends Vue {
        private get navItems(): ListNavItem[] {
            return [
                {
                    label: 'LOCA: Diagramm',
                    to: { name: 'expeditions/resources/charts' },
                },
                {
                    label: 'LOCA: Tabellen',
                    to: { name: 'expeditions/resources/tables' },
                },
            ];
        }
    }
</script>
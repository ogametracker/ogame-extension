<template>
    <page :nav-items="navItems" :root-route-name="rootRoute" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '@stats/components/common/ListNav.vue';

    @Component({})
    export default class Index extends Vue {
        private readonly rootRoute = 'expeditions/ships';

        private get navItems(): ListNavItem[] {
            return [
                {
                    label: 'LOCA: Count',
                    to: { name: 'expeditions/ships/amount' },
                },
                {
                    label: 'LOCA: Sizes',
                    to: { name: 'expeditions/ships/sizes' },
                },
                {
                    label: 'LOCA: Resources',
                    to: { name: 'expeditions/ships/resources' },
                },
            ];
        }
    }
</script>
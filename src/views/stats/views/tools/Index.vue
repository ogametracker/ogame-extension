<template>
    <page :nav-items="navItems" :root-route-name="rootRoute" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '@stats/components/common/ListNav.vue';

    @Component({})
    export default class Index extends Vue {
        private readonly rootRoute = 'tools';

        private get navItems(): ListNavItem[] {
            return [
                {
                    label: 'LOCA: Flight Cost/Time Calculator => Proxy',
                    to: { name: 'tools/flight' },
                },
                {
                    label: 'LOCA: Cost/Time Calculator => Proxy',
                    to: { name: 'tools/cost' },
                },
                {
                    label: 'LOCA: Production Calculator => Proxy',
                    to: { name: 'tools/production' },
                },
                {
                    label: 'LOCA: Trader Resource Conversion => Proxy',
                    to: { name: 'tools/trader' },
                },
                {
                    label: 'LOCA: Moons => Proxy',
                    to: { name: 'tools/moons' },
                },
                {
                    label: 'LOCA: Expeditions => ExpoCalc',
                    to: { name: 'tools/expeditions' },
                },
            ];
        }
    }
</script>
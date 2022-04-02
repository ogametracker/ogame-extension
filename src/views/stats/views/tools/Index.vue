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
                    label: 'LOCA: Expedition Calculator',
                    to: { name: 'tools/expedition-calculator' },
                },
                {
                    label: 'LOCA: Cost Calculator',
                    to: { name: 'tools/cost-calculator' },
                },
                {
                    label: 'LOCA: Production Calculator',
                    to: { name: 'tools/production-calculator' },
                },
                {
                    label: 'LOCA: Construction Queue',
                    to: { name: 'tools/construction-queue' },
                },
                {
                    label: 'LOCA: Resource Conversion',
                    to: { name: 'tools/resource-conversion' },
                },
            ];
        }
    }
</script>
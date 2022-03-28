<template>
    <page :nav-items="navItems" :root-route-name="rootRoute" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '@stats/components/common/ListNav.vue';

    @Component({})
    export default class Index extends Vue {
        private readonly rootRoute = 'expeditions/dark-matter';

        private get navItems(): ListNavItem[] {
            return [
                {
                    label: 'LOCA: Count',
                    to: { name: 'expeditions/dark-matter/amount' },
                },
                {
                    label: 'LOCA: Sizes',
                    to: { name: 'expeditions/dark-matter/sizes' },
                },
            ];
        }
    }
</script>
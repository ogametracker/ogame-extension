<template>
    <page
        :nav-items="navItems"
        :root-route-name="rootRoute"
    />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '@stats/components/common/ListNav.vue';

    @Component({})
    export default class Index extends Vue {
        private readonly rootRoute = 'expeditions/resources';

        private get navItems(): ListNavItem[] {
            return [
                {
                    label: 'LOCA: Count',
                    to: { name: 'expeditions/resources/amount' },
                },
                {
                    label: 'LOCA: Sizes',
                    to: { name: 'expeditions/resources/sizes' },
                },
            ];
        }
    }
</script>
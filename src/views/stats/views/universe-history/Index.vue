<template>
    <page :nav-items="navItems" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '@stats/components/common/ListNav.vue';

    @Component({})
    export default class Expeditions extends Vue {
        private get navItems(): ListNavItem[] {
            return [
                {
                    label: 'LOCA: Players',
                    to: { name: 'universe-history/players' },
                },
                {
                    label: 'LOCA: Alliances',
                    to: { name: 'universe-history/alliances' },
                },
            ];
        }
    }
</script>
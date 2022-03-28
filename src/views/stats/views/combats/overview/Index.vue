<template>
    <page :nav-items="navItems" :root-route-name="rootRoute" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '@stats/components/common/ListNav.vue';

    @Component({})
    export default class Index extends Vue {
        private readonly rootRoute = 'combats/overview';

        private get navItems(): ListNavItem[] {
            return [
                {
                    label: 'LOCA: Against Players',
                    to: { name: 'combats/overview/against-players' },
                },
                {
                    label: 'LOCA: On Expeditions',
                    to: { name: 'combats/overview/on-expeditions' },
                },
            ];
        }
    }
</script>
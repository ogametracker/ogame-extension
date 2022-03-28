<template>
    <page :nav-items="navItems" :root-route-name="rootRoute" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '@stats/components/common/ListNav.vue';

    @Component({})
    export default class Index extends Vue {
        private readonly rootRoute = 'combats/lost-ships/against-players';

        private get navItems(): ListNavItem[] {
            return [
                {
                    label: 'LOCA: Amount',
                    to: { name: 'combats/lost-ships/against-players/amount' },
                },
                {
                    label: 'LOCA: Resource Units',
                    to: { name: 'combats/lost-ships/against-players/resources' },
                },
            ];
        }
    }
</script>
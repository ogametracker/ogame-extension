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
                    label: this.$i18n.$t.combats.tabHeaders.subHeaders.amount,
                    to: { name: 'combats/lost-ships/against-players/amount' },
                },
                {
                    label: this.$i18n.$t.combats.tabHeaders.subHeaders.resources,
                    to: { name: 'combats/lost-ships/against-players/resources' },
                },
            ];
        }
    }
</script>
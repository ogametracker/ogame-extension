<template>
    <page :nav-items="navItems" :root-route-name="rootRoute" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '@stats/components/common/ListNav.vue';

    @Component({})
    export default class Index extends Vue {
        private readonly rootRoute = 'combats/lost-ships';

        private get navItems(): ListNavItem[] {
            return [
                {
                    label: this.$i18n.$t.combats.tabHeaders.subHeaders.againstPlayers,
                    to: { name: 'combats/lost-ships/against-players' },
                },
                {
                    label: this.$i18n.$t.combats.tabHeaders.subHeaders.onExpeditions,
                    to: { name: 'combats/lost-ships/on-expeditions' },
                },
            ];
        }
    }
</script>
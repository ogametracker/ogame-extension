<template>
    <page :nav-items="navItems" :root-route-name="rootRoute" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '@stats/components/common/ListNav.vue';

    @Component({})
    export default class Index extends Vue {
        private readonly rootRoute = 'combats/lost-ships/on-expeditions';

        private get navItems(): ListNavItem[] {
            return [
                {
                    label: this.$i18n.$t.expeditions.tabHeaders.subHeaders.amount,
                    to: { name: 'combats/lost-ships/on-expeditions/amount' },
                },
                {
                    label: this.$i18n.$t.expeditions.tabHeaders.subHeaders.resources,
                    to: { name: 'combats/lost-ships/on-expeditions/resources' },
                },
            ];
        }
    }
</script>
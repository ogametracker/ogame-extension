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
                    label: this.$i18n.$t.expeditions.tabHeaders.subHeaders.amount,
                    to: { name: 'expeditions/dark-matter/amount' },
                },
                {
                    label: this.$i18n.$t.expeditions.tabHeaders.subHeaders.sizes,
                    to: { name: 'expeditions/dark-matter/sizes' },
                },
            ];
        }
    }
</script>
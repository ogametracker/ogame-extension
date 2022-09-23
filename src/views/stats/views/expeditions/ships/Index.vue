<template>
    <page :nav-items="navItems" :root-route-name="rootRoute" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '@stats/components/common/ListNav.vue';

    @Component({})
    export default class Index extends Vue {
        private readonly rootRoute = 'expeditions/ships';

        private get navItems(): ListNavItem[] {
            return [
                {
                    label: this.$i18n.$t.extension.expeditions.tabHeaders.subHeaders.amount,
                    to: { name: 'expeditions/ships/amount' },
                },
                {
                    label: this.$i18n.$t.extension.expeditions.tabHeaders.subHeaders.sizes,
                    to: { name: 'expeditions/ships/sizes' },
                },
                {
                    label: this.$i18n.$t.extension.expeditions.tabHeaders.subHeaders.resources,
                    to: { name: 'expeditions/ships/resources' },
                },
            ];
        }
    }
</script>
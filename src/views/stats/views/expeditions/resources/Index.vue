<template>
    <page :nav-items="navItems" :root-route-name="rootRoute" />
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
                    label: this.$i18n.$t.extension.expeditions.tabHeaders.subHeaders.amount,
                    to: { name: 'expeditions/resources/amount' },
                },
                {
                    label: this.$i18n.$t.extension.expeditions.tabHeaders.subHeaders.sizes,
                    to: { name: 'expeditions/resources/sizes' },
                },
                {
                    label: this.$i18n.$t.extension.expeditions.tabHeaders.subHeaders.count,
                    to: { name: 'expeditions/resources/count' },
                },
                {
                    label: this.$i18n.$t.extension.expeditions.tabHeaders.subHeaders.sizesByResource,
                    to: { name: 'expeditions/resources/size-breakdown' },
                },
            ];
        }
    }
</script>
<template>
    <page :nav-items="navItems" root-route-name="lifeforms/discoveries/artifacts" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '@stats/components/common/ListNav.vue';

    @Component({})
    export default class Index extends Vue {
        private get navItems(): ListNavItem[] {
            return [
                {
                    label: this.$i18n.$t.extension.expeditions.tabHeaders.subHeaders.amount,
                    to: { name: 'lifeforms/discoveries/artifacts/amount' },
                },
                {
                    label: this.$i18n.$t.extension.expeditions.tabHeaders.subHeaders.sizes,
                    to: { name: 'lifeforms/discoveries/artifacts/sizes' },
                },
            ];
        }
    }
</script>
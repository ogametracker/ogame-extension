<template>
    <page :nav-items="navItems" root-route-name="expeditions/info" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '@stats/components/common/ListNav.vue';

    @Component({})
    export default class Index extends Vue {

        private get navItems(): ListNavItem[] {
            return [
                {
                    label: this.$i18n.$t.extension.expeditions.tabHeaders.info.topFinds,
                    to: { name: 'expeditions/info/largest-finds' },
                },
                {
                    label: this.$i18n.$t.extension.expeditions.tabHeaders.info.possibleFinds,
                    to: { name: 'expeditions/info/possible-finds' },
                },
            ];
        }
    }
</script>
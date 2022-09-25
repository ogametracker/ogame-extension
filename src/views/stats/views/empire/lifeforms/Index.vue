<template>
    <page :nav-items="navItems" root-route-name="empire/lifeforms" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '@/views/stats/components/common/ListNav.vue';

    @Component({})
    export default class Index extends Vue {
        private get navItems(): ListNavItem[] {
            return [
                {
                    to: { name: 'empire/lifeforms/overview' },
                    label: this.$i18n.$t.extension.empire.lifeforms.subHeaders.overview,
                },
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown' },
                    label: 'LOCA: Bonus breakdowns',
                },
                {
                    to: { name: 'empire/lifeforms/progress' },
                    label: this.$i18n.$t.extension.empire.lifeforms.subHeaders.progress,
                },
                {
                    to: { name: 'empire/lifeforms/discoveries' },
                    label: this.$i18n.$t.extension.empire.lifeforms.subHeaders.discoveryMissions,
                },
            ];
        }
    }
</script>
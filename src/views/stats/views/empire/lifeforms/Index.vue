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
                    label: this.$i18n.$t.empire.lifeforms.subHeaders.overview,
                },
                {
                    to: { name: 'empire/lifeforms/discoveries' },
                    label: this.$i18n.$t.lifeformDiscoveries.header,
                },
            ];
        }
    }
</script>
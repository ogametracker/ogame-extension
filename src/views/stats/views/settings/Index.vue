<template>
    <page :nav-items="navItems" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '@stats/components/common/ListNav.vue';

    @Component({})
    export default class Index extends Vue {
        private get navItems(): ListNavItem[] {
            return [
                {
                    label: this.$i18n.$t.settings.tabs.common,
                    to: { name: 'settings/common' },
                },
                {
                    label: this.$i18n.$t.settings.tabs.dateRanges,
                    to: { name: 'settings/date-ranges' },
                },
                {
                    label: this.$i18n.$t.settings.tabs.colors,
                    to: { name: 'settings/colors' },
                },
                {
                    label: this.$i18n.$t.settings.tabs.expeditions,
                    to: { name: 'settings/expeditions' },
                },
                {
                    label: this.$i18n.$t.settings.tabs.combats,
                    to: { name: 'settings/combats' },
                },
                {
                    label: this.$i18n.$t.settings.tabs.resourceBalance,
                    to: { name: 'settings/resource-balance' },
                },
                {
                    label: 'LOCA: Universe History',
                    to: { name: 'settings/universe-history' },
                },
                {
                    label: this.$i18n.$t.settings.tabs.importExport,
                    to: { name: 'settings/import-export' },
                },
            ];
        }
    }
</script>
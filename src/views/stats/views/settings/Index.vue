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
                    label: 'LOCA: Date Ranges',
                    to: { name: 'settings/date-ranges' },
                },
                {
                    label: 'LOCA: Colors',
                    to: { name: 'settings/colors' },
                },
                {
                    label: 'LOCA: Misc',
                    to: { name: 'settings/misc' },
                },
                {
                    label: 'LOCA: Import/Export',
                    to: { name: 'settings/import-export' },
                },
            ];
        }
    }
</script>
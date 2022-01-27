<template>
    <div>
        expeditions/dark-matter/index
        <page :nav-items="navItems" />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '@stats/components/common/ListNav.vue';

    @Component({})
    export default class Index extends Vue {
        private get navItems(): ListNavItem[] {
            return [
                {
                    label: 'LOCA: Count',
                    to: { name: 'expeditions/dark-matter/count' },
                },
                {
                    label: 'LOCA: Sizes',
                    to: { name: 'expeditions/dark-matter/sizes' },
                },
            ];
        }
    }
</script>
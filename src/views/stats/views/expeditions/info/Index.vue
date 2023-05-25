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
                    label: 'LOCA: Largest Finds',
                    to: { name: 'expeditions/info/largest-finds' },
                },
                {
                    label: 'LOCA: Possible Finds',
                    to: { name: 'expeditions/info/possible-finds' },
                },
            ];
        }
    }
</script>
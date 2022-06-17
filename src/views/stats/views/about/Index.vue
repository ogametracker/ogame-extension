<template>
    <page :nav-items="navItems"/>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '../../components/common/ListNav.vue';

    @Component({})
    export default class Index extends Vue {
        private get navItems(): ListNavItem[] {
            return [
                {
                    label: 'LOCA: F.A.Q./Help',
                    to: { name: 'about/help' },
                },
                {
                    label: 'LOCA: Info',
                    to: { name: 'about/info' },
                },
            ];
        }
    }
</script>
<template>
    <page :nav-items="navItems" root-route-name="empire/lifeforms/discoveries" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '@stats/components/common/ListNav.vue';

    @Component({})
    export default class Index extends Vue {
        private get navItems(): ListNavItem[] {
            return [
                {
                    label: this.$i18n.$t.extension.empire.lifeforms.subHeaders.discoveryResults,
                    to: { name: 'empire/lifeforms/discoveries/overview' },
                },
                {
                    label: this.$i18n.$t.extension.empire.lifeforms.subHeaders.experience,
                    to: { name: 'empire/lifeforms/discoveries/experience' },
                },
            ];
        }
    }
</script>
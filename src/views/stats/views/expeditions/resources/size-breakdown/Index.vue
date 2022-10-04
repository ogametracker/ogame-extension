<template>
    <page :nav-items="navItems" root-route-name="expeditions/resources/size-breakdown" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '@stats/components/common/ListNav.vue';

    @Component({})
    export default class Index extends Vue {

        private get navItems(): ListNavItem[] {
            return [
                {
                    label: this.$i18n.$t.extension.resources.metal,
                    to: { name: 'expeditions/resources/size-breakdown/metal' },
                },
                {
                    label: this.$i18n.$t.extension.resources.crystal,
                    to: { name: 'expeditions/resources/size-breakdown/crystal' },
                },
                {
                    label: this.$i18n.$t.extension.resources.deuterium,
                    to: { name: 'expeditions/resources/size-breakdown/deuterium' },
                },
            ];
        }
    }
</script>
<template>
    <page :navItems="navItems" root-route-name="lifeforms/planet-bonuses" />
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '@/views/stats/components/common/ListNav.vue';

    @Component({})
    export default class Index extends Vue {
        private get navItems(): ListNavItem[] {
            return [
                {
                    to: { name: 'lifeforms/planet-bonuses/resource-production' },
                    label: this.$i18n.$t.extension.empire.lifeforms.planetBonuses.resourceProduction.header,
                },
                {
                    to: { name: 'lifeforms/planet-bonuses/lifeform-research-cost-time' },
                    label: this.$i18n.$t.extension.empire.lifeforms.planetBonuses.lifeformResearchCostTime.header,
                },
                {
                    to: { name: 'lifeforms/planet-bonuses/wreckfield' },
                    label: this.$i18n.$t.extension.empire.lifeforms.planetBonuses.wreckfield.header,
                },
            ];
        }
    }
</script>
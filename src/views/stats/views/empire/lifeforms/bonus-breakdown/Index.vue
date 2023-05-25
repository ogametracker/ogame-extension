<template>
    <page :navItems="navItems" root-route-name="empire/lifeforms/bonus-breakdown" />
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '@/views/stats/components/common/ListNav.vue';

    @Component({})
    export default class Index extends Vue {
        private get navItems(): ListNavItem[] {
            return [
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/resource-production' },
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.production.header,
                },
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/expedition-finds' },
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.expeditionFinds.header,
                },
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/expedition-fleet-speed' },
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.expeditionSpeed.header,
                },
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/ships' },
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.ships.header,
                },
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/defenses' },
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.defenses.header,
                },
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/fuel-consumption' },
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.fuelConsumption.header,
                },
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/fleet-fuel-return' },
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.fuelReturn.header,
                },
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/building-cost-time' },
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.buildingCostTime.header,
                },
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/research-cost-time' },
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.researchCostTime.header,
                },
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/crawlers' },
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.crawlers.header,
                },
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/den-capacity' },
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.denCapacity.header,
                },
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/phalanx-range' },
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.phalanxRange.header,
                },
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/discovery-missions' },
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.discoveryMissions.header,
                },
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/player-class' },
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.playerClasses.header,
                },
            ];
        }
    }
</script>
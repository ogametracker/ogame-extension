<template>
    <page :navItems="navItems" root-route-name="lifeforms/bonus-breakdown" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import type { ListNavItem } from '@stats/components/common/ListNav.vue';

const navItems = computed<ListNavItem[]>(() => {
    return [
        {
            to: { name: 'lifeforms/bonus-breakdown/resource-production' },
            label: translations().extension.empire.lifeforms.researchBonuses.production.header,
        },
        {
            to: { name: 'lifeforms/bonus-breakdown/expedition-finds' },
            label: translations().extension.empire.lifeforms.researchBonuses.expeditionFinds.header,
        },
        {
            to: { name: 'lifeforms/bonus-breakdown/expedition-fleet-speed' },
            label: translations().extension.empire.lifeforms.researchBonuses.expeditionSpeed.header,
        },
        {
            to: { name: 'lifeforms/bonus-breakdown/ships' },
            label: translations().extension.empire.lifeforms.researchBonuses.ships.header,
        },
        {
            to: { name: 'lifeforms/bonus-breakdown/defenses' },
            label: translations().extension.empire.lifeforms.researchBonuses.defenses.header,
        },
        {
            to: { name: 'lifeforms/bonus-breakdown/fuel-consumption' },
            label: translations().extension.empire.lifeforms.researchBonuses.fuelConsumption.header,
        },
        {
            to: { name: 'lifeforms/bonus-breakdown/fleet-fuel-return' },
            label: translations().extension.empire.lifeforms.researchBonuses.fuelReturn.header,
        },
        {
            to: { name: 'lifeforms/bonus-breakdown/building-cost-time' },
            label: translations().extension.empire.lifeforms.researchBonuses.buildingCostTime.header,
        },
        {
            to: { name: 'lifeforms/bonus-breakdown/research-cost-time' },
            label: translations().extension.empire.lifeforms.researchBonuses.researchCostTime.header,
        },
        {
            to: { name: 'lifeforms/bonus-breakdown/crawlers' },
            label: translations().extension.empire.lifeforms.researchBonuses.crawlers.header,
        },
        {
            to: { name: 'lifeforms/bonus-breakdown/den-capacity' },
            label: translations().extension.empire.lifeforms.researchBonuses.denCapacity.header,
        },
        {
            to: { name: 'lifeforms/bonus-breakdown/phalanx-range' },
            label: translations().extension.empire.lifeforms.researchBonuses.phalanxRange.header,
        },
        {
            to: { name: 'lifeforms/bonus-breakdown/discovery-missions' },
            label: translations().extension.empire.lifeforms.researchBonuses.discoveryMissions.header,
        },
        {
            to: { name: 'lifeforms/bonus-breakdown/player-class' },
            label: translations().extension.empire.lifeforms.researchBonuses.playerClasses.header,
        },
    ];
});
</script>

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
                    label: 'LOCA: Production Bonuses',
                },
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/expedition-finds' },
                    label: 'LOCA: Expedition Find Bonuses',
                },
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/expedition-fleet-speed' },
                    label: 'LOCA: Expedition Arrival Speed Bonuses',
                },
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/ships' },
                    label: 'LOCA: Ship Bonuses',
                },
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/defenses' },
                    label: 'LOCA: Defense Bonuses',
                },
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/fuel-consumption' },
                    label: 'LOCA: Fuel Consumption',
                },
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/fleet-fuel-return' },
                    label: 'LOCA: Fleet Fuel Return',
                },
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/building-cost-time' },
                    label: 'LOCA: Building Cost & Time',
                },
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/research-cost-time' },
                    label: 'LOCA: Research Cost & Time',
                },
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/crawlers' },
                    label: 'LOCA: Crawlers',
                },
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/den-capacity' },
                    label: 'LOCA: Den Capacity',
                },
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/phalanx-range' },
                    label: 'LOCA: Phalanx Range',
                },
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/discovery-missions' },
                    label: 'LOCA: Discovery Missions',
                },
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/player-class' },
                    label: 'LOCA: Player Classes',
                },
            ];
        }
    }
</script>
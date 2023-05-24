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
                    to: { name: 'empire/lifeforms/bonus-breakdown/expeditions' },
                    label: 'LOCA: Expedition Bonuses',
                },
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/ship-stats' },
                    label: 'LOCA: Ship Bonuses',
                },
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/defense-stats' },
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
                    to: { name: 'empire/lifeforms/bonus-breakdown/player-class' },
                    label: 'LOCA: Player Classes',
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
            ];
        }
    }
</script>
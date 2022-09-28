<template>
    <tab-view :tabs="tabs" root-route-name="empire/lifeforms/bonus-breakdown" />
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { Tab } from '@stats/components/common/TabView.vue';

    @Component({})
    export default class Index extends Vue {
        private get tabs(): Tab[] {
            return [
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/resource-production' },
                    label: 'LOCA: Resource Production Bonuses',
                },
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/expeditions' },
                    label: 'LOCA: Expeditions',
                },
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/ship-stats' },
                    label: 'LOCA: Ship Stats Bonuses',
                },
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/defense-stats' },
                    label: 'LOCA: Defense Stats Bonuses',
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
                    label: 'LOCA: Crawler Production & Consumption',
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
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
                    to: { name: 'empire/lifeforms/bonus-breakdown/ship-stats' },
                    label: 'LOCA: Ship Stats Bonuses',
                },
                {
                    to: { name: 'empire/lifeforms/bonus-breakdown/defense-stats' },
                    label: 'LOCA: Defense Stats Bonuses',
                },
            ];
        }
    }
</script>
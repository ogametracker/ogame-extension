<template>
    <tab-view :tabs="tabs" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { Tab } from '@stats/components/common/TabView.vue';

    @Component({})
    export default class Index extends Vue {
        private get tabs(): Tab[] {
            return [
                {
                    to: { name: 'expeditions/ships/sizes/chart' },
                    icon: 'mdi mdi-chart-areaspline',
                    label: 'LOCA: Chart',
                },
                {
                    to: { name: 'expeditions/ships/sizes/table' },
                    icon: 'mdi mdi-table',
                    label: 'LOCA: Table',
                },
            ];
        }
    }
</script>
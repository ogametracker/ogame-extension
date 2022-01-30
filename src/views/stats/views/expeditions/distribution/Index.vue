<template>
    <tab-view :tabs="tabs" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { Tab } from '@/views/stats/components/common/TabView.vue';

    @Component({})
    export default class Index extends Vue {
        private get tabs(): Tab[] {
            return [
                {
                    to: { name: 'expeditions/distribution/chart' },
                    icon: 'mdi mdi-chart-areaspline',
                    label: 'LOCA: Chart',
                },
                {
                    to: { name: 'expeditions/distribution/table' },
                    icon: 'mdi mdi-table',
                    label: 'LOCA: Table',
                },
            ];
        }
    }
</script>
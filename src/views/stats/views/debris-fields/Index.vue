<template>
    <tab-view :tabs="tabs" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { Tab } from '@/views/stats/components/common/TabView.vue';
import { DebrisFieldReportDataModule } from '../../data/DebrisFieldReportDataModule';

    @Component({})
    export default class Index extends Vue {
        private async mounted() {
            await DebrisFieldReportDataModule.load();
        }

        private get tabs(): Tab[] {
            return [
                {
                    label: 'LOCA: Chart',
                    to: { name: 'debris-fields/chart' },
                },
                {
                    label: 'LOCA: Table',
                    to: { name: 'debris-fields/table' },
                },
            ];
        }
    }
</script>
<template>
    <tab-view :tabs="tabs" root-route-name="debris-fields" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { Tab } from '@/views/stats/components/common/TabView.vue';
import { DebrisFieldReportDataModule } from '../../data/DebrisFieldReportDataModule';

    @Component({})
    export default class Index extends Vue {
        private async mounted() {
            //TODO: await DebrisFieldReportDataModule.load();
        }

        private get tabs(): Tab[] {
            return [
                {
                    label: this.$i18n.$t.common.chart,
                    to: { name: 'debris-fields/chart' },
                },
                {
                    label: this.$i18n.$t.common.table,
                    to: { name: 'debris-fields/table' },
                },
            ];
        }
    }
</script>
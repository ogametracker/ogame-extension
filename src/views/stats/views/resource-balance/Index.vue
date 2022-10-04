<template>
    <loading-spinner v-if="loading" />
    <tab-view v-else :tabs="tabs" root-route-name="resource-balance" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { Tab } from '@stats/components/common/TabView.vue';
    import { ExpeditionDataModule } from '../../data/ExpeditionDataModule';
    import { CombatReportDataModule } from '../../data/CombatReportDataModule';
    import { DebrisFieldReportDataModule } from '../../data/DebrisFieldReportDataModule';

    @Component({})
    export default class Index extends Vue {
        private loading = true;

        private async mounted() {
            await CombatReportDataModule.ready;
            await ExpeditionDataModule.ready;
            await DebrisFieldReportDataModule.ready;
            this.loading = false;
        }

        private get tabs(): Tab[] {
            return [
                {
                    to: { name: 'resource-balance/chart' },
                    label: this.$i18n.$t.extension.common.chart,
                },
                {
                    to: { name: 'resource-balance/table' },
                    label: this.$i18n.$t.extension.common.table,
                },
            ];
        }
    }
</script>
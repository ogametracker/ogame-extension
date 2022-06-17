<template>
    <tab-view :tabs="tabs" root-route-name="resource-balance" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { Tab } from '@stats/components/common/TabView.vue';
    import { ExpeditionDataModule } from '../../data/ExpeditionDataModule';
    import { CombatReportDataModule } from '../../data/CombatReportDataModule';
    import { DebrisFieldReportDataModule } from '../../data/DebrisFieldReportDataModule';

    @Component({})
    export default class Index extends Vue {
        private async mounted() {
            //TODO: await CombatReportDataModule.load();
            //TODO: await ExpeditionDataModule.load();
            //TODO: await DebrisFieldReportDataModule.load();
        }

        private get tabs(): Tab[] {
            return [
                {
                    to: { name: 'resource-balance/chart' },
                    label: this.$i18n.$t.common.chart,
                },
                {
                    to: { name: 'resource-balance/table' },
                    label: this.$i18n.$t.common.table,
                },
            ];
        }
    }
</script>
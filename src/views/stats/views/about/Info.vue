<template>
    <div>
        <grid-table :items="items" :columns="columns" class="info-table" />
        TODO: possibility to go to migration helper page
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { GridTableColumn } from '../../components/common/GridTable.vue';
    import { CombatReportDataModule } from '../../data/CombatReportDataModule';
    import { DebrisFieldReportDataModule } from '../../data/DebrisFieldReportDataModule';
    import { ExpeditionDataModule } from '../../data/ExpeditionDataModule';
    import { ServerSettingsDataModule } from '../../data/ServerSettingsDataModule';
    import { UniverseHistoryDataModule } from '../../data/UniverseHistoryDataModule';
    import { UniversesAndAccountsDataModule } from '../../data/UniversesAndAccountsDataModule';

    interface InfoItem {
        label: string;
        value: string;
    }

    @Component({})
    export default class Info extends Vue {

        private readonly keysSuffixes = [
            'battleReports',
            'debrisFieldReports',
            'expoEvents',
            'local-player',
            'server-settings',
            'settings',
            'version',
        ];

        private get currentAccountExpeditions() {
            return ExpeditionDataModule.count;
        }
        private get currentAccountCombats() {
            return CombatReportDataModule.count;
        }
        private get currentAccountDfReports() {
            return DebrisFieldReportDataModule.count;
        }
        private get trackedAccounts() {
            return UniversesAndAccountsDataModule.accounts.length;
        }
        private get lastServerSettingsUpdate() {
            return ServerSettingsDataModule.lastUpdate;
        }
        private universeHistoryEntries = 0;
        private totalBytesInUse = 0;


        private async mounted() {
            this.universeHistoryEntries = await UniverseHistoryDataModule.getNumberOfTotalEntries();
            this.totalBytesInUse = (await navigator.storage.estimate()).usage ?? 0;
        }

        private get items(): InfoItem[] {
            return [
                {
                    label: 'LOCA: Number of tracked expeditions (this account)',
                    value: this.$i18n.$n(this.currentAccountExpeditions),
                },
                {
                    label: 'LOCA: Number of tracked combats (this account)',
                    value: this.$i18n.$n(this.currentAccountCombats),
                },
                {
                    label: 'LOCA: Number of tracked debris field reports (this account)',
                    value: this.$i18n.$n(this.currentAccountDfReports),
                },
                {
                    label: 'LOCA: Last server settings update for <current server>',
                    value: this.lastServerSettingsUpdate == null ? '-' : this.$i18n.$d(this.lastServerSettingsUpdate, 'date'),
                },
                {
                    label: 'LOCA: Number of universe history entries <current server>',
                    value: this.$i18n.$n(this.universeHistoryEntries),
                },
                {
                    label: 'LOCA: Total number of tracked accounts',
                    value: this.$i18n.$n(this.trackedAccounts),
                },
                {
                    label: 'LOCA: Estimated size of saved data (all known accounts and universes) (+ message why "estimated")',
                    value: this.formatBytes(this.totalBytesInUse),
                },
            ];
        }

        private get columns(): GridTableColumn<keyof InfoItem>[] {
            return [
                {
                    key: 'label',
                    label: 'LOCA: Label',
                },
                {
                    key: 'value',
                    label: 'LOCA: Value',
                },
            ];
        }

        private formatBytes(bytes: number): string {
            const units = ['B', 'kB', 'MB', 'GB'];
            let unitIndex = 0;
            const div = 1_000;

            while (bytes > div && units.length > unitIndex + 1) {
                bytes /= div;
                unitIndex++;
            }

            return `${this.$i18n.$n(bytes, { maximumFractionDigits: 1 })} ${units[unitIndex]}`;
        }
    }
</script>
<style lang="scss" scoped>
    .info-table {
        width: fit-content;
    }
</style>
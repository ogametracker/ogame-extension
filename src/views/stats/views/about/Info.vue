<template>
    <div>
        <div class="version">Version: {{ version }}</div>
        <hr />

        <h3 v-text="$i18n.$t.about.info.table.currentAccount.header" />
        <grid-table
            :items="itemsCurrentAccount"
            :columns="columns"
            class="info-table"
            no-header
            style="width: 400px"
        />
        <hr />

        <h3 v-text="$i18n.$t.about.info.table.global.header" />
        <grid-table
            :items="itemsGlobal"
            :columns="columns"
            class="info-table"
            no-header
            style="width: 400px"
        />
        <hr />

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

        private get version() {
            return chrome.runtime.getManifest().version;
        }

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

        private get itemsCurrentAccount(): InfoItem[] {
            return [
                {
                    label: this.$i18n.$t.about.info.table.currentAccount.numberOfTrackedExpeditions,
                    value: this.$i18n.$n(this.currentAccountExpeditions),
                },
                {
                    label: this.$i18n.$t.about.info.table.currentAccount.numberOfTrackedCombatReports,
                    value: this.$i18n.$n(this.currentAccountCombats),
                },
                {
                    label: this.$i18n.$t.about.info.table.currentAccount.numberOfTrackedDebrisFieldReports,
                    value: this.$i18n.$n(this.currentAccountDfReports),
                },
                {
                    label: this.$i18n.$t.about.info.table.currentAccount.lastUpdateServerSettings,
                    value: this.lastServerSettingsUpdate == null ? '-' : this.$i18n.$d(this.lastServerSettingsUpdate, 'date'),
                },
                {
                    label: this.$i18n.$t.about.info.table.currentAccount.numberOfUniverseHistoryEntries,
                    value: this.$i18n.$n(this.universeHistoryEntries),
                },
            ];
        }

        private get itemsGlobal(): InfoItem[] {
            return [
                {
                    label: this.$i18n.$t.about.info.table.global.numberOfTrackedAccounts,
                    value: this.$i18n.$n(this.trackedAccounts),
                },
                {
                    label: this.$i18n.$t.about.info.table.global.estimatedSize,
                    value: this.formatBytes(this.totalBytesInUse),
                },
            ];
        }

        private get columns(): GridTableColumn<keyof InfoItem>[] {
            return [
                {
                    key: 'label',
                    label: '',
                },
                {
                    key: 'value',
                    label: '',
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

    .version {
        font-weight: bold;
        width: fit-content;
        background-color: black;
        background-image: linear-gradient(
            0deg,
            rgba(var(--color), 0.5),
            rgba(var(--color), 0.7)
        );
        border: 1px solid rgba(var(--color), 0.5);
        border-radius: 4px;
        box-shadow: 0 0 6px 0 rgb(0 0 0 / 33%);
        padding: 8px 16px;
    }
</style>
<template>
    <div>
        <grid-table :items="items" :columns="columns" class="info-table" />
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { GridTableColumn } from '../components/common/GridTable.vue';
    import { CombatReportDataModule } from '../data/CombatReportDataModule';
    import { DebrisFieldReportDataModule } from '../data/DebrisFieldReportDataModule';
    import { ExpeditionDataModule } from '../data/ExpeditionDataModule';
    import { GlobalOgameMetaData } from '../data/GlobalOgameMetaData';
    import { env } from '@/shared/env';

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
            'serverSettings',
            'settings',
            'version',
        ];

        private bytesInUse = {
            currentAccount: 0,
            total: 0,
        };
        private isFirefox = false;

        private async mounted() {
            if (env.browser == 'firefox') {
                this.isFirefox = true;
                return;
            }

            chrome.storage.onChanged.addListener(async (_, area) => {
                if (area == 'local') {
                    await this.onStorageUpdated();
                }
            });
            await this.onStorageUpdated();
        }

        private async onStorageUpdated() {
            const meta = GlobalOgameMetaData;
            const keys = this.keysSuffixes.map(suffix => `s${meta.serverId}-${meta.language}-${meta.playerId}-${suffix}`);
            this.bytesInUse.currentAccount = await chrome.storage.local.getBytesInUse(keys);
            this.bytesInUse.total = await chrome.storage.local.getBytesInUse();
        }

        private get items(): InfoItem[] {
            return [
                {
                    label: 'LOCA: Size of saved data (current account)',
                    value: this.isFirefox
                        ? 'LOCA: not available => Firefox bug'
                        : this.formatBytes(this.bytesInUse.currentAccount),
                },
                {
                    label: 'LOCA: Size of saved data (total)',
                    value: this.isFirefox
                        ? 'LOCA: not available => Firefox bug'
                        : this.formatBytes(this.bytesInUse.total),
                },
                {
                    label: 'LOCA: Number of tracked expeditions',
                    value: this.$number(ExpeditionDataModule.expeditions.length),
                },
                {
                    label: 'LOCA: Number of tracked combats',
                    value: this.$number(CombatReportDataModule.reports.length),
                },
                {
                    label: 'LOCA: Number of tracked debris field reports',
                    value: this.$number(DebrisFieldReportDataModule.reports.length),
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

            return `${this.$number(bytes)} ${units[unitIndex]}`;
        }
    }
</script>
<style lang="scss" scoped>
    .info-table {
        width: fit-content;
    }
</style>
<template>
    <table style="width: max-content;">
        <tbody>
            <tr v-for="(row, i) in rows" :key="i" :class="row.class">
                <td style="width: 300px;">{{ row.title }}</td>
                <td>{{ row.text }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
    import i18n from '@/i18n';
    import BattleModule from '@/store/modules/BattleModule';
    import DebrisFieldModule from '@/store/modules/DebrisFieldModule';
    import ExpoModule from '@/store/modules/ExpoModule';
    import asyncChromeStorage from '@/utils/asyncChromeStorage';
    import { Component, Prop, Vue } from 'vue-property-decorator';

    interface Row {
        title: string;
        text: string;
        class?: string;
    }

    @Component({})
    export default class Info extends Vue {
        private totalBytes = 0;
        private expoReportCount = 0;
        private combatReportCount = 0;
        private dfReportCount = 0;

        private get rows(): Row[] {
            return [
                {
                    title: i18n.messages.extension.info.totalSize,
                    text: this.formattedBytes,
                    class: '',
                },
                {
                    title: i18n.messages.extension.info.trackedExpeditions,
                    text: i18n.formatNumber(this.expoReportCount),
                },
                {
                    title: i18n.messages.extension.info.trackedCombats,
                    text: i18n.formatNumber(this.combatReportCount),
                },
                {
                    title: i18n.messages.extension.info.trackedDebrisFieldReports,
                    text: i18n.formatNumber(this.dfReportCount),
                },
            ];
        }

        private async created() {
            this.totalBytes = await asyncChromeStorage.getBytesInUse();
            this.expoReportCount = ExpoModule.expos.length;
            this.combatReportCount = BattleModule.reports.length;
            this.dfReportCount = DebrisFieldModule.reports.length;
        }

        private get formattedBytes(): string {
            const units = ['B', 'kB', 'MB', 'GB'];
            let unitIndex = 0;
            const div = 1_000;

            let bytes = this.totalBytes;
            while (bytes > div && units.length > unitIndex + 1) {
                bytes /= div;
                unitIndex++;
            }

            return `${i18n.formatNumber(bytes, { 
                maximumFractionDigits: 1,
            })} ${units[unitIndex]}`;
        }
    }
</script>
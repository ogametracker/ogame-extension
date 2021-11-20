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
                    title: this.$i18n.$t.info.totalSize,
                    text: this.formattedBytes,
                    class: '',
                },
                {
                    title: this.$i18n.$t.info.trackedExpeditions,
                    text: this.$i18n.$n(this.expoReportCount),
                },
                {
                    title: this.$i18n.$t.info.trackedCombats,
                    text: this.$i18n.$n(this.combatReportCount),
                },
                {
                    title: this.$i18n.$t.info.trackedDebrisFieldReports,
                    text: this.$i18n.$n(this.dfReportCount),
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

            return `${this.$i18n.$n(bytes, { 
                maximumFractionDigits: 1,
            })} ${units[unitIndex]}`;
        }
    }
</script>
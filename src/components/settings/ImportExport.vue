<template>
    <div>
        <h2 v-text="$i18n.$t.settings.export" />
        <button
            v-text="$i18n.$t.settings.exportData"
            @click="exportDataToFile()"
        />

        <hr />

        <h2 v-text="$i18n.$t.settings.export" />
        <input type="file" ref="importFileInput" @change="updateImportFile()" />
        <br />
        <label>
            <input type="checkbox" v-model="overwriteExistingData" />
            {{ $i18n.$t.settings.overwriteExistingData }}
        </label>
        <br />
        <button
            v-text="$i18n.$t.settings.importFromFile"
            :disabled="importFile == null"
            @click="importFromFile()"
        />
    </div>
</template>

<script lang="ts">
    import OgameMetaData from '@/models/ogame/OgameMetaData';
    import BattleModule from '@/store/modules/BattleModule';
    import DebrisFieldModule from '@/store/modules/DebrisFieldModule';
    import ExpoModule from '@/store/modules/ExpoModule';
    import SettingsModule from '@/store/modules/SettingsModule';
    import download from '@/utils/download';
    import { format } from 'date-fns/esm';
    import { Component, Ref, Vue } from 'vue-property-decorator';
    import ImportExportData from '@/models/importExport/ImportExportData';
    import Settings from '@/models/settings/Settings';
    import DebrisFieldReport from '@/models/debrisFields/DebrisFieldReport';
    import ExpoEvent, { ExpoEventBase } from '@/models/expeditions/ExpoEvent';
    import BattleReport from '@/models/battles/BattleReport';
import NotificationModule from '@/store/modules/NotificationModule';

    @Component({})
    export default class ImportExport extends Vue {

        private get exportData(): ImportExportData {
            return {
                combats: BattleModule.reports,
                debrisFields: DebrisFieldModule.reports,
                expeditions: ExpoModule.expos,
                settings: SettingsModule.settings,
            };
        }
        private exportDataToFile() {
            const data = JSON.stringify(this.exportData);

            const now = format(Date.now(), 'yyyy-MM-dd_HH-mm-ss');
            const filename = `OGameTracker-${OgameMetaData.storageKeyPrefix}-${now}.json`;
            download(filename, data);
        }

        private overwriteExistingData = false;
        private importFile: File | null = null;

        @Ref()
        private importFileInput!: HTMLInputElement;

        private updateImportFile() {
            const files = [...(this.importFileInput.files ?? [])];
            const file: File | null = files[0] ?? null;
            this.importFile = file;
        }

        private async importFromFile() {
            if (this.importFile == null) {
                return;
            }

            try {
                const json = await this.importFile.text();
                const data = JSON.parse(json) as Partial<ImportExportData>;

                this.importData(data);
                await this.saveData();
                
                NotificationModule.addNotification({
                    title: this.$i18n.$t.settings.importSuccessfulTitle,
                    text: this.$i18n.$t.settings.importSuccessfulMessage,
                    type: 'success',
                });
            } catch (error) {
                console.error('import failed', error);

                NotificationModule.addNotification({
                    title: this.$i18n.$t.settings.importFailedTitle,
                    text: this.$i18n.$t.settings.importFailedMessage,
                    type: 'error',
                });
            }
        }

        private async saveData() {
            await SettingsModule.save();

            await ExpoModule.save();
            await BattleModule.save();
            await DebrisFieldModule.save();
        }

        private importData(data: Partial<ImportExportData>) {
            this.tryImportCombats(data.combats);
            this.tryImportExpeditions(data.expeditions);
            this.tryImportDebrisFields(data.debrisFields);
            this.tryImportSettings(data.settings);
        }

        private tryImportSettings(settings?: Settings) {
            if(this.overwriteExistingData) {
                SettingsModule.settings = SettingsModule.getDefaultSettings();
            }

            SettingsModule.settings = {
                ...SettingsModule.settings,
                ...settings,
            };
        }

        private tryImportDebrisFields(debrisFields?: DebrisFieldReport[]) {
            if(this.overwriteExistingData) {
                DebrisFieldModule.reports.splice(0);
            }

            DebrisFieldModule.reports.push(...(debrisFields ?? []));
        }

        private tryImportExpeditions(expeditions?: ExpoEvent[]) {
            if(this.overwriteExistingData) {
                ExpoModule.expos.splice(0);
            }

            ExpoModule.expos.push(...(expeditions ?? []));
        }

        private tryImportCombats(combats?: BattleReport[]) {
            if(this.overwriteExistingData) {
                BattleModule.reports.splice(0);
            }

            BattleModule.reports.push(...(combats ?? []));
        }
    }
</script>
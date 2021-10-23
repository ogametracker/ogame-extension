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
            <input type="checkbox" v-model="importOverwriteExistingData" />
            {{ $i18n.$t.settings.overwriteExistingData }}
        </label>
        <br />
        <button
            v-text="$i18n.$t.settings.importFromFile"
            :disabled="importFile == null"
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

        private importOverwriteExistingData = false;
        private importFile: File | null = null;

        @Ref()
        private importFileInput!: HTMLInputElement;

        private updateImportFile() {
            const files = [...(this.importFileInput.files ?? [])];
            const file: File | null = files[0] ?? null;
            this.importFile = file;
        }
    }
</script>
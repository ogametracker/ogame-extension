<template>
    <div>
        <h3>(DE) Daten-Import aus Live-Version</h3>
        <div>
            Hier kann nicht der normale Export aus der Live-Version verwendet
            werden. Bitte verwende den Export in der Live-Version unter
            "Einstellungen" -> "Beta" und importiere dann hier die Datei.
        </div>
        <h3>(EN) Import data from live version</h3>
        <div>
            You cannot use the standard export from the live version here.
            Please use the beta-specific export in the live version which you
            can find under "Settings" -> "Beta", and then import the file here.
        </div>

        <input
            type="file"
            ref="file-input"
            @change="onFileChanged()"
            :disabled="isImporting"
        /><br />
        <button
            v-text="'Import'"
            :disabled="file == null || isImporting"
            @click="importData()"
        />

        <template v-if="isImporting">
            <br />
            <loading-spinner />
        </template>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Ref, Vue } from 'vue-property-decorator';
    import { V1ToV2Export, V1ToV2ExportedAccount } from '@/shared/migrations/models';
    import { getGlobalDatabase, getPlayerDatabase } from '@/shared/db/access';

    @Component({})
    export default class Beta extends Vue {
        @Ref('file-input')
        private fileInput!: HTMLInputElement;

        private file: File | null = null;
        private isImporting = false;

        private onFileChanged() {
            this.file = this.fileInput.files?.[0] ?? null;
        }

        private async importData() {
            if (this.file == null) {
                return;
            }

            this.isImporting = true;
            await this.$nextTick();

            const json = await this.file.text();
            const data = JSON.parse(json) as V1ToV2Export;
            if (data?.type != 'v1-to-v2-export') {
                alert('Der Dateiinhalte sind ungültig.\nThe file contents are invalid.');
                this.isImporting = false;
                this.file = null;
                return;
            }

            console.log(data);
            for (const account of data.accounts) {
                await this.importAccount(account);
            }

            window.location.reload();
        }

        private async importAccount(account: V1ToV2ExportedAccount) {
            console.log('importing from account', {
                language: account.language,
                serverId: account.serverId,
                playerId: account.playerId,
            });

            const globalDb = await getGlobalDatabase();
            await globalDb.put('accounts', {
                serverId: account.serverId,
                serverLanguage: account.language,
                id: account.playerId,
                name: account.playerName,
            });
            await globalDb.put('servers', {
                id: account.serverId,
                language: account.language,
                name: account.universeName,
            });


            const db = await getPlayerDatabase(account);
            const tx = db.transaction(['expeditions', 'combatReports', 'debrisFieldReports'], 'readwrite');

            const expeditionStore = tx.objectStore('expeditions');
            for (const expedition of Object.values(account.data.expeditions)) {
                await expeditionStore.put(expedition);
            }

            const combatReportStore = tx.objectStore('combatReports');
            for (const combatReport of Object.values(account.data.combatReports)) {
                await combatReportStore.put(combatReport);
            }

            const debrisFieldReportStore = tx.objectStore('debrisFieldReports');
            for (const debrisFieldReport of Object.values(account.data.debrisFieldReports)) {
                await debrisFieldReportStore.put(debrisFieldReport);
            }

            await tx.done;
            console.log('imported account', {
                language: account.language,
                serverId: account.serverId,
                playerId: account.playerId,
            });

        }
    }
</script>
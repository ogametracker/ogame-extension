<template>
    <div id="app">
        <h3>(DE) Daten-Migration</h3>
        <div>
            Willkommen zur neuen Version vom OGame Tracker!<br />
            Einiges hat sich im Hintergrund geändert, weshalb du deine bestehenden Daten migrieren musst.<br />
            Die Migration der Daten ist jedoch einmalig und deine Altdaten werden nicht entfernt, sollte bei der Migration ein Fehler auftreten.<br />
            <br />
            Bitte beginne die Migration der Daten, indem du den Button unter dieser Nachricht klickst.<br />
            Ist die Migration abgeschlossen, sollte sich dieses Fenster von selbst schließen.
        </div>
        <hr />
        <h3>(EN) Data migration</h3>
        <div>
            Welcome to the new OGame Tracker version!<br />
            A lot changed in the background which is why you have to migrate already tracked data.<br />
            However, you only have to do this once and your existing data will be not be deleted in case an error occurs.<br />
            <br />
            Please start the migration by clicking the button below.<br />
            When the migration is done this window should close by itself.
        </div>
        <hr />
        <h3>(PT) Migração de dados</h3>
        <div>
          Bem vindo à nova versão do OGame Tracker!<br />
          Muitas coisas mudaram no background e essa é a razão para teres que fazer a migração dos dados já monitorizados.<br />
          No entanto, tu apenas terás que fazer isto uma única vez e os dados existentes não serão apagados no caso de algum erro ocorrer.<br />
          <br />
          Para começar a migração dos dados basta clicares no botão abaixo.<br />
          Quando a migração terminar esta janela/tab irá fechar-se automaticamente.
        </div>
        <br />

        <button v-text="'Daten migrieren/Migrate data/Migrar dados'" :disabled="isImporting" @click="migrateData()" />

        <template v-if="isImporting">
            <br />
            <loading-spinner />
        </template>
    </div>
</template>

<script lang="ts">
    import { getGlobalDatabase, getPlayerDatabase } from '@/shared/db/access';
    import { V1ToV2Export, V1ToV2ExportedAccount } from '@/shared/import-export/v1-to-v2/';
    import { delay } from '@/shared/utils/delay';
    import { Component, Ref, Vue } from 'vue-property-decorator';

    @Component({
        components: {
        },
    })
    export default class App extends Vue {

        @Ref('file-input')
        private fileInput!: HTMLInputElement;

        private file: File | null = null;
        private isImporting = false;

        private onFileChanged() {
            this.file = this.fileInput.files?.[0] ?? null;
        }

        private async mounted() {
            this.fadeSplashscreen();
        }

        private async migrateData() {
            this.isImporting = true;
            await delay(250);

            try {
                const data = await this.getV1Data();
                for (const account of data.accounts) {
                    await this.importAccount(account);
                }
            } catch (err) {
                alert('Migration failed with the following error, please contact the developer:\n' + err);
            }

            await chrome.storage.local.set({ 'migration-v1-to-v2': true });

            window.close();
        }

        private fadeSplashscreen() {
            const splashscreen = document.querySelector('#splashscreen');
            splashscreen?.classList.add('fade');
            setTimeout(() => splashscreen?.remove(), 500);
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

        private async getV1Data(): Promise<V1ToV2Export> {
            const allData = await chrome.storage.local.get();
            const keys = Object.keys(allData)
                .filter(key => key.endsWith('-version') && allData[key] == '1.1')
                .map(key => key.replace(/-version$/, ''));

            const exportData: V1ToV2Export = {
                type: 'v1-to-v2-export',
                accounts: [],
            };

            keys.forEach(key => {
                const { serverId, language, playerId } = key.match(/s(?<serverId>\d+)-(?<language>\w+)-(?<playerId>\d+)$/)!.groups!;

                const account: V1ToV2ExportedAccount = {
                    language,
                    serverId: parseInt(serverId),
                    playerId: parseInt(playerId),
                    universeName: `${language.toUpperCase()} ${serverId}`,
                    playerName: playerId,
                    data: {
                        expeditions: allData[`${key}-expoEvents`] ?? {},
                        combatReports: allData[`${key}-battleReports`] ?? {},
                        debrisFieldReports: allData[`${key}-debrisFieldReports`] ?? {},
                    },
                };

                const localPlayerData = allData[`${key}-local-player`];
                if (localPlayerData != null) {
                    account.playerName = localPlayerData.name ?? account.playerName;
                    account.universeName = localPlayerData.universeName ?? account.universeName;
                }

                exportData.accounts.push(account);
            });

            return exportData;
        }
    }
</script>

<style lang="scss" scoped>
    #app {
        --color: 64, 120, 168;

        overflow: auto;
        height: 100vh;
        background: linear-gradient(45deg, hsl(208deg 27% 5%), #101e2a);
        padding: 16px;
    }
</style>

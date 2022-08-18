<template>
    <div class="import-export">
        <div class="fake-table">
            <div class="fake-table-header">
                <span v-text="$i18n.$t.settings.importExport.export.header" />
            </div>
            <div class="fake-table-body">
                <div v-text="$i18n.$t.settings.importExport.export.description" />
                <span>
                    <checkbox v-model="exportUniverseHistory" :label="$i18n.$t.settings.importExport.export.includeUniverseHistory" />
                </span>
                <button @click="exportData()" :disabled="isExporting">
                    <span class="mdi mdi-database-export" />
                    <span v-text="$i18n.$t.settings.importExport.export.button" />
                </button>
                <template v-if="isExporting">
                    <span v-text="$i18n.$t.settings.importExport.export.wait" />
                    <loading-spinner />
                </template>
            </div>
        </div>

        <div class="fake-table">
            <div class="fake-table-header">
                <span v-text="$i18n.$t.settings.importExport.import.header" />
            </div>
            <div class="fake-table-body">
                <div v-text="$i18n.$t.settings.importExport.import.description" />
                <input type="file" ref="fileInput" @input="onFileSelected()" accept=".json" :disabled="isImporting" />
                <button @click="importData()" :disabled="isImporting || file == null">
                    <span class="mdi mdi-database-import" />
                    <span v-text="$i18n.$t.settings.importExport.import.button" />
                </button>
                <template v-if="isImporting">
                    <span v-text="$i18n.$t.settings.importExport.import.wait" />
                    <loading-spinner />
                    <span v-text="lastImportMessage" />
                </template>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { getGlobalDatabase, getPlayerDatabase, getUniverseHistoryDatabase } from '@/shared/db/access';
    import { VersionedDataExport } from '@/shared/import-export';
    import { V2Export, V2ExportedAccount, V2ExportedEmpire, V2ExportedEmpireMoon, V2ExportedEmpirePlanet, V2ExportedServer, V2ExportedUniverseHistory } from '@/shared/import-export/v2';
    import { _log, _logDebug, _logError } from '@/shared/utils/_log';
    import { Component, Prop, Ref, Vue } from 'vue-property-decorator';
    import { downloadFile } from '@stats/utils/downloadFile';
    import { format } from 'date-fns/esm';
    import { OgameTrackerPlayerDbSchema } from '@/shared/db/schema';
    import { IDBPTransaction } from 'idb';
    import { parseIntSafe } from '@/shared/utils/parseNumbers';
    import { _throw } from '@/shared/utils/_throw';
    import { DbActiveItems, DbBasicMoonData, DbBasicPlanetData, DbDefenseAmounts, DbMoonBuildingLevels, DbPlanetBuildingLevels, DbPlanetProductionSettings, DbPlayerResearchLevels, DbShipAmounts } from '@/shared/db/schema/player';
    import { createRecord } from '@/shared/utils/createRecord';
    import { BuildingType } from '@/shared/models/ogame/buildings/BuildingType';
    import { MoonBuildingTypes, PlanetBuildingTypes } from '@/shared/models/ogame/buildings/BuildingTypes';
    import { ShipType, ShipTypes } from '@/shared/models/ogame/ships/ShipType';
    import { DefenseType, DefenseTypes } from '@/shared/models/ogame/defenses/DefenseType';
    import { PlayerClass } from '@/shared/models/ogame/classes/PlayerClass';
    import { AllianceClass } from '@/shared/models/ogame/classes/AllianceClass';
    import { ResearchTypes } from '@/shared/models/ogame/research/ResearchTypes';
    import { DbServer } from '@/shared/db/schema/global';
    import { importData as importData_v1ToV2 } from '@/shared/import-export/v1-to-v2/importData';
    import { ImportCallbackInfo, importData as importData_v2 } from '@/shared/import-export/v2/importData';

    @Component({})
    export default class ImportExport extends Vue {

        @Ref()
        private fileInput!: HTMLInputElement;

        private file: File | null = null;
        private exportUniverseHistory = false;

        private isImporting = false;
        private isExporting = false;
        private lastImportMessage = '';

        private onFileSelected() {
            this.file = this.fileInput.files?.[0] ?? null;
        }

        private async exportData() {
            this.isExporting = true;
            try {
                const data = await this.getExportData();

                downloadFile(`OGame-Tracker-Export_${format(Date.now(), 'yyyy-MM-dd_HH-mm-ss')}.json`, JSON.stringify(data));
            }
            catch (error) {
                _logError(error);
                alert(this.$i18n.$t.settings.importExport.export.errors.unexpectedError);
            }
            finally {
                this.isExporting = false;
            }
        }

        private async getExportData(): Promise<V2Export> {
            const globalDb = await getGlobalDatabase();
            const settings = await globalDb.get('settings', 0);

            const knownAccounts = await globalDb.getAll('accounts');
            const accounts: V2ExportedAccount[] = [];
            for (const account of knownAccounts) {
                const db = await getPlayerDatabase({
                    serverId: account.serverId,
                    language: account.serverLanguage,
                    playerId: account.id,
                });
                const tx = db.transaction(['combatReports', 'expeditions', 'debrisFieldReports', 'lifeformDiscoveries', 'universeSpecificSettings', 'empire'], 'readonly');

                const combatReports = await tx.objectStore('combatReports').getAll();
                const expeditions = await tx.objectStore('expeditions').getAll();
                const debrisFieldReports = await tx.objectStore('debrisFieldReports').getAll();
                const lifeformDiscoveries = await tx.objectStore('lifeformDiscoveries').getAll();
                const universeSpecificSettings = await tx.objectStore('universeSpecificSettings').get(0);
                const empire = await this.getExportEmpire(tx);
                await tx.done;

                accounts.push({
                    language: account.serverLanguage,
                    serverId: account.serverId,
                    playerId: account.id,
                    playerName: account.name,

                    combatReports,
                    expeditions,
                    debrisFieldReports,
                    lifeformDiscoveries,
                    universeSpecificSettings,
                    empire,
                });
            }


            const knownServers = await globalDb.getAll('servers');
            const servers: V2ExportedServer[] = [];
            for (const server of knownServers) {
                let universeHistory: V2ExportedUniverseHistory | undefined;
                if (this.exportUniverseHistory) {
                    universeHistory = await this.getExportUniverseHistory(server);
                }

                servers.push({
                    serverId: server.id,
                    language: server.language,
                    name: server.name,
                    universeHistory,
                });
            }

            return {
                type: 'v2-export',
                settings,
                accounts,
                servers,
            };
        }

        private async getExportUniverseHistory(server: DbServer): Promise<V2ExportedUniverseHistory | undefined> {
            const db = await getUniverseHistoryDatabase({
                serverId: server.id,
                language: server.language,
                playerId: 0,
            });
            const tx = db.transaction([
                '_lastUpdate',
                'players', 'playerNames', 'playerAlliances', 'playerStates', 'playerScores',
                'alliances', 'allianceTags', 'allianceNames', 'allianceMembers', 'allianceStates', 'allianceScores',
                'planets', 'planetNames', 'planetStates', 'planetCoordinates',
                'moons', 'moonNames', 'moonStates'
            ], 'readonly');

            const lastUpdate = await tx.objectStore('_lastUpdate').get(0);
            if (lastUpdate == null) {
                await tx.done;
                return undefined;
            }

            const history: V2ExportedUniverseHistory = {
                _lastUpdate: lastUpdate,

                players: await tx.objectStore('players').getAll(),
                playerNames: await tx.objectStore('playerNames').getAll(),
                playerAlliances: await tx.objectStore('playerAlliances').getAll(),
                playerStates: await tx.objectStore('playerStates').getAll(),
                playerScores: await tx.objectStore('playerScores').getAll(),

                alliances: await tx.objectStore('alliances').getAll(),
                allianceTags: await tx.objectStore('allianceTags').getAll(),
                allianceNames: await tx.objectStore('allianceNames').getAll(),
                allianceMembers: await tx.objectStore('allianceMembers').getAll(),
                allianceStates: await tx.objectStore('allianceStates').getAll(),
                allianceScores: await tx.objectStore('allianceScores').getAll(),

                planets: await tx.objectStore('planets').getAll(),
                planetNames: await tx.objectStore('planetNames').getAll(),
                planetStates: await tx.objectStore('planetStates').getAll(),
                planetCoordinates: await tx.objectStore('planetCoordinates').getAll(),

                moons: await tx.objectStore('moons').getAll(),
                moonNames: await tx.objectStore('moonNames').getAll(),
                moonStates: await tx.objectStore('moonStates').getAll(),
            };

            await tx.done;
            return history;
        }

        private async getExportEmpire(tx: IDBPTransaction<OgameTrackerPlayerDbSchema, ("combatReports" | "expeditions" | "debrisFieldReports" | "lifeformDiscoveries" | "universeSpecificSettings" | "empire")[], "readonly">): Promise<V2ExportedEmpire> {
            const store = tx.objectStore('empire');
            const allianceClass = await store.get('allianceClass') as AllianceClass | undefined ?? AllianceClass.none;
            const playerClass = await store.get('playerClass') as PlayerClass | undefined ?? PlayerClass.none;
            const research = await store.get('research') as DbPlayerResearchLevels ?? createRecord(ResearchTypes, 0);

            const keys = await store.getAllKeys();

            const planetIds = keys.filter(key => key.startsWith('planet.') && key.split('.').length == 2).map(key => parseIntSafe(key.split('.')[1], 10));
            const planets: V2ExportedEmpirePlanet[] = [];
            for (const planetId of planetIds) {
                const data = await store.get(`planet.${planetId}`) as DbBasicPlanetData | undefined
                    ?? _throw(`got planet with id '${planetId}'`);

                const buildings = await store.get(`planet.${planetId}.buildings`) as DbPlanetBuildingLevels | undefined
                    ?? createRecord(PlanetBuildingTypes, 0);

                const ships = await store.get(`planet.${planetId}.ships`) as DbShipAmounts | undefined
                    ?? createRecord(ShipTypes, 0);

                const defenses = await store.get(`planet.${planetId}.defenses`) as DbDefenseAmounts | undefined
                    ?? createRecord(DefenseTypes, def => [DefenseType.smallShieldDome, DefenseType.largeShieldDome].includes(def) ? false : 0) as DbDefenseAmounts;

                const activeItems = await store.get(`planet.${planetId}.activeItems`) as DbActiveItems | undefined ?? {};
                const productionSettings = await store.get(`planet.${planetId}.productionSettings`) as DbPlanetProductionSettings | undefined
                    ?? {
                    [BuildingType.metalMine]: 100,
                    [BuildingType.crystalMine]: 100,
                    [BuildingType.deuteriumSynthesizer]: 100,
                    [BuildingType.solarPlant]: 100,
                    [BuildingType.fusionReactor]: 100,
                    [ShipType.solarSatellite]: 100,
                    [ShipType.crawler]: playerClass == PlayerClass.collector ? 150 : 100,
                };

                planets.push({
                    id: data.id,
                    name: data.name,
                    coordinates: data.coordinates,
                    maxTemperature: data.maxTemperature,
                    buildings,
                    ships,
                    defenses,
                    activeItems,
                    productionSettings,
                });
            }

            const moonIds = keys.filter(key => key.startsWith('moon.') && key.split('.').length == 2).map(key => parseIntSafe(key.split('.')[1], 10));
            const moons: V2ExportedEmpireMoon[] = [];
            for (const moonId of moonIds) {
                const data = await store.get(`moon.${moonId}`) as DbBasicMoonData | undefined
                    ?? _throw(`got moon with id '${moonId}'`);

                const buildings = await store.get(`moon.${moonId}.buildings`) as DbMoonBuildingLevels | undefined
                    ?? createRecord(MoonBuildingTypes, 0);

                const ships = await store.get(`moon.${moonId}.ships`) as DbShipAmounts | undefined
                    ?? createRecord(ShipTypes, 0);

                const defenses = await store.get(`moon.${moonId}.defenses`) as DbDefenseAmounts | undefined
                    ?? createRecord(DefenseTypes, def => [DefenseType.smallShieldDome, DefenseType.largeShieldDome].includes(def) ? false : 0) as DbDefenseAmounts;

                const activeItems = await store.get(`moon.${moonId}.activeItems`) as DbActiveItems | undefined ?? {};

                moons.push({
                    id: data.id,
                    name: data.name,
                    coordinates: data.coordinates,
                    buildings,
                    ships,
                    defenses,
                    activeItems,
                });
            }


            return {
                allianceClass,
                playerClass,
                research,
                planets,
                moons,
            };
        }


        private async importData() {
            if (this.file == null) {
                return;
            }

            this.isImporting = true;
            try {
                const json = await this.file.text();
                const data = JSON.parse(json) as VersionedDataExport;

                switch (data?.type) {
                    case 'v1-to-v2-export':
                        await importData_v1ToV2(data);
                        break;

                    case 'v2-export':
                        await importData_v2(data, progress => this.onImportProgress_v2(progress));
                        break;

                    default:
                        alert(this.$i18n.$t.settings.importExport.import.errors.invalidFormat);
                        break;
                }

                this.file = null;
                this.fileInput.value = '';

                window.location.reload();
            }
            catch (error) {
                _logDebug(error);
                alert(this.$i18n.$t.settings.importExport.import.errors.unexpectedError);
            }
            finally {
                this.isImporting = false;
            }
        }

        private onImportProgress_v2(progress: ImportCallbackInfo): void {
            switch(progress.type) {
                case 'importing-settings': {
                    this.lastImportMessage = this.$i18n.$t.settings.importExport.importCallbacks.importingSettings;
                    break;
                }

                case 'importing-basic-accounts-and-servers': {
                    this.lastImportMessage = this.$i18n.$t.settings.importExport.importCallbacks.importingBasicData;
                    break;
                }

                case 'importing-account': {
                    this.lastImportMessage = `${this.$i18n.$t.settings.importExport.importCallbacks.importingAccounts} (${progress.currentIndex + 1}/${progress.total})`;
                    break;
                }

                case 'importing-universe-history': {
                    this.lastImportMessage = `${this.$i18n.$t.settings.importExport.importCallbacks.importingUniverseHistories} (${progress.currentIndex + 1}/${progress.total})`;
                    break;
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .import-export {
        display: grid;
        row-gap: 16px;
    }

    .fake-table {
        border: 1px solid rgba(var(--color), 0.5);
        border-radius: 4px;
        display: grid;
        width: fit-content;
        max-width: 400px;

        &-header {
            background: black linear-gradient(0deg, rgba(var(--color), 0.5), rgba(var(--color), 0.7));
            justify-content: center;
            align-items: center;
        }

        &-header,
        &-body {
            height: 100%;
            padding: 8px;
            display: flex;
        }

        &-body {
            flex-direction: column;
            align-items: start;
            justify-content: center;
            gap: 4px;
        }
    }
</style>
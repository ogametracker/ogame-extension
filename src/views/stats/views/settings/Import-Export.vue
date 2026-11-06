<template>
    <div class="import-export">
        <div class="fake-table">
            <div class="fake-table-header">
                <span v-text="translations().extension.settings.importExport.export.header" />
            </div>
            <div class="fake-table-body">
                <div v-text="translations().extension.settings.importExport.export.description" />
                <span>
                    <Checkbox v-model="exportUniverseHistory" :label="translations().extension.settings.importExport.export.includeUniverseHistory" />
                </span>
                <button @click="exportData()" :disabled="isExporting">
                    <span class="mdi mdi-database-export" />
                    <span v-text="translations().extension.settings.importExport.export.button" />
                </button>
                <template v-if="isExporting">
                    <span v-text="translations().extension.settings.importExport.export.wait" />
                    <LoadingSpinner />
                </template>
            </div>
        </div>

        <div class="fake-table">
            <div class="fake-table-header">
                <span v-text="translations().extension.settings.importExport.import.header" />
            </div>
            <div class="fake-table-body">
                <div v-text="translations().extension.settings.importExport.import.description" />
                <input type="file" ref="fileInput" @input="onFileSelected()" accept=".json" :disabled="isImporting" />
                <button @click="importData()" :disabled="isImporting || file == null">
                    <span class="mdi mdi-database-import" />
                    <span v-text="translations().extension.settings.importExport.import.button" />
                </button>
                <template v-if="isImporting">
                    <span v-text="translations().extension.settings.importExport.import.wait" />
                    <LoadingSpinner />
                    <span v-text="lastImportMessage" />
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Checkbox from '@stats/components/common/Checkbox.vue';
import LoadingSpinner from '@stats/components/common/LoadingSpinner.vue';
import { ref, useTemplateRef } from 'vue';
import { translations } from '@stats/i18n';
import { getGlobalDatabase, getPlayerDatabase, getServerDatabase, getUniverseHistoryDatabase } from '@ogame-tracker/shared/db/access';
import type { VersionedDataExport } from '@ogame-tracker/shared/import-export';
import type { V2Export, V2ExportedAccount, V2ExportedEmpire, V2ExportedEmpireMoon, V2ExportedEmpirePlanet, V2ExportedServer, V2ExportedServerSettings, V2ExportedUniverseHistory } from '@ogame-tracker/shared/import-export/v2';
import { _logDebug, _logError } from '@ogame-tracker/shared/utils/_log';
import { downloadFile } from '@stats/utils/downloadFile';
import { format } from 'date-fns/esm';
import type { OgameTrackerPlayerDbSchema } from '@ogame-tracker/shared/db/schema';
import type { IDBPTransaction } from 'idb';
import { parseIntSafe } from '@ogame-tracker/shared/utils/parseNumbers';
import { _throw } from '@ogame-tracker/shared/utils/_throw';
import type { DbActiveItems, DbBasicMoonData, DbBasicPlanetData, DbDefenseAmounts, DbMoonBuildingLevels, DbPlanetBuildingLevels, DbPlanetLifeformBuildingLevels, DbPlanetLifeformTechnologyLevels, DbPlanetProductionSettings, DbPlayerLifeformExperience, DbPlayerOfficers, DbPlayerResearchLevels, DbShipAmounts } from '@ogame-tracker/shared/db/schema/player';
import { createRecord } from '@ogame-tracker/shared/utils/createRecord';
import { BuildingType } from '@ogame-tracker/shared/models/ogame/buildings/BuildingType';
import { MoonBuildingTypes, PlanetBuildingTypes } from '@ogame-tracker/shared/models/ogame/buildings/BuildingTypes';
import { ShipType } from '@ogame-tracker/shared/models/ogame/ships/ShipType';
import { ShipTypes } from '@ogame-tracker/shared/models/ogame/ships/ShipTypes';
import { DefenseType } from '@ogame-tracker/shared/models/ogame/defenses/DefenseType';
import { DefenseTypes } from '@ogame-tracker/shared/models/ogame/defenses/DefenseTypes';
import { PlayerClass } from '@ogame-tracker/shared/models/ogame/classes/PlayerClass';
import { AllianceClass } from '@ogame-tracker/shared/models/ogame/classes/AllianceClass';
import { ResearchTypes } from '@ogame-tracker/shared/models/ogame/research/ResearchTypes';
import type { DbServer } from '@ogame-tracker/shared/db/schema/global';
import { importData as importData_v1ToV2 } from '@ogame-tracker/shared/import-export/v1-to-v2/importData';
import { importData as importData_v2 } from '@ogame-tracker/shared/import-export/v2/importData';
import type { ImportCallbackInfo } from '@ogame-tracker/shared/import-export/v2/importData';
import { LifeformType, ValidLifeformTypes } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import { LifeformTechnologyType, LifeformTechnologyTypes } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformTechnologyType';
import { LifeformBuildingTypes } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBuildingType';
import type { DbServerSettings } from '@ogame-tracker/shared/db/schema/server';

const fileInput = useTemplateRef<HTMLInputElement>("fileInput");

const file = ref<File | null>(null);

const exportUniverseHistory = ref(false);

const isImporting = ref(false);

const isExporting = ref(false);

const lastImportMessage = ref('');

function onFileSelected() {
    file.value = fileInput.value!.files?.[0] ?? null;
}

async function exportData() {
    isExporting.value = true;
    try {
        const data = await getExportData();

        downloadFile(`OGame-Tracker-Export_${format(Date.now(), 'yyyy-MM-dd_HH-mm-ss')}.json`, JSON.stringify(data));
    }
    catch (error) {
        _logError(error);
        alert(translations().extension.settings.importExport.export.errors.unexpectedError);
    }
    finally {
        isExporting.value = false;
    }
}

async function getExportData(): Promise<V2Export> {
    const globalDb = await getGlobalDatabase();
    const settings = await globalDb.get('settings', 0);

    const knownAccounts = await globalDb.getAll('accounts');
    const accounts: V2ExportedAccount[] = [];
    for (const account of knownAccounts) {
        const db = await getPlayerDatabase({
            serverId: account.serverId,
            language: account.serverLanguage,
            playerId: account.id,
            userLanguage: 'doesnt-really-matter',
        });
        const tx = db.transaction(['combatReports', 'expeditions', 'debrisFieldReports', 'lifeformDiscoveries', 'universeSpecificSettings', 'empire'], 'readonly');

        const combatReports = await tx.objectStore('combatReports').getAll();
        const expeditions = await tx.objectStore('expeditions').getAll();
        const debrisFieldReports = await tx.objectStore('debrisFieldReports').getAll();
        const lifeformDiscoveries = await tx.objectStore('lifeformDiscoveries').getAll();
        const universeSpecificSettings = await tx.objectStore('universeSpecificSettings').get(0);
        const empire = await getExportEmpire(tx);
        await tx.done;

        accounts.push({
            language: account.serverLanguage,
            serverId: account.serverId,
            playerId: account.id,
            playerName: account.name,
            linkedAccounts: account.linkedAccounts?.map(acc => ({
                language: acc.serverLanguage,
                serverId: acc.serverId,
                playerId: acc.id,
            })),

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
        if (exportUniverseHistory.value) {
            universeHistory = await getExportUniverseHistory(server);
        }

        const serverSettings = await getExportServerSettings(server);

        servers.push({
            serverId: server.id,
            language: server.language,
            name: server.name,
            universeHistory,
            serverSettings,
        });
    }

    return {
        type: 'v2-export',
        settings,
        accounts,
        servers,
    };
}

async function getExportServerSettings(server: DbServer): Promise<V2ExportedServerSettings | undefined> {
    const db = await getServerDatabase({
        serverId: server.id,
        language: server.language,
        playerId: 0,
        userLanguage: 'doesnt-really-matter',
    });
    const tx = db.transaction('serverSettings', 'readonly');
    const store = tx.objectStore('serverSettings');

    const keys = await store.getAllKeys();
    if (keys.length == 0) {
        await tx.done;
        return undefined;
    }

    const exportKeys: (keyof V2ExportedServerSettings)[] = (keys.filter(k => k != '_lastUpdate') as (Exclude<keyof DbServerSettings, '_lastUpdate'>)[]);
    const settings = {} as V2ExportedServerSettings;
    for (const key of exportKeys) {
        const value = await store.get(key as keyof DbServerSettings);
        (settings as any)[key] = value;
    }

    await tx.done;
    return settings;
}

async function getExportUniverseHistory(server: DbServer): Promise<V2ExportedUniverseHistory | undefined> {
    const db = await getUniverseHistoryDatabase({
        serverId: server.id,
        language: server.language,
        playerId: 0,
        userLanguage: 'doesnt-really-matter',
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

async function getExportEmpire(tx: IDBPTransaction<OgameTrackerPlayerDbSchema, ("combatReports" | "expeditions" | "debrisFieldReports" | "lifeformDiscoveries" | "universeSpecificSettings" | "empire")[], "readonly">): Promise<V2ExportedEmpire> {
    const store = tx.objectStore('empire');
    const allianceClass = await store.get('allianceClass') as AllianceClass | undefined ?? AllianceClass.none;
    const playerClass = await store.get('playerClass') as PlayerClass | undefined ?? PlayerClass.none;
    const research = await store.get('research') as DbPlayerResearchLevels ?? createRecord(ResearchTypes, 0);

    const officers = (await store.get('officers')) as DbPlayerOfficers | undefined ?? {
        admiral: false,
        commander: false,
        engineer: false,
        geologist: false,
        technocrat: false,
    };
    const lifeformExperience = (await store.get('lifeformExperience')) as DbPlayerLifeformExperience | undefined
        ?? createRecord(ValidLifeformTypes, 0);

    const keys = await store.getAllKeys();

    const planetOrder = (await store.get('planetOrder')) as number[] | undefined ?? [];
    const planetIds = planetOrder.filter(id => keys.includes(`planet.${id}`));
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

        const activeLifeform = (await store.get(`planet.${planetId}.lifeform`)) as LifeformType | undefined ?? LifeformType.none;
        const lifeformBuildings = (await store.get(`planet.${planetId}.lifeformBuildings`)) as DbPlanetLifeformBuildingLevels | undefined ?? createRecord(LifeformBuildingTypes, 0);
        const lifeformTechnologies = (await store.get(`planet.${planetId}.lifeformTechnologies`)) as DbPlanetLifeformTechnologyLevels | undefined ?? createRecord(LifeformTechnologyTypes, 0);
        const activeLifeformTechnologies = (await store.get(`planet.${planetId}.activeLifeformTechnologies`)) as LifeformTechnologyType[] | undefined ?? [];

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

            activeLifeform,
            lifeformBuildings,
            lifeformTechnologies,
            activeLifeformTechnologies,
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
        officers,
        planetOrder,
        lifeformExperience,
    };
}

async function importData() {
    if (file.value == null) {
        return;
    }

    isImporting.value = true;
    try {
        const json = await file.value.text();
        const data = JSON.parse(json) as VersionedDataExport;

        switch (data?.type) {
            case 'v1-to-v2-export':
                await importData_v1ToV2(data);
                break;

            case 'v2-export':
                await importData_v2(data, progress => onImportProgress_v2(progress));
                break;

            default:
                alert(translations().extension.settings.importExport.import.errors.invalidFormat);
                break;
        }

        file.value = null;
        fileInput.value!.value = '';

        window.location.reload();
    }
    catch (error) {
        _logDebug(error);
        alert(translations().extension.settings.importExport.import.errors.unexpectedError);
    }
    finally {
        isImporting.value = false;
    }
}

function onImportProgress_v2(progress: ImportCallbackInfo): void {
    const stepSize = 100;

    switch (progress.type) {
        case 'importing-settings': {
            lastImportMessage.value = translations().extension.settings.importExport.importCallbacks.importingSettings;
            break;
        }

        case 'importing-basic-accounts-and-servers': {
            lastImportMessage.value = translations().extension.settings.importExport.importCallbacks.importingBasicData;
            break;
        }

        case 'importing-server-settings': {
            lastImportMessage.value = `${translations().extension.settings.importExport.importCallbacks.importingBasicData} (${progress.currentIndex + 1}/${progress.total})`;
            break;
        }

        case 'importing-account': {
            switch (progress.step.type) {
                case 'account':
                    lastImportMessage.value = translations().extension.settings.importExport.importCallbacks.importingAccounts(
                        progress.currentIndex,
                        progress.total,
                        'account',
                        0,
                        0,
                    );
                    break;

                case 'combat-reports':
                case 'expeditions':
                case 'debris-fields':
                case 'lifeform-discoveries':
                    if (progress.step.currentIndex % stepSize != 0 && progress.step.currentIndex + 1 != progress.step.total) {
                        return;
                    }

                    lastImportMessage.value = translations().extension.settings.importExport.importCallbacks.importingAccounts(
                        progress.currentIndex,
                        progress.total,
                        progress.step.type,
                        progress.step.currentIndex,
                        progress.step.total,
                    );
                    break;

                case 'universe-specific-settings':
                    lastImportMessage.value = translations().extension.settings.importExport.importCallbacks.importingAccounts(
                        progress.currentIndex,
                        progress.total,
                        'universe-specific-settings',
                        0,
                        0,
                    );
                    break;

                case 'empire':
                    switch (progress.step.subtype) {
                        case 'empire-data':
                            lastImportMessage.value = translations().extension.settings.importExport.importCallbacks.importingAccounts(
                                progress.currentIndex,
                                progress.total,
                                'empire.data',
                                0,
                                0,
                            );
                            break;
                        case 'planets':
                        case 'moons':
                            lastImportMessage.value = translations().extension.settings.importExport.importCallbacks.importingAccounts(
                                progress.currentIndex,
                                progress.total,
                                `empire.${progress.step.subtype}`,
                                progress.step.currentIndex,
                                progress.step.total,
                            );
                            break;
                    }
                    break;
            }
            break;
        }

        case 'importing-universe-history': {
            if (progress.subIndex % stepSize != 0 && progress.subIndex + 1 != progress.subTotal) {
                return;
            }

            lastImportMessage.value = translations().extension.settings.importExport.importCallbacks.importingUniverseHistories(
                progress.currentIndex,
                progress.total,
                progress.subIndex,
                progress.subTotal,
            );
            break;
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

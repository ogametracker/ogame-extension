import { getGlobalDatabase, getPlayerDatabase, getServerDatabase, getUniverseHistoryDatabase } from "@/shared/db/access";
import { OgameTrackerUniverseHistoryDbSchema } from "@/shared/db/schema";
import { DbBasicMoonData, DbBasicPlanetData } from "@/shared/db/schema/player";
import { DbServerSettings } from "@/shared/db/schema/server";
import { StoreNames } from "idb";
import { V2Export, V2ExportedUniverseHistory } from ".";

export type ImportCallbackInfo = (
    | { type: 'importing-settings' }
    | { type: 'importing-basic-accounts-and-servers' }
    | AccountImportCallbackInfo
    | { 
        type: 'importing-universe-history'; 
        currentIndex: number; 
        total: number; 
        subIndex: number;
        subTotal: number;
    }
    | { 
        type: 'importing-server-settings';
        currentIndex: number; 
        total: number; 
    }
);
export type AccountImportCallbackInfo = { 
    type: 'importing-account'; 
    currentIndex: number; 
    total: number; 

    step: { type: 'account' }
        | { 
            type: 'combat-reports' | 'expeditions' | 'debris-fields' | 'lifeform-discoveries';
            currentIndex: number;
            total: number;
        }
        | { type: 'universe-specific-settings' }
        | { 
            type: 'empire';
            subtype: 'empire-data';
        }
        | { 
            type: 'empire';
            subtype: 'planets' | 'moons';
            currentIndex: number;
            total: number;
        }
        ;
}

export async function importData(data: V2Export, progressCallback?: (info: ImportCallbackInfo) => void): Promise<void> {
    const globalDb = await getGlobalDatabase();
    const globalTx = globalDb.transaction(['settings', 'accounts', 'servers'], 'readwrite');

    if (data.settings != null) {
        progressCallback?.({ type: 'importing-settings' });
        await globalTx.objectStore('settings').put(data.settings, 0);
    }

    progressCallback?.({ type: 'importing-basic-accounts-and-servers' });
    for (const account of data.accounts) {
        const existingAcc = await globalTx.objectStore('accounts').get([account.serverId, account.language, account.playerId]);
        const linkedAccounts = existingAcc?.linkedAccounts ?? [];
        for (const linkedAcc of account.linkedAccounts ?? []) {
            if (linkedAccounts.some(acc =>
                acc.id == linkedAcc.playerId
                && acc.serverId == linkedAcc.serverId
                && acc.serverLanguage == linkedAcc.language
            )) {
                continue;
            }

            linkedAccounts.push({
                id: linkedAcc.playerId,
                serverId: linkedAcc.serverId,
                serverLanguage: linkedAcc.language,
            });
        }

        await globalTx.objectStore('accounts').put({
            serverId: account.serverId,
            serverLanguage: account.language,
            id: account.playerId,
            name: account.playerName,
            linkedAccounts,
        });
    }
    for (const server of data.servers) {
        await globalTx.objectStore('servers').put({
            id: server.serverId,
            language: server.language,
            name: server.name,
        });
    }
    await globalTx.done;


    for (let i = 0; i < data.accounts.length; i++) {
        progressCallback?.({
            type: 'importing-account',
            currentIndex: i,
            total: data.accounts.length,
            step: { type: 'account' },
        });
        
        const account = data.accounts[i];
        const db = await getPlayerDatabase({
            ...account,
            userLanguage: 'doesnt-really-matter',
        });
        const tx = db.transaction(['combatReports', 'debrisFieldReports', 'expeditions', 'lifeformDiscoveries', 'empire', 'universeSpecificSettings'], 'readwrite');

        const combatReportStore = tx.objectStore('combatReports');
        for (let j = 0; j < account.combatReports.length; j++) {
            progressCallback?.({
                type: 'importing-account',
                currentIndex: i,
                total: data.accounts.length,
                step: { 
                    type: 'combat-reports',
                    currentIndex: j,
                    total: account.combatReports.length,
                 },
            });
            
            const combatReport = account.combatReports[j];
            await combatReportStore.put(combatReport);
        }

        const expeditionStore = tx.objectStore('expeditions');
        for (let j = 0; j < account.expeditions.length; j++) {
            progressCallback?.({
                type: 'importing-account',
                currentIndex: i,
                total: data.accounts.length,
                step: { 
                    type: 'expeditions',
                    currentIndex: j,
                    total: account.expeditions.length,
                 },
            });
            
            const expedition = account.expeditions[j];
            await expeditionStore.put(expedition);
        }

        const debrisFieldReportStore = tx.objectStore('debrisFieldReports');
        for (let j = 0; j < account.debrisFieldReports.length; j++) {
            progressCallback?.({
                type: 'importing-account',
                currentIndex: i,
                total: data.accounts.length,
                step: { 
                    type: 'debris-fields',
                    currentIndex: j,
                    total: account.debrisFieldReports.length,
                 },
            });
            
            const debrisFieldReport = account.debrisFieldReports[j];
            await debrisFieldReportStore.put(debrisFieldReport);
        }

        const lifeformDiscoveryStore = tx.objectStore('lifeformDiscoveries');
        const discoveries = account.lifeformDiscoveries ?? []; 
        for (let j = 0; j < discoveries.length; j++) {
            progressCallback?.({
                type: 'importing-account',
                currentIndex: i,
                total: data.accounts.length,
                step: { 
                    type: 'lifeform-discoveries',
                    currentIndex: j,
                    total: discoveries.length,
                 },
            });
            
            const discovery = discoveries[j];
            await lifeformDiscoveryStore.put(discovery);
        }

        if (account.universeSpecificSettings != null) {
            progressCallback?.({
                type: 'importing-account',
                currentIndex: i,
                total: data.accounts.length,
                step: { type: 'universe-specific-settings' },
            });

            await tx.objectStore('universeSpecificSettings').put(account.universeSpecificSettings, 0);
        }

        progressCallback?.({
            type: 'importing-account',
            currentIndex: i,
            total: data.accounts.length,
            step: { 
                type: 'empire',
                subtype: 'empire-data',
            },
        });
        const empireStore = tx.objectStore('empire');
        await empireStore.put(account.empire.allianceClass, 'allianceClass');
        await empireStore.put(account.empire.playerClass, 'playerClass');
        await empireStore.put(account.empire.research, 'research');

        if (account.empire.lifeformExperience != null) {
            await empireStore.put(account.empire.lifeformExperience, 'lifeformExperience');
        }
        if (account.empire.planetOrder != null) {
            await empireStore.put(account.empire.planetOrder, 'planetOrder');
        }
        if (account.empire.officers != null) {
            await empireStore.put(account.empire.officers, 'officers');
        }

        for(let j = 0; j < account.empire.planets.length; j++) {
            progressCallback?.({
                type: 'importing-account',
                currentIndex: i,
                total: data.accounts.length,
                step: { 
                    type: 'empire',
                    subtype: 'planets',
                    currentIndex: j,
                    total: account.empire.planets.length,
                },
            });

            const planet = account.empire.planets[j];

            const basicData: DbBasicPlanetData = {
                id: planet.id,
                coordinates: planet.coordinates,
                maxTemperature: planet.maxTemperature,
                name: planet.name,
            };
            await empireStore.put(basicData, `planet.${planet.id}`);

            await empireStore.put(planet.buildings, `planet.${planet.id}.buildings`);
            await empireStore.put(planet.productionSettings, `planet.${planet.id}.productionSettings`);
            await empireStore.put(planet.activeItems, `planet.${planet.id}.activeItems`);
            await empireStore.put(planet.defenses, `planet.${planet.id}.defenses`);
            await empireStore.put(planet.ships, `planet.${planet.id}.ships`);


            if (planet.activeLifeform != null) {
                await empireStore.put(planet.activeLifeform, `planet.${planet.id}.lifeform`);
            }
            if (planet.lifeformBuildings != null) {
                await empireStore.put(planet.lifeformBuildings, `planet.${planet.id}.lifeformBuildings`);
            }
            if (planet.lifeformTechnologies != null) {
                await empireStore.put(planet.lifeformTechnologies, `planet.${planet.id}.lifeformTechnologies`);
            }
            if (planet.activeLifeformTechnologies != null) {
                await empireStore.put(planet.activeLifeformTechnologies, `planet.${planet.id}.activeLifeformTechnologies`);
            }
        }

        for(let j = 0; j < account.empire.moons.length; j++) {
            progressCallback?.({
                type: 'importing-account',
                currentIndex: i,
                total: data.accounts.length,
                step: { 
                    type: 'empire',
                    subtype: 'moons',
                    currentIndex: j,
                    total: account.empire.moons.length,
                },
            });

            const moon = account.empire.moons[j];

            const basicData: DbBasicMoonData = {
                id: moon.id,
                coordinates: moon.coordinates,
                name: moon.name,
            };
            await empireStore.put(basicData, `moon.${moon.id}`);

            await empireStore.put(moon.buildings, `moon.${moon.id}.buildings`);
            await empireStore.put(moon.activeItems, `moon.${moon.id}.activeItems`);
            await empireStore.put(moon.defenses, `moon.${moon.id}.defenses`);
            await empireStore.put(moon.ships, `moon.${moon.id}.ships`);
        }

        await tx.done;
    }


    for (let i = 0; i < data.servers.length; i++) {
        const server = data.servers[i];
        const history = server.universeHistory;
        if (history == null) {
            continue;
        }

        const db = await getUniverseHistoryDatabase({
            language: server.language,
            serverId: server.serverId,
            playerId: 0,
            userLanguage: 'doesnt-really-matter',
        });
        const tx = db.transaction([
            '_lastUpdate',
            'players', 'playerNames', 'playerAlliances', 'playerStates', 'playerScores',
            'alliances', 'allianceTags', 'allianceNames', 'allianceMembers', 'allianceStates', 'allianceScores',
            'planets', 'planetNames', 'planetStates', 'planetCoordinates',
            'moons', 'moonNames', 'moonStates'
        ], 'readwrite');

        await tx.objectStore('_lastUpdate').put(history._lastUpdate, 0);

        const stores: (StoreNames<OgameTrackerUniverseHistoryDbSchema> & Exclude<keyof V2ExportedUniverseHistory, '_lastUpdate'>)[] = [
            'players',
            'playerNames',
            'playerAlliances',
            'playerStates',
            'playerScores',
            'alliances',
            'allianceTags',
            'allianceNames',
            'allianceMembers',
            'allianceStates',
            'allianceScores',
            'planets',
            'planetNames',
            'planetStates',
            'planetCoordinates',
            'moons',
            'moonNames',
            'moonStates',
        ];

        const totalEntries = stores
            .map(name => history[name].length)
            .reduce((acc, cur) => acc + cur, 0);
        let currentEntryIndex = 0;
        
        for (const storeName of stores) {            
            const store = tx.objectStore(storeName);
            const entries = history[storeName];

            for (const entry of entries) {
                progressCallback?.({
                    type: 'importing-universe-history',
                    currentIndex: i,
                    total: data.servers.length,
                    subIndex: currentEntryIndex,
                    subTotal: totalEntries,
                });

                await store.put(entry);

                currentEntryIndex++;
            }
        }

        await tx.done;
    }

    for (let i = 0; i < data.servers.length; i++) {
        const server = data.servers[i];
        
        progressCallback?.({
            type: 'importing-server-settings',
            currentIndex: i,
            total: data.servers.length,
        });

        if (server.serverSettings == null) {
            continue;
        }

        const db = await getServerDatabase({
            language: server.language,
            serverId: server.serverId,
            playerId: 0,
            userLanguage: 'doesnt-really-matter',
        });
        const tx = db.transaction('serverSettings', 'readwrite');

        const store = tx.objectStore('serverSettings');
        for (const entry of Object.entries(server.serverSettings)) {
            const [key, value] = entry;
            await store.put(value, key as (keyof DbServerSettings));
        }

        await tx.done;
    }
}
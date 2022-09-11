import { getGlobalDatabase, getPlayerDatabase, getUniverseHistoryDatabase } from "@/shared/db/access";
import { OgameTrackerUniverseHistoryDbSchema } from "@/shared/db/schema";
import { DbBasicMoonData, DbBasicPlanetData } from "@/shared/db/schema/player";
import { StoreNames } from "idb";
import { V2Export, V2ExportedUniverseHistory } from ".";

export type ImportCallbackInfo = (
    | { type: 'importing-settings' }
    | { type: 'importing-basic-accounts-and-servers' }
    | { type: 'importing-account'; currentIndex: number; total: number; }
    | { type: 'importing-universe-history'; currentIndex: number; total: number; }
);

export async function importData(data: V2Export, progressCallback?: (info: ImportCallbackInfo) => void): Promise<void> {
    const globalDb = await getGlobalDatabase();
    const globalTx = globalDb.transaction(['settings', 'accounts', 'servers'], 'readwrite');

    if (data.settings != null) {
        progressCallback?.({ type: 'importing-settings' });
        await globalTx.objectStore('settings').put(data.settings, 0);
    }

    progressCallback?.({ type: 'importing-basic-accounts-and-servers' });
    for (const account of data.accounts) {
        await globalTx.objectStore('accounts').put({
            serverId: account.serverId,
            serverLanguage: account.language,
            id: account.playerId,
            name: account.playerName,
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
        const account = data.accounts[i];
        progressCallback?.({
            type: 'importing-account',
            currentIndex: i,
            total: data.accounts.length,
        });

        const db = await getPlayerDatabase(account);
        const tx = db.transaction(['combatReports', 'debrisFieldReports', 'expeditions', 'lifeformDiscoveries', 'empire', 'universeSpecificSettings'], 'readwrite');

        const combatReportStore = tx.objectStore('combatReports');
        for (const combatReport of account.combatReports) {
            await combatReportStore.put(combatReport);
        }

        const expeditionStore = tx.objectStore('expeditions');
        for (const expedition of account.expeditions) {
            await expeditionStore.put(expedition);
        }

        const debrisFieldReportStore = tx.objectStore('debrisFieldReports');
        for (const debrisFieldReport of account.debrisFieldReports) {
            await debrisFieldReportStore.put(debrisFieldReport);
        }

        const lifeformDiscoveryStore = tx.objectStore('lifeformDiscoveries');
        for (const discovery of (account.lifeformDiscoveries ?? [])) {
            await lifeformDiscoveryStore.put(discovery);
        }

        if (account.universeSpecificSettings != null) {
            await tx.objectStore('universeSpecificSettings').put(account.universeSpecificSettings, 0);
        }

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

        for (const planet of account.empire.planets) {
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

        for (const moon of account.empire.moons) {
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
        progressCallback?.({
            type: 'importing-universe-history',
            currentIndex: i,
            total: data.servers.length,
        });

        const history = server.universeHistory;
        if (history == null) {
            continue;
        }

        const db = await getUniverseHistoryDatabase({
            language: server.language,
            serverId: server.serverId,
            playerId: 0,
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
        for (const storeName of stores) {
            const store = tx.objectStore(storeName);
            const entries = history[storeName];

            for (const entry of entries) {
                await store.put(entry);
            }
        }

        await tx.done;
    }
}
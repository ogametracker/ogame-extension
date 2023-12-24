import { getUniverseHistoryDatabase } from '@/shared/db/access';
import { OgameTrackerUniverseHistoryAllianceMembers, OgameTrackerUniverseHistoryAllianceName, OgameTrackerUniverseHistoryAllianceScore, OgameTrackerUniverseHistoryAllianceTag, OgameTrackerUniverseHistoryDbSchema, OgameTrackerUniverseHistoryMoonName, OgameTrackerUniverseHistoryMoonState, OgameTrackerUniverseHistoryPlanetCoordinates, OgameTrackerUniverseHistoryPlanetName, OgameTrackerUniverseHistoryPlanetState, OgameTrackerUniverseHistoryPlayerAlliance, OgameTrackerUniverseHistoryPlayerName, OgameTrackerUniverseHistoryPlayerScore, OgameTrackerUniverseHistoryPlayerState } from '@/shared/db/schema/universe-history';
import { parseIntSafe } from '@/shared/utils/parseNumbers';
import { StoreNames } from 'idb';
import { Component, Vue } from 'vue-property-decorator';
import { GlobalOgameMetaData } from './global';

export interface UniverseHistoryPlayer {
    id: number;
    name: string;
}

export interface UniverseHistoryAlliance {
    id: number;
    tag: string;
    name: string;
}

export interface UniverseHistoryPlanetHistory {
    playerId: number;
    id: number;
    names: OgameTrackerUniverseHistoryPlanetName[];
    coordinates: OgameTrackerUniverseHistoryPlanetCoordinates[];
    states: OgameTrackerUniverseHistoryPlanetState[];

    moons: UniverseHistoryMoonHistory[];
}

export interface UniverseHistoryMoonHistory {
    id: number;
    size: number;
    names: OgameTrackerUniverseHistoryMoonName[];
    states: OgameTrackerUniverseHistoryMoonState[];
}

@Component
class UniverseHistoryDataModuleClass extends Vue {
    private _ready!: Promise<void>;
    private _resolveReady!: () => void;

    public get ready(): Promise<void> {
        return this._ready;
    }

    public readonly players: UniverseHistoryPlayer[] = [];
    public readonly alliances: UniverseHistoryAlliance[] = [];

    private async created() {
        this._ready = new Promise<void>(resolve => this._resolveReady = resolve);

        await this.loadPlayers();
        await this.loadAlliances();

        this._resolveReady();
    }

    private async loadPlayers() {
        const db = await getUniverseHistoryDatabase(GlobalOgameMetaData);
        const tx = db.transaction('playerNames', 'readonly');
        const store = tx.objectStore('playerNames');

        const playerNames: Record<number, string> = {};
        const playerNameUpdates: Record<number, number> = {};
        let cursor = await store.openCursor();
        while (cursor != null) {
            const { playerId, name, date } = cursor.value;
            if (playerId in playerNameUpdates && playerNameUpdates[playerId] >= date) {
                cursor = await cursor.continue();
                continue;
            }

            playerNames[playerId] = name;
            playerNameUpdates[playerId] = date;

            cursor = await cursor.continue();
        }

        const players = Object.keys(playerNames)
            .map(pid => parseIntSafe(pid, 10))
            .map<UniverseHistoryPlayer>(id => ({
                id,
                name: playerNames[id],
            }));
        this.players.push(...players);
    }

    private async loadAlliances() {
        const db = await getUniverseHistoryDatabase(GlobalOgameMetaData);
        const tx = db.transaction(['allianceNames', 'allianceTags'], 'readonly');

        const nameStore = tx.objectStore('allianceNames');
        const allianceNames: Record<number, string> = {};
        const allianceNameUpdates: Record<number, number> = {};
        let nameCursor = await nameStore.openCursor();
        while (nameCursor != null) {
            const { allianceId, name, date } = nameCursor.value;
            if (allianceId in allianceNameUpdates && allianceNameUpdates[allianceId] >= date) {
                nameCursor = await nameCursor.continue();
                continue;
            }

            allianceNames[allianceId] = name;
            allianceNameUpdates[allianceId] = date;

            nameCursor = await nameCursor.continue();
        }

        const tagStore = tx.objectStore('allianceTags');
        const allianceTags: Record<number, string> = {};
        const allianceTagUpdates: Record<number, number> = {};
        let tagCursor = await tagStore.openCursor();
        while (tagCursor != null) {
            const { allianceId, tag, date } = tagCursor.value;
            if (allianceId in allianceTagUpdates && allianceTagUpdates[allianceId] >= date) {
                tagCursor = await tagCursor.continue();
                continue;
            }

            allianceTags[allianceId] = tag;
            allianceTagUpdates[allianceId] = date;

            tagCursor = await tagCursor.continue();
        }

        const alliances = Object.keys(allianceNames)
            .map(aid => parseIntSafe(aid, 10))
            .map<UniverseHistoryAlliance>(id => ({
                id,
                name: allianceNames[id],
                tag: allianceTags[id],
            }));
        this.alliances.push(...alliances);
    }


    public async getPlayerScoreHistory(playerIds: number[]): Promise<OgameTrackerUniverseHistoryPlayerScore[]> {
        const scores: OgameTrackerUniverseHistoryPlayerScore[] = [];

        const db = await getUniverseHistoryDatabase(GlobalOgameMetaData);
        const tx = db.transaction('playerScores', 'readonly');
        const store = tx.objectStore('playerScores');
        const index = store.index('playerId');

        for (const playerId of playerIds) {
            let cursor = await index.openCursor(playerId);

            while (cursor != null) {
                scores.push(cursor.value);
                cursor = await cursor.continue();
            }
        }

        return scores.sort((a, b) => a.date - b.date);
    }

    public async getPlayerAllianceHistory(playerId: number): Promise<OgameTrackerUniverseHistoryPlayerAlliance[]> {
        const states: OgameTrackerUniverseHistoryPlayerAlliance[] = [];

        const db = await getUniverseHistoryDatabase(GlobalOgameMetaData);
        const tx = db.transaction('playerAlliances', 'readonly');
        const store = tx.objectStore('playerAlliances');
        const index = store.index('playerId');

        let cursor = await index.openCursor(playerId);

        while (cursor != null) {
            states.push(cursor.value);
            cursor = await cursor.continue();
        }

        return states.sort((a, b) => a.date - b.date);
    }

    public async getPlayerNameHistory(playerId: number): Promise<OgameTrackerUniverseHistoryPlayerName[]> {
        const states: OgameTrackerUniverseHistoryPlayerName[] = [];

        const db = await getUniverseHistoryDatabase(GlobalOgameMetaData);
        const tx = db.transaction('playerNames', 'readonly');
        const store = tx.objectStore('playerNames');
        const index = store.index('playerId');

        let cursor = await index.openCursor(playerId);

        while (cursor != null) {
            states.push(cursor.value);
            cursor = await cursor.continue();
        }

        return states.sort((a, b) => a.date - b.date);
    }

    public async getPlayerStateHistory(playerId: number): Promise<OgameTrackerUniverseHistoryPlayerState[]> {
        const states: OgameTrackerUniverseHistoryPlayerState[] = [];

        const db = await getUniverseHistoryDatabase(GlobalOgameMetaData);
        const tx = db.transaction('playerStates', 'readonly');
        const store = tx.objectStore('playerStates');
        const index = store.index('playerId');

        let cursor = await index.openCursor(playerId);

        while (cursor != null) {
            states.push(cursor.value);
            cursor = await cursor.continue();
        }

        return states.sort((a, b) => a.date - b.date);
    }

    public async getNumberOfTotalEntries(): Promise<number> {
        const db = await getUniverseHistoryDatabase(GlobalOgameMetaData);

        const totalCount = await db.count('allianceMembers')
            + await db.count('allianceNames')
            + await db.count('allianceScores')
            + await db.count('allianceStates')
            + await db.count('allianceTags')
            + await db.count('alliances')

            + await db.count('moonNames')
            + await db.count('moonStates')
            + await db.count('moons')

            + await db.count('planetCoordinates')
            + await db.count('planetNames')
            + await db.count('planetStates')
            + await db.count('planets')

            + await db.count('playerAlliances')
            + await db.count('playerNames')
            + await db.count('playerScores')
            + await db.count('playerStates')
            + await db.count('players');

        return totalCount;
    }


    public async getAllianceScoreHistory(allianceIds: number[]): Promise<OgameTrackerUniverseHistoryAllianceScore[]> {
        const scores: OgameTrackerUniverseHistoryAllianceScore[] = [];

        const db = await getUniverseHistoryDatabase(GlobalOgameMetaData);
        const tx = db.transaction('allianceScores', 'readonly');
        const store = tx.objectStore('allianceScores');
        const index = store.index('allianceId');

        for (const allyId of allianceIds) {
            let cursor = await index.openCursor(allyId);

            while (cursor != null) {
                scores.push(cursor.value);
                cursor = await cursor.continue();
            }
        }

        return scores.sort((a, b) => a.date - b.date);
    }

    public async deleteCurrentServer(): Promise<void> {
        const db = await getUniverseHistoryDatabase(GlobalOgameMetaData);
        const storeNames: StoreNames<OgameTrackerUniverseHistoryDbSchema>[] = [
            '_lastUpdate',
            'allianceMembers', 'allianceNames', 'allianceScores', 'allianceStates', 'allianceTags', 'alliances',
            'moonNames', 'moonStates', 'moons',
            'planetCoordinates', 'planetNames', 'planetStates', 'planets',
            'playerAlliances', 'playerNames', 'playerScores', 'playerStates', 'players'
        ];
        const tx = db.transaction(storeNames, 'readwrite');

        for (const storeName of storeNames) {
            const store = tx.objectStore(storeName);
            await store.clear();
        }
    }

    public async getPlayerPlanetsAndMoonsHistory(playerId: number): Promise<UniverseHistoryPlanetHistory[]> {
        const db = await getUniverseHistoryDatabase(GlobalOgameMetaData);
        const storeNames: (StoreNames<OgameTrackerUniverseHistoryDbSchema> & (`${'planet' | 'moon'}${string}`))[] = [
            'planetCoordinates', 'planetNames', 'planetStates', 'planets',
            'moonNames', 'moonStates', 'moons',
        ];
        const tx = db.transaction(storeNames, 'readonly');

        const planetHistories: UniverseHistoryPlanetHistory[] = [];

        const planetStore = tx.objectStore('planets');
        const playerPlanets = await planetStore.index('playerId').getAll(playerId);

        for (const planet of playerPlanets) {
            const planetCoordinatesHistory = await tx.objectStore('planetCoordinates').index('planetId').getAll(planet.id);
            const planetNameHistory = await tx.objectStore('planetNames').index('planetId').getAll(planet.id);
            const planetStateHistory = await tx.objectStore('planetStates').index('planetId').getAll(planet.id);

            const planetHistory: UniverseHistoryPlanetHistory = {
                id: planet.id,
                playerId: planet.playerId,
                coordinates: planetCoordinatesHistory,
                names: planetNameHistory,
                states: planetStateHistory,
                moons: [],
            };

            const moons = await tx.objectStore('moons').index('planetId').getAll(planet.id);
            for (const moon of moons) {
                const moonNameHistory = await tx.objectStore('moonNames').index('moonId').getAll(moon.id);
                const moonStateHistory = await tx.objectStore('moonStates').index('moonId').getAll(moon.id);

                const moonHistory: UniverseHistoryMoonHistory = {
                    id: moon.id,
                    size: moon.size,
                    names: moonNameHistory,
                    states: moonStateHistory,
                };
                planetHistory.moons.push(moonHistory);
            }

            planetHistories.push(planetHistory);
        }

        return planetHistories;
    }

    public async getAllianceTagHistory(allianceId: number): Promise<OgameTrackerUniverseHistoryAllianceTag[]> {
        const tags: OgameTrackerUniverseHistoryAllianceTag[] = [];

        const db = await getUniverseHistoryDatabase(GlobalOgameMetaData);
        const tx = db.transaction('allianceTags', 'readonly');
        const store = tx.objectStore('allianceTags');
        const index = store.index('allianceId');

        let cursor = await index.openCursor(allianceId);

        while (cursor != null) {
            tags.push(cursor.value);
            cursor = await cursor.continue();
        }

        return tags.sort((a, b) => a.date - b.date);
    }

    public async getAllianceNameHistory(allianceId: number): Promise<OgameTrackerUniverseHistoryAllianceName[]> {
        const names: OgameTrackerUniverseHistoryAllianceName[] = [];

        const db = await getUniverseHistoryDatabase(GlobalOgameMetaData);
        const tx = db.transaction('allianceNames', 'readonly');
        const store = tx.objectStore('allianceNames');
        const index = store.index('allianceId');

        let cursor = await index.openCursor(allianceId);

        while (cursor != null) {
            names.push(cursor.value);
            cursor = await cursor.continue();
        }

        return names.sort((a, b) => a.date - b.date);
    }

    public async getAllianceMemberHistory(allianceId: number): Promise<OgameTrackerUniverseHistoryAllianceMembers[]> {
        const members: OgameTrackerUniverseHistoryAllianceMembers[] = [];

        const db = await getUniverseHistoryDatabase(GlobalOgameMetaData);
        const tx = db.transaction('allianceMembers', 'readonly');
        const store = tx.objectStore('allianceMembers');
        const index = store.index('allianceId');

        let cursor = await index.openCursor(allianceId);

        while (cursor != null) {
            members.push(cursor.value);
            cursor = await cursor.continue();
        }

        return members.sort((a, b) => a.date - b.date);
    }

    public async getLatestPlayerNamesById(): Promise<Record<number, string>> {
        const players: Record<number, string> = {};

        const db = await getUniverseHistoryDatabase(GlobalOgameMetaData);
        const tx = db.transaction(['playerNames', 'players'], 'readonly');

        const playerStore = tx.objectStore('players');
        const playerIds = await playerStore.getAll();

        const playerNameStore = tx.objectStore('playerNames');
        const index = playerNameStore.index('playerId');

        for(const player of playerIds) {
            const cursor = await index.openCursor(player.id, 'prev');
            if(cursor == null) {
                players[player.id] = player.id.toString();
                console.warn(`failed to open cursor for player ${player.id}`);
                continue;
            }
            const { playerId, name } = cursor.value;
            players[playerId] = name;
        }

        return players;
    }
}

export const UniverseHistoryDataModule = new UniverseHistoryDataModuleClass();
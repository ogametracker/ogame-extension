import { broadcastMessage } from "@/shared/communication/broadcastMessage";
import { getGlobalDatabase, getUniverseHistoryDatabase } from "@/shared/db/access";
import { OgameTrackerUniverseHistoryDbSchema } from "@/shared/db/schema";
import { DbUniverseHistoryAllianceState, DbUniverseHistoryCoordinates, DbUniverseHistoryPlanetMoonState, DbUniverseHistoryPlayerState, DbUniverseHistoryPlayerStateItem, DbUniverseHistoryScoreType } from "@/shared/db/schema/universe-history";
import { LanguageKey } from "@/shared/i18n/LanguageKey";
import { MessageOgameMeta } from "@/shared/messages/Message";
import { MessageType } from "@/shared/messages/MessageType";
import { NotifyUniverseHistoryUpdateMessage } from "@/shared/messages/tracking/universe-history";
import { Coordinates } from "@/shared/models/ogame/common/Coordinates";
import { getDefaultSettings } from "@/shared/models/settings/getDefaultSettings";
import { loadSettings } from "@/shared/models/settings/loadSettings";
import { Settings } from "@/shared/models/settings/Settings";
import { mergeDeep } from "@/shared/utils/mergeDeep";
import { parseCoordinates } from "@/shared/utils/parseCoordinates";
import { parseIntSafe } from "@/shared/utils/parseNumbers";
import { _log, _logDebug } from "@/shared/utils/_log";
import { _throw } from "@/shared/utils/_throw";
import { serviceWorkerUuid } from "@/shared/uuid";
import { addDays, startOfDay } from "date-fns";
import { XMLParser } from "fast-xml-parser";
import { IDBPTransaction, StoreNames } from "idb";

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace OgameApi {
    export interface Response {
        timestamp: string;
        serverId: string;
    }
    export interface PlayersXml extends Response {
        players: Players;
    }
    export interface Players {
        player: Player[];
    }
    export interface Player {
        id: string;
        name: string;
        status?: string;
        alliance?: string;
    }

    export interface AllianceXml extends Response {
        alliances: Alliances;
    }
    export interface Alliances {
        alliance: Alliance[];
    }
    export interface Alliance {
        id: string;
        tag: string;
        name: string;
    }

    export interface UniverseXml extends Response {
        universe: Universe;
    }
    export interface Universe {
        planet: Planet[];
    }
    export interface Planet {
        id: string;
        name: string;
        player: string;
        coords: string;
        moon?: Moon;
    }
    export interface Moon {
        id: string;
        name: string;
        size: string;
    }

    export interface HighscoreXml extends Response {
        highscore: Highscore;
    }
    export interface Highscore {
        player: PlayerScore[];
    }
    export interface PlayerScore {
        id: string;
        score: string;
        position: string;
        ships?: string;
    }
}

interface Player {
    id: number;
    name: string;
    status: string | null;
    alliance: number | null;
}

interface Alliance {
    id: number;
    tag: string;
    name: string;
}

interface ScorePosition {
    score: number;
    position: number;
}

interface PlayerScorePositions {
    total: ScorePosition;
    economy: ScorePosition;
    research: ScorePosition;
    military: ScorePosition;
    militaryBuilt: ScorePosition;
    militaryDestroyed: ScorePosition;
    militaryLost: ScorePosition;
    honor: ScorePosition;
    numberOfShips: ScorePosition;
}

enum HighscoreType {
    total = 0,
    economy = 1,
    research = 2,
    militaryAndNumberOfShips = 3,
    militaryLost = 4,
    militaryBuilt = 5,
    militaryDestroyed = 6,
    honor = 7,
}

interface Planet {
    id: number;
    player: number;
    name: string;
    coordinates: Coordinates;
    moon?: Moon;
}

interface Moon {
    id: number;
    name: string;
    size: number;
    planetId: number;
}


type UniverseHistoryDbStoreName = StoreNames<OgameTrackerUniverseHistoryDbSchema>;
type UniverseHistoryDbTransaction = IDBPTransaction<OgameTrackerUniverseHistoryDbSchema, StoreNames<OgameTrackerUniverseHistoryDbSchema>[], 'readwrite'>;

export class UniverseHistoryModule {

    private enabled = false;
    private updateTimes: number[] = [];

    private readonly parser = new XMLParser({
        attributeNamePrefix: '',
        ignoreAttributes: false,
        parseAttributeValue: false,
    });

    private readonly meta: MessageOgameMeta;
    private timeout: number | undefined = undefined;

    constructor(meta: MessageOgameMeta) {
        this.meta = meta;
    }

    public async init() {
        await this.initSettings();

        if(!this.enabled) {
            _logDebug('universe history tracking is disabled');
            clearTimeout(this.timeout);
            return;
        }

        await this.initTracking();
    }

    private async initSettings() {
        const settings = await loadSettings('__internal__' as LanguageKey);
        
        this.enabled = settings.universeHistory.enabled;
        this.updateTimes = [...settings.universeHistory.updateTimes];
    }

    private async initTracking() {
        const db = await getUniverseHistoryDatabase(this.meta);
        const lastUpdate = (await db.get('_lastUpdate', 0)) ?? 0;
        const now = Date.now();
        const nextUpdates: number[] = [];
        if (lastUpdate == 0) {
            nextUpdates.push(now);
        } else {
            let day = startOfDay(lastUpdate).getTime();
            let i = 0;
            while (nextUpdates.length == 0 || nextUpdates[nextUpdates.length - 1] < now) {
                const updateTime = day + this.updateTimes[i];
                if (updateTime > lastUpdate) {
                    nextUpdates.push(updateTime);
                }

                i++;
                if (i >= this.updateTimes.length) {
                    i = 0;
                    day = addDays(day, 1).getTime();
                }
            }
        }

        const nextUpdate = nextUpdates.length == 1
            ? nextUpdates[0]
            : nextUpdates.find((_, i) => nextUpdates[i + 1] >= now) ?? _throw('failed to find next update time for universe history');
        const timeLeft = Math.max(0, nextUpdate - now);
        _logDebug(`next universe history tracking in ${timeLeft} ms (${new Date(Date.now() + timeLeft)}) for universe ${this.meta.serverId} ${this.meta.language.toUpperCase()}`);

        clearTimeout(this.timeout);
        this.timeout = setTimeout(async () => await this.trackUniverseUpdates(), timeLeft);
    }

    private async trackUniverseUpdates() {
        try {
            _logDebug(`tracking universe history for universe ${this.meta.serverId} ${this.meta.language.toUpperCase()}`);
            const players = await this.getPlayers();
            const alliances = await this.getAlliances();
            const playerScores = await this.getAllPlayerScores();
            const planets = await this.getPlanets();

            _logDebug('loaded current states, updating in db (this may take a while)');
            const db = await getUniverseHistoryDatabase(this.meta);
            const allStoreNames: UniverseHistoryDbStoreName[] = [
                '_lastUpdate',

                'players',
                'playerNames',
                'playerAlliances',
                'playerStates',
                'playerScores',

                'planets',
                'planetNames',
                'planetStates',
                'planetCoordinates',

                'moons',
                'moonNames',
                'moonStates',

                'alliances',
                'allianceTags',
                'allianceNames',
                'allianceMembers',
                'allianceStates',
                'allianceScores',
            ];
            const tx: UniverseHistoryDbTransaction = db.transaction(allStoreNames, 'readwrite');
            await this.updateHistory(tx, players, alliances, playerScores, planets);
            await tx.done;
            _logDebug('updated universe history');

            const notificationMessage: NotifyUniverseHistoryUpdateMessage = {
                ogameMeta: this.meta,
                senderUuid: serviceWorkerUuid,
                type: MessageType.NotifyUniverseHistoryUpdate,
            };
            await broadcastMessage(notificationMessage);

            await this.initTracking();
        } catch (error) {
            setTimeout(async () => await this.initTracking(), 1000 * 60 * 5); // try in 5min again on error
        }
    }

    private async updateHistory(tx: UniverseHistoryDbTransaction, players: Player[], alliances: Alliance[], playerScores: Partial<Record<number, PlayerScorePositions>>, planets: Planet[]): Promise<void> {
        const now = Date.now();

        await this.updatePlayers(tx, players, now, playerScores);
        await this.updateAlliances(tx, alliances, now, players, playerScores);
        await this.updatePlanets(tx, planets, now);

        await tx.objectStore('_lastUpdate').put(now, 0);
    }

    private async updateAlliances(tx: UniverseHistoryDbTransaction, alliances: Alliance[], now: number, players: Player[], playerScores: Partial<Record<number, PlayerScorePositions>>) {
        _logDebug('updating alliance history');

        await this.updateKnownAlliances(tx, alliances);
        await this.updateAllianceTags(tx, alliances, now);
        await this.updateAllianceNames(tx, alliances, now);
        await this.updateAllianceMembers(tx, alliances, players, now);
        await this.updateAllianceStates(tx, alliances, now);
        await this.updateAllianceScores(tx, alliances, players, playerScores, now);
    }

    private async updateKnownAlliances(tx: UniverseHistoryDbTransaction, alliances: Alliance[]) {
        for (const ally of alliances) {
            await tx.objectStore('alliances').put({ id: ally.id });
        }
    }

    private async updateAllianceTags(tx: UniverseHistoryDbTransaction, alliances: Alliance[], now: number) {
        const lastTags: Partial<Record<number, string>> = {};
        const lastTagUpdates: Partial<Record<number, number>> = {};

        const store = tx.objectStore('allianceTags');
        let cursor = await store.openCursor();
        while (cursor != null) {
            const dbValue = cursor.value;

            const isNewer = (lastTagUpdates[dbValue.allianceId] ?? -1) < dbValue.date;
            if (isNewer) {
                lastTagUpdates[dbValue.allianceId] = dbValue.date;
                lastTags[dbValue.allianceId] = dbValue.tag;
            }

            cursor = await cursor.continue();
        }

        for (const ally of alliances) {
            if (ally.tag == lastTags[ally.id]) {
                continue;
            }

            await store.put({
                allianceId: ally.id,
                date: now,
                tag: ally.tag,
            });
        }
    }

    private async updateAllianceNames(tx: UniverseHistoryDbTransaction, alliances: Alliance[], now: number) {
        const lastNames: Partial<Record<number, string>> = {};
        const lastNameUpdates: Partial<Record<number, number>> = {};

        const store = tx.objectStore('allianceNames');
        let cursor = await store.openCursor();
        while (cursor != null) {
            const dbValue = cursor.value;

            const isNewer = (lastNameUpdates[dbValue.allianceId] ?? -1) < dbValue.date;
            if (isNewer) {
                lastNameUpdates[dbValue.allianceId] = dbValue.date;
                lastNames[dbValue.allianceId] = dbValue.name;
            }

            cursor = await cursor.continue();
        }

        for (const ally of alliances) {
            if (ally.name == lastNames[ally.id]) {
                continue;
            }

            await store.put({
                allianceId: ally.id,
                date: now,
                name: ally.name,
            });
        }
    }

    private async updateAllianceMembers(tx: UniverseHistoryDbTransaction, alliances: Alliance[], players: Player[], now: number) {
        const lastMembers: Partial<Record<number, number[]>> = {};
        const lastMemberUpdates: Partial<Record<number, number>> = {};

        const store = tx.objectStore('allianceMembers');
        let cursor = await store.openCursor();
        while (cursor != null) {
            const dbValue = cursor.value;

            const isNewer = (lastMemberUpdates[dbValue.allianceId] ?? -1) < dbValue.date;
            if (isNewer) {
                lastMemberUpdates[dbValue.allianceId] = dbValue.date;
                lastMembers[dbValue.allianceId] = dbValue.members;
            }

            cursor = await cursor.continue();
        }

        for (const ally of alliances) {
            const members = players.filter(p => p.alliance == ally.id).map(p => p.id);

            if (this.arraysEqual(members, lastMembers[ally.id] ?? [])) {
                continue;
            }

            await store.put({
                allianceId: ally.id,
                date: now,
                members,
            });
        }
    }

    private async updateAllianceStates(tx: UniverseHistoryDbTransaction, alliances: Alliance[], now: number) {
        const lastStates: Partial<Record<number, DbUniverseHistoryAllianceState>> = {};
        const lastStateUpdates: Partial<Record<number, number>> = {};

        const store = tx.objectStore('allianceStates');
        let cursor = await store.openCursor();
        while (cursor != null) {
            const dbValue = cursor.value;

            const isNewer = (lastStateUpdates[dbValue.allianceId] ?? -1) < dbValue.date;
            if (isNewer) {
                lastStateUpdates[dbValue.allianceId] = dbValue.date;
                lastStates[dbValue.allianceId] = dbValue.state;
            }

            cursor = await cursor.continue();
        }

        for (const ally of alliances) {
            if (lastStates === null) {
                continue;
            }

            await store.put({
                allianceId: ally.id,
                date: now,
                state: null,
            });
        }

        const allyIds = alliances.map(a => a.id);
        const deletedAllies = Object.keys(lastStates)
            .map(id => parseIntSafe(id, 10))
            .filter(id => !allyIds.includes(id));

        for (const allyId of deletedAllies) {
            if (lastStates[allyId] == 'deleted') {
                continue;
            }

            await store.put({
                allianceId: allyId,
                date: now,
                state: 'deleted',
            });
        }
    }

    private async updateAllianceScores(tx: UniverseHistoryDbTransaction, alliances: Alliance[], players: Player[], playerScores: Partial<Record<number, PlayerScorePositions>>, now: number) {
        const lastScores: Partial<Record<`${number}.${DbUniverseHistoryScoreType}`, ScorePosition>> = {};
        const lastScoreUpdates: Partial<Record<`${number}.${DbUniverseHistoryScoreType}`, number>> = {};

        const store = tx.objectStore('allianceScores');
        let cursor = await store.openCursor();
        while (cursor != null) {
            const dbValue = cursor.value;

            const key: `${number}.${DbUniverseHistoryScoreType}` = `${dbValue.allianceId}.${dbValue.type}`;
            const isNewer = (lastScoreUpdates[key] ?? -1) < dbValue.date;
            if (isNewer) {
                lastScoreUpdates[key] = dbValue.date;
                lastScores[key] = {
                    score: dbValue.score,
                    position: dbValue.position,
                };
            }

            cursor = await cursor.continue();
        }

        const scoreTypes: DbUniverseHistoryScoreType[] = ['total', 'economy', 'research', 'military', 'militaryBuilt', 'militaryDestroyed', 'militaryLost', 'honor', 'numberOfShips'];
        const scoresByType: Record<DbUniverseHistoryScoreType, Partial<Record<number, number>>> = {} as any;
        scoreTypes.forEach(type => scoresByType[type] = {});

        for (const ally of alliances) {
            const memberScores = players.filter(p => p.alliance == ally.id).map(p => playerScores[p.id]);

            for (const scoreType of scoreTypes) {
                const scoresByAlly = scoresByType[scoreType];

                const score = memberScores
                    .map(s => s?.[scoreType].score ?? 0)
                    .reduce((total, score) => total + score, 0);

                scoresByAlly[ally.id] = score;
            }
        }

        const sortedScoresByType: Record<DbUniverseHistoryScoreType, number[]> = {} as any;
        scoreTypes.forEach(type => {
            const allyScores = scoresByType[type];
            const sortedScores = [...new Set<number>(
                Object.values(allyScores).filter(score => score != null) as number[]
            )].sort((a, b) => b - a);

            sortedScoresByType[type] = sortedScores;
        });

        for (const ally of alliances) {
            for (const type of scoreTypes) {
                let score = scoresByType[type][ally.id];
                const position = score == null
                    ? 0
                    : sortedScoresByType[type].indexOf(score) + 1;
                score ??= 0;


                const lastAllyScore = lastScores[`${ally.id}.${type}`];
                if (lastAllyScore?.score != score || lastAllyScore.position != position) {
                    await store.put({
                        allianceId: ally.id,
                        date: now,
                        type,
                        position,
                        score,
                    });
                }
            }
        }
    }


    private async updatePlayers(tx: UniverseHistoryDbTransaction, players: Player[], now: number, playerScores: Partial<Record<number, PlayerScorePositions>>) {
        _logDebug('updating player history');
        await this.updateKnownPlayers(tx, players);
        await this.updatePlayerNames(tx, players, now);
        await this.updatePlayerAlliances(tx, players, now);
        await this.updatePlayerStates(tx, players, now);
        await this.updatePlayerScores(tx, players, playerScores, now);
    }

    private async updateKnownPlayers(tx: UniverseHistoryDbTransaction, players: Player[]) {
        for (const player of players) {
            await tx.objectStore('players').put({ id: player.id });
        }
    }

    private async updatePlayerNames(tx: UniverseHistoryDbTransaction, players: Player[], now: number) {
        const lastNames: Partial<Record<number, string>> = {};
        const lastNameUpdates: Partial<Record<number, number>> = {};

        const store = tx.objectStore('playerNames');
        let cursor = await store.openCursor();
        while (cursor != null) {
            const dbValue = cursor.value;

            const isNewer = (lastNameUpdates[dbValue.playerId] ?? -1) < dbValue.date;
            if (isNewer) {
                lastNameUpdates[dbValue.playerId] = dbValue.date;
                lastNames[dbValue.playerId] = dbValue.name;
            }

            cursor = await cursor.continue();
        }

        for (const player of players) {
            if (player.name == lastNames[player.id]) {
                continue;
            }

            await store.put({
                playerId: player.id,
                date: now,
                name: player.name,
            });
        }
    }

    private async updatePlayerAlliances(tx: UniverseHistoryDbTransaction, players: Player[], now: number) {
        const lastAlliances: Partial<Record<number, number | null>> = {};
        const lastAllianceUpdates: Partial<Record<number, number>> = {};

        const store = tx.objectStore('playerAlliances');
        let cursor = await store.openCursor();
        while (cursor != null) {
            const dbValue = cursor.value;

            const isNewer = (lastAllianceUpdates[dbValue.playerId] ?? -1) < dbValue.date;
            if (isNewer) {
                lastAllianceUpdates[dbValue.playerId] = dbValue.date;
                lastAlliances[dbValue.playerId] = dbValue.allianceId;
            }

            cursor = await cursor.continue();
        }

        for (const player of players) {
            if (player.alliance == lastAlliances[player.id]) {
                continue;
            }

            await store.put({
                playerId: player.id,
                date: now,
                allianceId: player.alliance,
            });
        }
    }

    private async updatePlayerStates(tx: UniverseHistoryDbTransaction, players: Player[], now: number) {
        const lastStates: Partial<Record<number, DbUniverseHistoryPlayerState>> = {};
        const lastStateUpdates: Partial<Record<number, number>> = {};

        const store = tx.objectStore('playerStates');
        let cursor = await store.openCursor();
        while (cursor != null) {
            const dbValue = cursor.value;

            const isNewer = (lastStateUpdates[dbValue.playerId] ?? -1) < dbValue.date;
            if (isNewer) {
                lastStateUpdates[dbValue.playerId] = dbValue.date;
                lastStates[dbValue.playerId] = dbValue.state;
            }

            cursor = await cursor.continue();
        }

        for (const player of players) {
            const state = this.mapState(player.status);

            if (player.id in lastStates && this.playerStateEqual(state, lastStates[player.id]!)) {
                continue;
            }

            await store.put({
                playerId: player.id,
                date: now,
                state,
            });
        }


        const playerIds = players.map(p => p.id);
        const deletedPlayers = Object.keys(lastStates)
            .map(id => parseIntSafe(id, 10))
            .filter(id => !playerIds.includes(id));

        for (const playerId of deletedPlayers) {
            if (lastStates[playerId] == 'deleted') {
                continue;
            }

            await store.put({
                playerId,
                date: now,
                state: 'deleted',
            });
        }
    }

    private async updatePlayerScores(tx: UniverseHistoryDbTransaction, players: Player[], playerScores: Partial<Record<number, PlayerScorePositions>>, now: number) {
        const lastScores: Partial<Record<`${number}.${DbUniverseHistoryScoreType}`, ScorePosition>> = {};
        const lastScoreUpdates: Partial<Record<`${number}.${DbUniverseHistoryScoreType}`, number>> = {};

        const store = tx.objectStore('playerScores');
        let cursor = await store.openCursor();
        while (cursor != null) {
            const dbValue = cursor.value;

            const key: `${number}.${DbUniverseHistoryScoreType}` = `${dbValue.playerId}.${dbValue.type}`;
            const isNewer = (lastScoreUpdates[key] ?? -1) < dbValue.date;
            if (isNewer) {
                lastScoreUpdates[key] = dbValue.date;
                lastScores[key] = {
                    score: dbValue.score,
                    position: dbValue.position,
                };
            }

            cursor = await cursor.continue();
        }

        const scoreTypes: DbUniverseHistoryScoreType[] = ['total', 'economy', 'research', 'military', 'militaryBuilt', 'militaryDestroyed', 'militaryLost', 'honor', 'numberOfShips'];
        const scoresByType: Record<DbUniverseHistoryScoreType, Partial<Record<number, number>>> = {} as any;
        scoreTypes.forEach(type => scoresByType[type] = {});

        for (const player of players) {
            for (const type of scoreTypes) {
                const { score, position } = playerScores[player.id]?.[type] ?? { score: 0, position: 0 };

                await store.put({
                    playerId: player.id,
                    date: now,
                    type,
                    position,
                    score,
                });
            }
        }
    }

    private playerStateEqual(a: DbUniverseHistoryPlayerState, b: DbUniverseHistoryPlayerState) {
        if (a == null || b == null || a == 'deleted' || b == 'deleted') {
            return a == b;
        }

        return this.arraysEqual(a, b);
    }

    private mapState(status: string | null): DbUniverseHistoryPlayerState {
        if (status == null) {
            return null;
        }

        const stateMap: Record<string, DbUniverseHistoryPlayerStateItem> = {
            a: 'admin',
            b: 'banned',
            v: 'vacation',
            i: 'inactive',
            I: 'inactive-long',
            o: 'outlaw',
        };
        const states: DbUniverseHistoryPlayerStateItem[] = [];
        status.split('').forEach(c => states.push(stateMap[c] ?? _throw(`unknown player state '${c}'`)));

        if (states.length == 0) {
            throw new Error('number of player stats was zero');
        }

        return states;
    }


    private async updatePlanets(tx: UniverseHistoryDbTransaction, planets: Planet[], now: number) {
        _logDebug('updating planet and moon history');

        await this.updateKnownPlanets(tx, planets);
        await this.updatePlanetNames(tx, planets, now);
        await this.updatePlanetStates(tx, planets, now);
        await this.updatePlanetCoordinates(tx, planets, now);

        const moons = planets.map(p => p.moon).filter(m => m != null) as Moon[];
        await this.updateKnownMoons(tx, moons);
        await this.updateMoonNames(tx, moons, now);
        await this.updateMoonStates(tx, moons, now);
    }

    private async updateKnownPlanets(tx: UniverseHistoryDbTransaction, planets: Planet[]) {
        const planetStore = tx.objectStore('planets');

        for (const planet of planets) {
            await planetStore.put({
                id: planet.id,
                playerId: planet.player,
            });
        }
    }

    private async updatePlanetNames(tx: UniverseHistoryDbTransaction, planets: Planet[], now: number) {
        const lastNames: Partial<Record<number, string>> = {};
        const lastNameUpdates: Partial<Record<number, number>> = {};

        const store = tx.objectStore('planetNames');
        let cursor = await store.openCursor();
        while (cursor != null) {
            const dbValue = cursor.value;

            const isNewer = (lastNameUpdates[dbValue.planetId] ?? -1) < dbValue.date;
            if (isNewer) {
                lastNameUpdates[dbValue.planetId] = dbValue.date;
                lastNames[dbValue.planetId] = dbValue.name;
            }

            cursor = await cursor.continue();
        }

        for (const planet of planets) {
            if (planet.name == lastNames[planet.id]) {
                continue;
            }

            await store.put({
                planetId: planet.id,
                date: now,
                name: planet.name,
            });
        }
    }

    private async updatePlanetStates(tx: UniverseHistoryDbTransaction, planets: Planet[], now: number) {
        const lastStates: Partial<Record<number, DbUniverseHistoryPlanetMoonState>> = {};
        const lastStateUpdates: Partial<Record<number, number>> = {};

        const store = tx.objectStore('planetStates');
        let cursor = await store.openCursor();
        while (cursor != null) {
            const dbValue = cursor.value;

            const isNewer = (lastStateUpdates[dbValue.planetId] ?? -1) < dbValue.date;
            if (isNewer) {
                lastStateUpdates[dbValue.planetId] = dbValue.date;
                lastStates[dbValue.planetId] = dbValue.state;
            }

            cursor = await cursor.continue();
        }

        for (const planet of planets) {
            if (lastStates === null) {
                continue;
            }

            await store.put({
                planetId: planet.id,
                date: now,
                state: null,
            });
        }

        const planetIds = planets.map(p => p.id);
        const deletedPlanets = Object.keys(lastStates)
            .map(id => parseIntSafe(id, 10))
            .filter(id => !planetIds.includes(id));

        for (const planetId of deletedPlanets) {
            if (lastStates[planetId] == 'deleted') {
                continue;
            }

            await store.put({
                planetId: planetId,
                date: now,
                state: 'deleted',
            });
        }
    }

    private async updatePlanetCoordinates(tx: UniverseHistoryDbTransaction, planets: Planet[], now: number) {
        const lastCoordinates: Partial<Record<number, DbUniverseHistoryCoordinates>> = {};
        const lastCoordinatesUpdates: Partial<Record<number, number>> = {};

        const store = tx.objectStore('planetCoordinates');
        let cursor = await store.openCursor();
        while (cursor != null) {
            const dbValue = cursor.value;

            const isNewer = (lastCoordinatesUpdates[dbValue.planetId] ?? -1) < dbValue.date;
            if (isNewer) {
                lastCoordinatesUpdates[dbValue.planetId] = dbValue.date;
                lastCoordinates[dbValue.planetId] = dbValue.coordinates;
            }

            cursor = await cursor.continue();
        }

        for (const planet of planets) {
            if (planet.id in lastCoordinates && this.coordinatesEqual(planet.coordinates, lastCoordinates[planet.id]!)) {
                continue;
            }

            await store.put({
                planetId: planet.id,
                date: now,
                coordinates: {
                    galaxy: planet.coordinates.galaxy,
                    system: planet.coordinates.galaxy,
                    position: planet.coordinates.position,
                },
            });
        }
    }

    private async updateKnownMoons(tx: UniverseHistoryDbTransaction, moons: Moon[]) {
        const store = tx.objectStore('moons');

        for (const moon of moons) {
            await store.put({
                id: moon.id,
                size: moon.size,
                planetId: moon.planetId,
            });
        }
    }

    private async updateMoonNames(tx: UniverseHistoryDbTransaction, moons: Moon[], now: number) {
        const lastNames: Partial<Record<number, string>> = {};
        const lastNameUpdates: Partial<Record<number, number>> = {};

        const store = tx.objectStore('moonNames');
        let cursor = await store.openCursor();
        while (cursor != null) {
            const dbValue = cursor.value;

            const isNewer = (lastNameUpdates[dbValue.moonId] ?? -1) < dbValue.date;
            if (isNewer) {
                lastNameUpdates[dbValue.moonId] = dbValue.date;
                lastNames[dbValue.moonId] = dbValue.name;
            }

            cursor = await cursor.continue();
        }

        for (const moon of moons) {
            if (moon.name == lastNames[moon.id]) {
                continue;
            }

            await store.put({
                moonId: moon.id,
                date: now,
                name: moon.name,
            });
        }
    }

    private async updateMoonStates(tx: UniverseHistoryDbTransaction, moons: Moon[], now: number) {
        const lastStates: Partial<Record<number, DbUniverseHistoryPlanetMoonState>> = {};
        const lastStateUpdates: Partial<Record<number, number>> = {};

        const store = tx.objectStore('moonStates');
        let cursor = await store.openCursor();
        while (cursor != null) {
            const dbValue = cursor.value;

            const isNewer = (lastStateUpdates[dbValue.moonId] ?? -1) < dbValue.date;
            if (isNewer) {
                lastStateUpdates[dbValue.moonId] = dbValue.date;
                lastStates[dbValue.moonId] = dbValue.state;
            }

            cursor = await cursor.continue();
        }

        for (const moon of moons) {
            if (lastStates === null) {
                continue;
            }

            await store.put({
                moonId: moon.id,
                date: now,
                state: null,
            });
        }

        const moonIds = moons.map(m => m.id);
        const deletedMoons = Object.keys(lastStates)
            .map(id => parseIntSafe(id, 10))
            .filter(id => !moonIds.includes(id));

        for (const moonId of deletedMoons) {
            if (lastStates[moonId] == 'deleted') {
                continue;
            }

            await store.put({
                moonId,
                date: now,
                state: 'deleted',
            });
        }
    }

    private coordinatesEqual(a: DbUniverseHistoryCoordinates, b: DbUniverseHistoryCoordinates) {
        return a.galaxy == b.galaxy
            && a.system == b.system
            && a.position == b.position;
    }

    private arraysEqual<T>(a: T[], b: T[]): boolean {
        return a.length == b.length
            && a.every(aValue => b.includes(aValue))
            && b.every(bValue => a.includes(bValue));
    }

    private get apiUrlBase() {
        return `https://s${this.meta.serverId}-${this.meta.language}.ogame.gameforge.com/api`;
    }

    private async getXml<T = any>(apiFile: string): Promise<T> {
        const url = `${this.apiUrlBase}/${apiFile}`;
        const response = await fetch(url);
        const xml = await response.text();

        return this.parser.parse(xml);
    }

    private async getPlanets(): Promise<Planet[]> {
        const planets: Planet[] = [];

        const xml = await this.getXml<OgameApi.UniverseXml>('universe.xml');
        xml.universe.planet.forEach(planet => {
            const id = parseIntSafe(planet.id ?? _throw('no planet id found'), 10);
            const player = parseIntSafe(planet.player ?? _throw('no planet player id found'), 10);
            const name = planet.name ?? _throw('no planet name found');
            const coordinates = parseCoordinates(planet.coords ?? _throw('no planet coords found'));

            let moon: Moon | undefined = undefined;
            if (planet.moon != null) {
                const moonId = parseIntSafe(planet.moon.id ?? _throw('no moon id found'), 10);
                const size = parseIntSafe(planet.moon.size ?? _throw('no moon size found'), 10);
                const moonName = planet.moon.name ?? _throw('no moon name found');

                moon = {
                    id: moonId,
                    name: moonName,
                    size,
                    planetId: id,
                };
            }

            planets.push({
                id,
                player,
                name,
                coordinates,
                moon,
            });
        });

        return planets;
    }

    private async getPlayers(): Promise<Player[]> {
        const players: Player[] = [];

        const xml = await this.getXml<OgameApi.PlayersXml>('players.xml');
        xml.players.player.forEach(player => {
            const id = parseIntSafe(player.id ?? _throw('no player id found'), 10);
            const name = player.name ?? _throw('no player name found');
            const status = player.status ?? null;
            const alliance = player.alliance == null ? null : parseIntSafe(player.alliance, 10);

            players.push({
                id,
                alliance,
                name,
                status,
            });
        });

        return players;
    }

    private async getAlliances(): Promise<Alliance[]> {
        const alliances: Alliance[] = [];

        const xml = await this.getXml<OgameApi.AllianceXml>('alliances.xml');
        xml.alliances.alliance.forEach(alliance => {
            const id = parseIntSafe(alliance.id ?? _throw('no alliance id found'), 10);
            const name = alliance.name ?? _throw('no alliance name found');
            const tag = alliance.tag ?? _throw('no alliance tag found');

            alliances.push({
                id,
                name,
                tag,
            });
        });

        return alliances;
    }

    private async getAllPlayerScores(): Promise<Partial<Record<number, PlayerScorePositions>>> {
        const scores: Partial<Record<number, PlayerScorePositions>> = {};

        const total = await this.getPlayerScorePositions(HighscoreType.total);
        const economy = await this.getPlayerScorePositions(HighscoreType.economy);
        const research = await this.getPlayerScorePositions(HighscoreType.research);
        const military = await this.getPlayerMilitaryScorePositions();
        const militaryBuilt = await this.getPlayerScorePositions(HighscoreType.militaryBuilt);
        const militaryDestroyed = await this.getPlayerScorePositions(HighscoreType.militaryDestroyed);
        const militaryLost = await this.getPlayerScorePositions(HighscoreType.militaryLost);
        const honor = await this.getPlayerScorePositions(HighscoreType.honor);

        Object.keys(total)
            .map(playerId => parseIntSafe(playerId, 10))
            .forEach(playerId => {
                scores[playerId] = {
                    total: total[playerId],
                    economy: economy[playerId],
                    research: research[playerId],
                    military: military[playerId].points,
                    numberOfShips: military[playerId].numberOfShips,
                    militaryBuilt: militaryBuilt[playerId],
                    militaryDestroyed: militaryDestroyed[playerId],
                    militaryLost: militaryLost[playerId],
                    honor: honor[playerId],
                };
            });

        return scores;
    }

    private async getPlayerScorePositions(type: Exclude<HighscoreType, HighscoreType.militaryAndNumberOfShips>): Promise<Record<number, ScorePosition>> {
        const scores: Record<number, ScorePosition> = {};

        const xml = await this.getXml<OgameApi.HighscoreXml>(`highscore.xml?category=1&type=${type}`);
        xml.highscore.player.forEach(player => {
            const id = parseIntSafe(player.id ?? _throw('no player id found'), 10);
            const score = parseIntSafe(player.score ?? _throw('no player score found'), 10);
            const position = parseIntSafe(player.position ?? _throw('no player position found'), 10);

            scores[id] = { score, position };
        });
        return scores;
    }

    private async getPlayerMilitaryScorePositions(): Promise<Record<number, { points: ScorePosition, numberOfShips: ScorePosition }>> {
        const scores: Record<number, { points: ScorePosition, numberOfShips: ScorePosition }> = {};

        const xml = await this.getXml<OgameApi.HighscoreXml>(`highscore.xml?category=1&type=${HighscoreType.militaryAndNumberOfShips}`);
        const mapped = xml.highscore.player.map(player => {
            const id = parseIntSafe(player.id ?? _throw('no player id found'), 10);
            const score = parseIntSafe(player.score ?? _throw('no player score found'), 10);
            const position = parseIntSafe(player.position ?? _throw('no player position found'), 10);

            const numberOfShips = parseIntSafe(player.ships ?? '0', 10);

            return {
                id,
                score,
                position,
                numberOfShips,
            };
        });
        mapped.sort((a, b) => b.numberOfShips - a.numberOfShips);

        mapped.forEach((player, index) => {
            const { id, score, position, numberOfShips } = player;
            const numberOfShipsPosition = index + 1;

            scores[id] = {
                points: {
                    score,
                    position,
                },
                numberOfShips: {
                    score: numberOfShips,
                    position: numberOfShipsPosition,
                },
            };
        });

        return scores;
    }
}
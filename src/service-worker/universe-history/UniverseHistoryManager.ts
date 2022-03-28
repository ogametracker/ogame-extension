import { MessageOgameMeta } from '../../shared/messages/Message';
import { UniverseHistory } from '../../shared/models/universe-history/UniverseHistory';
import { _throw } from '../../shared/utils/_throw';
import { PersistentDataManager } from '../PersistentData';
import { parseIntSafe } from '../../shared/utils/parseNumbers';
import { compareCoordinates, Coordinates } from '../../shared/models/ogame/common/Coordinates';
import { parseCoordinates } from '../../shared/utils/parseCoordinates';
import { XMLParser } from 'fast-xml-parser';
import { AllianceHistory } from '../../shared/models/universe-history/AllianceHistory';
import { PlayerHistory, PlayerState, PlayerStateType } from '../../shared/models/universe-history/PlayerHistory';
import { HistoryItem } from '../../shared/models/universe-history/HistoryItem';
import { PlanetHistory } from '../../shared/models/universe-history/PlanetHistory';
import { MoonHistory } from '../../shared/models/universe-history/MoonHistory';
import { _logDebug } from '../../shared/utils/_log';

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
}

type bit = 0 | 1;

export class UniverseHistoryManager extends PersistentDataManager<UniverseHistory> {

    private readonly intervalInMs = 1000 * 60 * 60 * 12; //12h
    private readonly language: string;
    private readonly serverId: number;
    private readonly parser = new XMLParser({
        attributeNamePrefix: '',
        ignoreAttributes: false,
        parseAttributeValue: false,
    });

    private readonly defaultPlayerScores: PlayerScorePositions = {
        total: { score: 0, position: 0 },
        economy: { score: 0, position: 0 },
        research: { score: 0, position: 0 },
        military: { score: 0, position: 0 },
        militaryBuilt: { score: 0, position: 0 },
        militaryDestroyed: { score: 0, position: 0 },
        militaryLost: { score: 0, position: 0 },
        numberOfShips: { score: 0, position: 0 },
        honor: { score: 0, position: 0 },
    };
    private readonly listeners: (() => void)[] = [];
    private static timeout: number | undefined = undefined;

    constructor(key: string, meta: MessageOgameMeta) {
        super(key, 'universe-history');

        this.language = meta.language;
        this.serverId = meta.serverId;

        void this.initTracking();
    }

    public addBroadcastNotifyListener(listener: () => void) {
        this.listeners.push(listener);
    }

    protected getDefaultItem(): UniverseHistory {
        return {
            lastUpdate: 0,
            alliances: {},
            players: {},
        };
    }

    private async initTracking(timeout?: number) {
        const data = await this.getData();
        const now = Date.now();

        timeout ??= Math.max(0, data.lastUpdate + this.intervalInMs - now);
        _logDebug(`next universe history tracking in ${timeout} ms (${new Date(Date.now() + timeout)}) for universe ${this.serverId} ${this.language.toUpperCase()}`);

        if (UniverseHistoryManager.timeout != null) {
            clearTimeout(UniverseHistoryManager.timeout);
            UniverseHistoryManager.timeout = undefined;
        }
        UniverseHistoryManager.timeout = globalThis.setTimeout(async () => await this.trackUniverseUpdates(), timeout, null);
    }

    private async trackUniverseUpdates() {
        try {
            _logDebug(`tracking universe history for universe ${this.serverId} ${this.language.toUpperCase()}`);
            const players = await this.getPlayers();
            const alliances = await this.getAlliances();
            const playerScores = await this.getAllPlayerScores();
            const planets = await this.getPlanets();

            const updated = await this.updateHistory(players, alliances, playerScores, planets);
            if (updated) {
                this.broadcastUniverseHistoryUpdate();
            }

            await this.initTracking();
        } catch (error) {
            await this.initTracking(1000 * 60 * 5); // try in 5min again on error
        }
    }

    private broadcastUniverseHistoryUpdate() {
        this.listeners.forEach(listener => listener());
    }

    private async updateHistory(players: Player[], alliances: Alliance[], playerScores: Record<number, PlayerScorePositions>, planets: Planet[]): Promise<boolean> {
        const now = Date.now();
        let updated = 0 as bit;

        await this.updateInTransaction(data => {
            updated = (this.updatePlayers(players, data, now, playerScores, planets)
                | this.updateAlliances(alliances, data, now, players)) as bit;

            data.lastUpdate = now;
            return data;
        });

        return updated != 0;
    }

    private updateAlliances(alliances: Alliance[], data: UniverseHistory, now: number, players: Player[]): bit {
        const knownAllyIds = alliances.map(ally => ally.id);
        let updated: bit = 0;
        alliances.forEach(ally => {
            try {
                const allyHistory: AllianceHistory = data.alliances[ally.id] ?? {
                    id: ally.id,
                    members: [],
                    name: [],
                    state: [],
                    tag: [],
                };

                updated = (updated | this.updateAlliance(now, allyHistory, ally, players.filter(p => p.alliance == ally.id))) as bit;
                data.alliances[ally.id] = allyHistory;
            } catch (error) {
                console.error(error);
            }
        });

        // mark known non-existing alliances as deleted
        const deletedAllyIds = Object.keys(data.alliances)
            .map(allyId => parseIntSafe(allyId, 10))
            .filter(allyId => !knownAllyIds.includes(allyId) && data.alliances[allyId]!.state.slice(-1)[0]?.value != 'deleted');
        deletedAllyIds.forEach(allyId => data.alliances[allyId]!.state.push({
            value: 'deleted',
            date: now,
        }));

        updated = (updated | (deletedAllyIds.length > 0 ? 1 : 0)) as bit;
        return updated;
    }

    private updatePlayers(players: Player[], data: UniverseHistory, now: number, playerScores: Record<number, PlayerScorePositions>, planets: Planet[]): bit {
        const knownPlayerIds = players.map(player => player.id);
        let updated: bit = 0;
        players.forEach(player => {
            try {
                const playerHistory: PlayerHistory = data.players[player.id] ?? {
                    id: player.id,
                    name: [],
                    planets: {},
                    scores: {
                        total: [],
                        economy: [],
                        research: [],
                        military: [],
                        militaryBuilt: [],
                        militaryDestroyed: [],
                        militaryLost: [],
                        honor: [],
                        numberOfShips: [],
                    },
                    scorePositions: {
                        total: [],
                        economy: [],
                        research: [],
                        military: [],
                        militaryBuilt: [],
                        militaryDestroyed: [],
                        militaryLost: [],
                        honor: [],
                        numberOfShips: [],
                    },
                    state: [],
                    alliance: [],
                };

                updated = (updated | this.updatePlayer(
                    now,
                    playerHistory,
                    player,
                    playerScores[player.id] ?? this.defaultPlayerScores,
                    planets.filter(p => p.player == player.id)
                )) as bit;
                data.players[player.id] = playerHistory;
            } catch (error) {
                console.error(error);
            }
        });

        // mark known non-existing players as deleted
        const deletedPlayerIds = Object.keys(data.players)
            .map(playerId => parseIntSafe(playerId, 10))
            .filter(playerId => !knownPlayerIds.includes(playerId) && !this.arraysEqual((data.players[playerId]!.state.slice(-1)[0]?.value ?? []), ['deleted']));
        deletedPlayerIds.forEach(playerId => data.players[playerId]!.state.push({
            value: ['deleted'],
            date: now,
        }));

        updated = (updated | (deletedPlayerIds.length > 0 ? 1 : 0)) as bit;
        return updated;
    }

    private updatePlayer(now: number, playerHistory: PlayerHistory, player: Player, scores: PlayerScorePositions, planets: Planet[]): bit {
        return (this.updatePlayerName(now, playerHistory, player)
            | this.updatePlayerAlliance(now, playerHistory, player)
            | this.updatePlayerState(now, playerHistory, player)
            | this.updatePlayerScores(now, playerHistory, scores)
            | this.updatePlayerPlanets(now, playerHistory, planets)) as bit;
    }

    private updatePlayerPlanets(now: number, playerHistory: PlayerHistory, planets: Planet[]): bit {
        const planetIds = planets.map(p => p.id);
        let updated: bit = 0;
        planets.forEach(planet => updated = (updated | this.updatePlayerPlanet(now, playerHistory.planets, planet)) as bit);

        // mark known non-existing planets as deleted
        const deletedPlanetIds = Object.keys(playerHistory.planets)
            .map(planetId => parseIntSafe(planetId, 10))
            .filter(planetId => !planetIds.includes(planetId) && playerHistory.planets[planetId]!.state.slice(-1)[0]?.value != 'deleted');
        deletedPlanetIds.forEach(planetId => playerHistory.planets[planetId]!.state.push({
            date: now,
            value: 'deleted'
        }));

        updated = (updated | (deletedPlanetIds.length > 0 ? 1 : 0)) as bit;
        return updated;
    }

    private updatePlayerPlanet(now: number, planetHistories: Partial<Record<number, PlanetHistory>>, planet: Planet): bit {
        const planetHistory = planetHistories[planet.id];

        if (planetHistory == null) {
            const moonHistory: Record<number, MoonHistory> = {};
            if (planet.moon != null) {
                moonHistory[planet.moon.id] = this.getMoonHistory(now, planet.moon);
            }

            planetHistories[planet.id] = {
                id: planet.id,
                coordinates: [{
                    date: now,
                    value: planet.coordinates,
                }],
                state: [{
                    date: now,
                    value: null,
                }],
                name: [{
                    date: now,
                    value: planet.name,
                }],
                moon: moonHistory,
            };
            return 1;
        }

        return (this.updatePlanetCoordinates(now, planetHistory.coordinates, planet.coordinates)
            | this.updatePlanetName(now, planetHistory.name, planet.name)
            | this.updatePlanetMoon(now, planetHistory.moon, planet.moon)) as bit;
    }

    private updatePlanetMoon(now: number, moonHistories: Partial<Record<number, MoonHistory>>, moon: Moon | undefined): bit {
        // mark known non-existing moons as deleted
        const deletedMoonIds = Object.keys(moonHistories)
            .map(moonId => parseIntSafe(moonId, 10))
            .filter(moonId => moonHistories[moonId]!.state.slice(-1)[0]?.value != 'deleted');
        deletedMoonIds.forEach(moonId => moonHistories[moonId]!.state.push({
            date: now,
            value: 'deleted'
        }));

        if (moon != null) {
            const moonHistoryOld = moonHistories[moon.id];
            const moonHistory = (moonHistories[moon.id] ??= {
                id: moon.id,
                size: moon.size,
                name: [],
                state: [{
                    date: now,
                    value: null,
                }],
            });

            if (moonHistory.name.slice(-1)[0]?.value != moon.name) {
                moonHistory.name.push({
                    date: now,
                    value: moon.name,
                });
                return 1;
            }

            if (moonHistoryOld == null) {
                return 1;
            }
        }

        return deletedMoonIds.length > 0 ? 1 : 0;
    }

    private updatePlanetName(now: number, nameHistory: HistoryItem<string>[], name: string): bit {
        if (nameHistory.slice(-1)[0]?.value != name) {
            nameHistory.push({
                date: now,
                value: name,
            });

            return 1;
        }
        return 0;
    }

    private updatePlanetCoordinates(now: number, coordinatesHistory: HistoryItem<Coordinates>[], coordinates: Coordinates): bit {
        const lastCoords = coordinatesHistory.slice(-1)[0]?.value;

        if (lastCoords == null || compareCoordinates(lastCoords, coordinates) != 0) {
            coordinatesHistory.push({
                date: now,
                value: coordinates,
            });
            return 1;
        }
        return 0;
    }

    private getMoonHistory(now: number, moon: Moon): MoonHistory {
        return {
            id: moon.id,
            size: moon.size,
            name: [{
                date: now,
                value: moon.name,
            }],
            state: [{
                date: now,
                value: null
            }],
        };
    }

    private updatePlayerScores(now: number, playerHistory: PlayerHistory, scores: PlayerScorePositions): bit {
        return (this.updatePlayerScorePosition(now, playerHistory.scores.total, playerHistory.scorePositions.total, scores.total)
            | this.updatePlayerScorePosition(now, playerHistory.scores.economy, playerHistory.scorePositions.economy, scores.economy)
            | this.updatePlayerScorePosition(now, playerHistory.scores.research, playerHistory.scorePositions.research, scores.research)
            | this.updatePlayerScorePosition(now, playerHistory.scores.military, playerHistory.scorePositions.military, scores.military)
            | this.updatePlayerScorePosition(now, playerHistory.scores.militaryBuilt, playerHistory.scorePositions.militaryBuilt, scores.militaryBuilt)
            | this.updatePlayerScorePosition(now, playerHistory.scores.militaryDestroyed, playerHistory.scorePositions.militaryDestroyed, scores.militaryDestroyed)
            | this.updatePlayerScorePosition(now, playerHistory.scores.militaryLost, playerHistory.scorePositions.militaryLost, scores.militaryLost)
            | this.updatePlayerScorePosition(now, playerHistory.scores.honor, playerHistory.scorePositions.honor, scores.honor)
            | this.updatePlayerScorePosition(now, playerHistory.scores.numberOfShips, playerHistory.scorePositions.numberOfShips, scores.numberOfShips)) as bit;
    }

    private updatePlayerScorePosition(now: number, scoreHistory: HistoryItem<number>[], positionHistory: HistoryItem<number>[], scorePosition: ScorePosition): bit {
        const { score, position } = scorePosition;
        let updated: bit = 0;

        if (scoreHistory.slice(-1)[0]?.value != score) {
            scoreHistory.push({
                date: now,
                value: score,
            });
            updated = 1;
        }

        if (positionHistory.slice(-1)[0]?.value != position) {
            positionHistory.push({
                date: now,
                value: position,
            });
            updated = 1;
        }

        return updated;
    }

    private mapState(status: string | null): PlayerState {
        if (status == null) {
            return [null];
        }

        const stateMap: Record<string, PlayerStateType> = {
            a: 'admin',
            b: 'banned',
            v: 'vacation',
            i: 'inactive',
            I: 'inactive-long',
            o: 'outlaw',
        };
        const states: PlayerStateType[] = [];
        status.split('').forEach(c => states.push(stateMap[c] ?? _throw(`unknown player state '${c}'`)));

        if (states.length == 0) {
            throw new Error('number of player stats was zero');
        }

        return states as PlayerState;
    }

    private updatePlayerState(now: number, playerHistory: PlayerHistory, player: Player): bit {
        const states = this.mapState(player.status);

        if (playerHistory.state.length == 0
            || !this.arraysEqual(playerHistory.state.slice(-1)[0].value, states)
        ) {
            playerHistory.state.push({
                value: states,
                date: now,
            });
            return 1;
        }
        return 0;
    }

    private updatePlayerAlliance(now: number, playerHistory: PlayerHistory, player: Player): bit {
        if (playerHistory.alliance.slice(-1)[0]?.value != player.alliance
        ) {
            playerHistory.alliance.push({
                value: player.alliance,
                date: now,
            });
            return 1;
        }
        return 0;
    }

    private updatePlayerName(now: number, playerHistory: PlayerHistory, player: Player): bit {
        if (playerHistory.name.slice(-1)[0]?.value != player.name
        ) {
            playerHistory.name.push({
                value: player.name,
                date: now,
            });
            return 1;
        }
        return 0;
    }

    private updateAlliance(now: number, allyHistory: AllianceHistory, allyData: Alliance, members: Player[]): bit {
        return (this.updateAllianceName(now, allyHistory, allyData)
            | this.updateAllianceTag(now, allyHistory, allyData)
            | this.updateAllianceMembers(now, allyHistory, members)) as bit;
    }

    private updateAllianceTag(now: number, allyHistory: AllianceHistory, allyData: Alliance) {
        if (allyHistory.tag.slice(-1)[0]?.value != allyData.tag
        ) {
            allyHistory.tag.push({
                value: allyData.tag,
                date: now,
            });
            return 1;
        }
        return 0;
    }

    private updateAllianceName(now: number, allyHistory: AllianceHistory, allyData: Alliance): bit {
        if (allyHistory.name.slice(-1)[0]?.value != allyData.name
        ) {
            allyHistory.name.push({
                value: allyData.name,
                date: now,
            });
            return 1;
        }
        return 0;
    }

    private updateAllianceMembers(now: number, allyHistory: AllianceHistory, members: Player[]): bit {
        const memberIds = members.map(member => member.id);

        if (allyHistory.members.length == 0
            || this.arraysEqual(allyHistory.members.slice(-1)[0].value, memberIds)
        ) {
            allyHistory.members.push({
                value: memberIds,
                date: now,
            });
            return 1;
        }
        return 0;
    }

    private arraysEqual<T>(a: T[], b: T[]): boolean {
        return a.length == b.length
            && a.every(aValue => b.includes(aValue))
            && b.every(bValue => a.includes(bValue));
    }

    private get apiUrlBase() {
        return `https://s${this.serverId}-${this.language}.ogame.gameforge.com/api`;
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

    private async getAllPlayerScores(): Promise<Record<number, PlayerScorePositions>> {
        const scores: Record<number, PlayerScorePositions> = {};

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
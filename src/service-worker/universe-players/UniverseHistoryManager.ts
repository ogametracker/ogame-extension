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
import { ca } from 'date-fns/locale';
import { HistoryItem } from '../../shared/models/universe-history/HistoryItem';
import { PlanetHistory } from '../../shared/models/universe-history/PlanetHistory';
import { MoonHistory } from '../../shared/models/universe-history/MoonHistory';
import { _logDebug } from '../../shared/utils/_log';

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

interface PlayerScores {
    total: number;
    economy: number;
    research: number;
    military: number;
    militaryBuilt: number;
    militaryDestroyed: number;
    militaryLost: number;
    honor: number;
    numberOfShips: number;
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

export class UniverseHistoryManager extends PersistentDataManager<UniverseHistory> {

    private readonly intervalInMs = 1000 * 60 * 60; //1h
    private readonly language: string;
    private readonly serverId: number;
    private readonly parser = new XMLParser({
        attributeNamePrefix: '',
        ignoreAttributes: false,
        parseAttributeValue: false,
    });

    private readonly defaultPlayerScores: PlayerScores = {
        total: 0,
        economy: 0,
        research: 0,
        military: 0,
        militaryBuilt: 0,
        militaryDestroyed: 0,
        militaryLost: 0,
        numberOfShips: 0,
        honor: 0,
    };

    constructor(key: string, meta: MessageOgameMeta) {
        super(key, 'universe-history');

        this.language = meta.language;
        this.serverId = meta.serverId;

        this.initTracking();
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
        _logDebug(`next universe history tracking in ${timeout} ms (${new Date(Date.now() + timeout)})`);
        setTimeout(async () => await this.trackUniverseUpdates(), timeout);
    }

    private async trackUniverseUpdates() {
        try {
            const players = await this.getPlayers();
            const alliances = await this.getAlliances();
            const playerScores = await this.getAllPlayerScores();
            const planets = await this.getPlanets();

            await this.updateHistory(players, alliances, playerScores, planets);

            await this.initTracking();
        } catch (error) {
            await this.initTracking(1000 * 60 * 5); // try in 5min again on error
        }
    }

    private async updateHistory(players: Player[], alliances: Alliance[], playerScores: Record<number, PlayerScores>, planets: Planet[]) {
        const now = Date.now();

        await this.updateInTransaction(data => {
            // update players
            this.updatePlayers(players, data, now, playerScores, planets);

            // update alliances
            this.updateAlliances(alliances, data, now, players);

            data.lastUpdate = now;
            return data;
        });
    }

    private updateAlliances(alliances: Alliance[], data: UniverseHistory, now: number, players: Player[]) {
        const knownAllyIds = alliances.map(ally => ally.id);
        alliances.forEach(ally => {
            try {
                const allyHistory: AllianceHistory = data.alliances[ally.id] ?? {
                    id: ally.id,
                    members: [],
                    name: [],
                    state: [],
                    tag: [],
                };

                this.updateAlliance(now, allyHistory, ally, players.filter(p => p.alliance == ally.id));
                data.alliances[ally.id] = allyHistory;
            } catch (error) {
                console.error(error);
            }
        });
        // mark known non-existing alliances as deleted
        Object.keys(data.alliances)
            .map(allyId => parseIntSafe(allyId, 10))
            .filter(allyId => !knownAllyIds.includes(allyId) && data.alliances[allyId]!.state.slice(-1)[0]?.value != 'deleted')
            .forEach(allyId => data.alliances[allyId]!.state.push({
                value: 'deleted',
                date: now,
            }));
    }

    private updatePlayers(players: Player[], data: UniverseHistory, now: number, playerScores: Record<number, PlayerScores>, planets: Planet[]) {
        const knownPlayerIds = players.map(player => player.id);
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
                    state: [],
                    alliance: [],
                };

                this.updatePlayer(
                    now,
                    playerHistory,
                    player,
                    playerScores[player.id] ?? this.defaultPlayerScores,
                    planets.filter(p => p.player == player.id)
                );
                data.players[player.id] = playerHistory;
            } catch (error) {
                console.error(error);
            }
        });
        // mark known non-existing players as deleted
        Object.keys(data.players)
            .map(playerId => parseIntSafe(playerId, 10))
            .filter(playerId => !knownPlayerIds.includes(playerId) && !this.arraysEqual((data.players[playerId]!.state.slice(-1)[0]?.value ?? []), ['deleted']))
            .forEach(playerId => data.players[playerId]!.state.push({
                value: ['deleted'],
                date: now,
            }));
    }

    private updatePlayer(now: number, playerHistory: PlayerHistory, player: Player, scores: PlayerScores, planets: Planet[]) {
        this.updatePlayerName(now, playerHistory, player);
        this.updatePlayerAlliance(now, playerHistory, player);
        this.updatePlayerState(now, playerHistory, player);
        this.updatePlayerScores(now, playerHistory, scores);
        this.updatePlayerPlanets(now, playerHistory, planets);
    }

    private updatePlayerPlanets(now: number, playerHistory: PlayerHistory, planets: Planet[]) {
        const planetIds = planets.map(p => p.id);
        planets.forEach(planet => this.updatePlayerPlanet(now, playerHistory.planets, planet));

        // mark known non-existing planets as deleted
        Object.keys(playerHistory.planets)
            .map(planetId => parseIntSafe(planetId, 10))
            .filter(planetId => !planetIds.includes(planetId) && playerHistory.planets[planetId]!.state.slice(-1)[0]?.value != 'deleted')
            .forEach(planetId => playerHistory.planets[planetId]!.state.push({
                date: now,
                value: 'deleted'
            }));
    }

    private updatePlayerPlanet(now: number, planetHistories: Partial<Record<number, PlanetHistory>>, planet: Planet): void {
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
            return;
        }

        this.updatePlanetCoordinates(now, planetHistory.coordinates, planet.coordinates);
        this.updatePlanetName(now, planetHistory.name, planet.name);
        this.updatePlanetMoon(now, planetHistory.moon, planet.moon);
    }

    private updatePlanetMoon(now: number, moonHistories: Partial<Record<number, MoonHistory>>, moon: Moon | undefined) {
        // mark known non-existing moons as deleted
        Object.keys(moonHistories)
            .map(moonId => parseIntSafe(moonId, 10))
            .filter(moonId => moonHistories[moonId]!.state.slice(-1)[0]?.value != 'deleted')
            .forEach(moonId => moonHistories[moonId]!.state.push({
                date: now,
                value: 'deleted'
            }));

        if (moon != null) {
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
            }
        }
    }

    private updatePlanetName(now: number, nameHistory: HistoryItem<string>[], name: string) {
        if (nameHistory.slice(-1)[0]?.value != name) {
            nameHistory.push({
                date: now,
                value: name,
            });
        }
    }

    private updatePlanetCoordinates(now: number, coordinatesHistory: HistoryItem<Coordinates>[], coordinates: Coordinates) {
        const lastCoords = coordinatesHistory.slice(-1)[0]?.value;

        if (lastCoords == null || compareCoordinates(lastCoords, coordinates) != 0) {
            coordinatesHistory.push({
                date: now,
                value: coordinates,
            });
        }
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

    private updatePlayerScores(now: number, playerHistory: PlayerHistory, scores: PlayerScores) {
        this.updatePlayerScore(now, playerHistory.scores.total, scores.total);
        this.updatePlayerScore(now, playerHistory.scores.economy, scores.economy);
        this.updatePlayerScore(now, playerHistory.scores.research, scores.research);
        this.updatePlayerScore(now, playerHistory.scores.military, scores.military);
        this.updatePlayerScore(now, playerHistory.scores.militaryBuilt, scores.militaryBuilt);
        this.updatePlayerScore(now, playerHistory.scores.militaryDestroyed, scores.militaryDestroyed);
        this.updatePlayerScore(now, playerHistory.scores.militaryLost, scores.militaryLost);
        this.updatePlayerScore(now, playerHistory.scores.honor, scores.honor);
        this.updatePlayerScore(now, playerHistory.scores.numberOfShips, scores.numberOfShips);
    }

    private updatePlayerScore(now: number, scoreHistory: HistoryItem<number>[], score: number) {
        if (scoreHistory.slice(-1)[0]?.value != score) {
            scoreHistory.push({
                date: now,
                value: score,
            });
        }
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
        };
        const states: PlayerStateType[] = [];
        status.split('').forEach(c => states.push(stateMap[c] ?? _throw(`unknown player state '${c}'`)));

        if (states.length == 0) {
            throw new Error('number of player stats was zero');
        }

        return states as PlayerState;
    }

    private updatePlayerState(now: number, playerHistory: PlayerHistory, player: Player) {
        const states = this.mapState(player.status);

        if (playerHistory.state.length == 0
            || !this.arraysEqual(playerHistory.state.slice(-1)[0].value, states)
        ) {
            playerHistory.state.push({
                value: states,
                date: now,
            });
        }
    }

    private updatePlayerAlliance(now: number, playerHistory: PlayerHistory, player: Player) {
        if (playerHistory.alliance.slice(-1)[0]?.value != player.alliance
        ) {
            playerHistory.alliance.push({
                value: player.alliance,
                date: now,
            });
        }
    }

    private updatePlayerName(now: number, playerHistory: PlayerHistory, player: Player) {
        if (playerHistory.name.slice(-1)[0]?.value != player.name
        ) {
            playerHistory.name.push({
                value: player.name,
                date: now,
            });
        }
    }

    private updateAlliance(now: number, allyHistory: AllianceHistory, allyData: Alliance, members: Player[]) {
        this.updateAllianceName(now, allyHistory, allyData);
        this.updateAllianceTag(now, allyHistory, allyData);
        this.updateAllianceMembers(now, allyHistory, members);
    }

    private updateAllianceTag(now: number, allyHistory: AllianceHistory, allyData: Alliance) {
        if (allyHistory.tag.slice(-1)[0]?.value != allyData.tag
        ) {
            allyHistory.tag.push({
                value: allyData.tag,
                date: now,
            });
        }
    }

    private updateAllianceName(now: number, allyHistory: AllianceHistory, allyData: Alliance) {
        if (allyHistory.name.slice(-1)[0]?.value != allyData.name
        ) {
            allyHistory.name.push({
                value: allyData.name,
                date: now,
            });
        }
    }

    private updateAllianceMembers(now: number, allyHistory: AllianceHistory, members: Player[]) {
        const memberIds = members.map(member => member.id);

        if (allyHistory.members.length == 0
            || this.arraysEqual(allyHistory.members.slice(-1)[0].value, memberIds)
        ) {
            allyHistory.members.push({
                value: memberIds,
                date: now,
            });
        }
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

    private async getAllPlayerScores(): Promise<Record<number, PlayerScores>> {
        const scores: Record<number, PlayerScores> = {};

        const total = await this.getPlayerScores(HighscoreType.total);
        const economy = await this.getPlayerScores(HighscoreType.economy);
        const research = await this.getPlayerScores(HighscoreType.research);
        const military = await this.getPlayerMilitaryScores();
        const militaryBuilt = await this.getPlayerScores(HighscoreType.militaryBuilt);
        const militaryDestroyed = await this.getPlayerScores(HighscoreType.militaryDestroyed);
        const militaryLost = await this.getPlayerScores(HighscoreType.militaryLost);
        const honor = await this.getPlayerScores(HighscoreType.honor);

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

    private async getPlayerScores(type: Exclude<HighscoreType, HighscoreType.militaryAndNumberOfShips>): Promise<Record<number, number>> {
        const scores: Record<number, number> = {};

        const xml = await this.getXml<OgameApi.HighscoreXml>(`highscore.xml?category=1&type=${type}`);
        xml.highscore.player.forEach(player => {
            const id = parseIntSafe(player.id ?? _throw('no player id found'), 10);
            const score = parseIntSafe(player.score ?? _throw('no player score found'), 10);

            scores[id] = score;
        });
        return scores;
    }

    private async getPlayerMilitaryScores(): Promise<Record<number, { points: number; numberOfShips: number }>> {
        const scores: Record<number, { points: number; numberOfShips: number }> = {};

        const xml = await this.getXml<OgameApi.HighscoreXml>(`highscore.xml?category=1&type=${HighscoreType.militaryAndNumberOfShips}`);
        xml.highscore.player.forEach(player => {
            const id = parseIntSafe(player.id ?? _throw('no player id found'), 10);
            const points = parseIntSafe(player.score ?? _throw('no player score found'), 10);
            const numberOfShips = parseIntSafe(player.ships ?? '0', 10);

            scores[id] = {
                points,
                numberOfShips,
            };
        });
        return scores;
    }
}
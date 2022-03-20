import { MessageOgameMeta } from '../../shared/messages/Message';
import { UniverseHistory } from '../../shared/models/universe-history/UniverseHistory';
import { _throw } from '../../shared/utils/_throw';
import { PersistentDataManager } from '../PersistentData';
import { parseIntSafe } from '../../shared/utils/parseNumbers';
import { Coordinates } from '../../shared/models/ogame/common/Coordinates';
import { parseCoordinates } from '../../shared/utils/parseCoordinates';
import { XMLParser } from 'fast-xml-parser';

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

        timeout ??= Math.max(0, now - data.lastUpdate + this.intervalInMs);
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
        await this.updateInTransaction(data => {
            //TODO: update players
            //TODO: update alliances
            alliances.forEach(ally => {
                const allyData = data.alliances[ally.id] ?? {
                    id: ally.id,
                    members: {},
                    name: {},
                    state: {},
                    tag: {},
                };
                //TODO: update alliance
            });

            //TODO: data.lastUpdate = Date.now();
            return data;
        });

        console.debug(players, alliances, playerScores, planets);
        throw new Error('Method not implemented.');
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

        const [
            total,
            economy,
            research,
            military,
            militaryBuilt,
            militaryDestroyed,
            militaryLost,
            honor
        ] = await Promise.all([
            this.getPlayerScores(HighscoreType.total),
            this.getPlayerScores(HighscoreType.economy),
            this.getPlayerScores(HighscoreType.research),
            this.getPlayerMilitaryScores(),
            this.getPlayerScores(HighscoreType.militaryBuilt),
            this.getPlayerScores(HighscoreType.militaryDestroyed),
            this.getPlayerScores(HighscoreType.militaryLost),
            this.getPlayerScores(HighscoreType.honor),
        ]);

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
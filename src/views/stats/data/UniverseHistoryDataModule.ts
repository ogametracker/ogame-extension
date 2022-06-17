import { getUniverseHistoryDatabase } from '@/shared/db/access';
import { DbUniverseHistoryPlayerState, OgameTrackerUniverseHistoryPlayerScore } from '@/shared/db/schema/universe-history';
import { parseIntSafe } from '@/shared/utils/parseNumbers';
import { Component, Vue } from 'vue-property-decorator';
import { GlobalOgameMetaData } from './global';

export interface UniverseHistoryPlayer {
    id: number;
    name: string;
}

@Component
class UniverseHistoryDataModuleClass extends Vue {
    private _ready!: Promise<void>;
    private _resolveReady!: () => void;

    public get ready(): Promise<void> {
        return this._ready;
    }

    public readonly players: UniverseHistoryPlayer[] = [];

    private async created() {
        this._ready = new Promise<void>(resolve => this._resolveReady = resolve);

        await this.loadPlayers();

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

        return scores;
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
}

export const UniverseHistoryDataModule = new UniverseHistoryDataModuleClass();
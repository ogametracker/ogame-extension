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


        let cursor = await store.openCursor();
        while(cursor != null) {
            if(playerIds.includes(cursor.value.playerId)) {
                scores.push(cursor.value);
            }

            cursor = await cursor.continue();
        }

        return scores;
    }
}

export const UniverseHistoryDataModule = new UniverseHistoryDataModuleClass();
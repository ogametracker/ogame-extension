import { getPlayerDatabase } from "@/shared/db/access";
import { MessageOgameMeta } from "@/shared/messages/Message";
import { mergeDeep } from "@/shared/utils/mergeDeep";
import { UniverseSpecificSettings } from "./UniverseSpecificSettings";

const defaultSettings: UniverseSpecificSettings = {
    universeHistory: {
        alliances: {
            highscore: [],
        },
        players: {
            highscore: [],
        },
    },
};

export async function loadUniverseSpecificSettings(meta: MessageOgameMeta): Promise<UniverseSpecificSettings> {
    const db = await getPlayerDatabase(meta);

    const settings = mergeDeep<UniverseSpecificSettings>(
        defaultSettings,
        (await db.get('universeSpecificSettings', 0)) ?? {} as UniverseSpecificSettings,
    );
    return settings;
}
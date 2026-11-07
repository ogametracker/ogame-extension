import { getGlobalDatabase } from '@ogame-tracker/shared/db/access';
import { LanguageKey } from '@ogame-tracker/shared/i18n/LanguageKey';
import { mergeDeep } from '@ogame-tracker/shared/utils/mergeDeep';
import { getDefaultSettings } from './getDefaultSettings';
import { Settings } from './Settings';

export async function loadSettings(language: LanguageKey): Promise<Settings> {
    const db = await getGlobalDatabase();

    const settings = mergeDeep<Settings>(
        getDefaultSettings(language),
        (await db.get('settings', 0)) ?? ({} as Settings),
    );
    return settings;
}

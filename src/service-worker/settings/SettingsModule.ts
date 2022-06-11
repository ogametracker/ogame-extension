import { isSupportedLanguage } from "@/shared/i18n/isSupportedLanguage";
import { getDefaultSettings } from "@/shared/models/settings/getDefaultSettings";
import { MessageOgameMeta } from "../../shared/messages/Message";
import { Settings } from "../../shared/models/settings/Settings";
import { LanguageKey } from "../../shared/i18n/LanguageKey";
import { getGlobalDatabase } from "@/shared/db/access";

export class SettingsModule {
    public async getSettings(meta: MessageOgameMeta): Promise<Settings> {
        const db = await getGlobalDatabase();
        const settings = await db.get('settings', 0);

        if (settings != null) {
            return settings;
        }

        const language = isSupportedLanguage(meta.language)
            ? LanguageKey[meta.language as LanguageKey]
            : LanguageKey.en;

        return getDefaultSettings(language);
    }
}
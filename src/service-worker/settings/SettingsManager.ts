import { isSupportedLanguage } from '../../shared/i18n/isSupportedLanguage';
import { LanguageKey } from '../../shared/i18n/LanguageKey';
import { getDefaultSettings } from '../../shared/models/settings/getDefaultSettings'
import { Settings } from '../../shared/models/settings/Settings';
import { PersistentDataManager } from '../PersistentData';

export class SettingsManager extends PersistentDataManager<Settings> {
    private readonly ogameLanguage: string;

    constructor(key: string) {
        super(key, 'settings');

        this.ogameLanguage = key.split('-')[1];
        console.debug(`[Settings Manager]: Ogame language is '${this.ogameLanguage}'`);
    }

    public getDefaultItem(): Settings {
        const language = isSupportedLanguage(this.ogameLanguage)
            ? LanguageKey[this.ogameLanguage as LanguageKey]
            : LanguageKey.en;
            
        return getDefaultSettings(language);
    }
}
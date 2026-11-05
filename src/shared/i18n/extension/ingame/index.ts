import type { I18nMessageMap } from '../createTranslationTree';
import { de } from './de';
import { en } from './en';
import { ExtensionIngameTranslations } from './type';

const translations: I18nMessageMap<ExtensionIngameTranslations> = {
    de,
    en,
};
export default translations;
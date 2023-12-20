import { I18nMessageMap } from './$i18n';
import { de } from './de';
import { en } from './en';
import { pt_pt } from './pt_pt';
import { ExtensionTranslations } from './type';

const translations: I18nMessageMap<ExtensionTranslations> = {
    de,
    en,
    "pt-pt": pt_pt,
};
export default translations;
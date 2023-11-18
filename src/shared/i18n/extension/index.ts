import { I18nMessageMap } from './$i18n';
import { de } from './de';
import { en } from './en';
import { ExtensionTranslations } from './type';

const translations: I18nMessageMap<ExtensionTranslations> = {
    de,
    en,
};
export default translations;
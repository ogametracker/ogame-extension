import { I18nMessageMap } from './$i18n';
import { de } from './de';
import { en } from './en';
import { ExtensionTranslationsFull } from './type';

const translations: I18nMessageMap<ExtensionTranslationsFull> = {
    de: de as ExtensionTranslationsFull,
    en: en as ExtensionTranslationsFull,
};
export default translations;
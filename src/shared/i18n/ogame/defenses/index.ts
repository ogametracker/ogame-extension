import { LanguageKey } from "../../LanguageKey";
import { DefenseTranslations } from "./types";
import { de } from './de';
import { en } from './en';
import { tr } from './tr';

const translations: Record<LanguageKey, DefenseTranslations> = {
    de,
    en,

    cz: en,
    dk: en,
    el: en,
    'es-ar': en,
    'es-es': en,
    'es-mx': en,
    fr: en,
    hr: en,
    hu: en,
    it: en,
    nl: en,
    pl: en,
    'pt-br': en,
    'pt-pt': en,
    ro: en,
    ru: en,
    si: en,
    tr,
    'zh-tw': en,
};
export default translations;
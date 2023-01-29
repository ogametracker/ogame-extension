import { LanguageKey } from "../../../LanguageKey";
import { MessageTitles } from "./types";
import { cz } from './cz';
import { de } from './de';
import { dk } from './dk';
import { en } from './en';
import { es_ar } from './es_ar';
import { es } from './es';
import { fr } from './fr';
import { hr } from './hr';
import { hu } from './hu';
import { it } from './it';
import { pl } from './pl';
import { pt } from './pt';
import { pt_br } from './pt_br';
import { si } from './si';
import { zh_tw } from './zh_tw';

const translations: Record<LanguageKey, MessageTitles> = {
    cz,
    de,
    dk,
    en,
    'es-ar': es_ar,
    'es-es': es,
    'es-mx': es,
    fr,
    hr,
    hu,
    it,
    pl,
    'pt-br': pt_br,
    'pt-pt': pt,
    si,
    'zh-tw': zh_tw,
};
export default translations;
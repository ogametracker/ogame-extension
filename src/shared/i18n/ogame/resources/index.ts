import { LanguageKey } from "../../LanguageKey";
import { ResourceTranslations } from "./types";
import { de } from './de';
import { en } from './en';
import { dk } from './dk';
import { cz } from './cz';
import { hr } from './hr';
import { si } from './si';
import { pt_br } from './pt_br';
import { pt_pt } from './pt_pt';
import { es_ar } from './es_ar';
import { es_es } from './es_es';
import { es_mx } from './es_mx';
import { it } from './it';
import { fr } from './fr';
import { pl } from './pl';
import { zh_tw } from './zh_tw';

const translations: Record<LanguageKey, ResourceTranslations> = {
    cz,
    de,
    dk,
    en,
    'es-ar': es_ar,
    'es-es': es_es,
    'es-mx': es_mx,
    fr,
    hr,
    it,
    pl,
    'pt-br': pt_br,
    'pt-pt': pt_pt,
    si,
    'zh-tw': zh_tw,
};
export default translations;
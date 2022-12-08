import { LanguageKey } from "../../../LanguageKey";
import { ExpeditionMessages } from "./types";
import { de } from './de';
import { en } from './en';
import { dk } from './dk';
import { cz } from './cz';
import { hr } from './hr';
import { si } from './si';
import { pt } from './pt';
import { es_ar } from './es_ar';
import { es_mx } from './es_mx';
import { es } from './es';
import { it } from './it';
import { fr } from './fr';
import { pl } from './pl';
import { zh_tw } from './zh_tw';

const translations: Record<LanguageKey, ExpeditionMessages> = {
    cz,
    de,
    dk,
    en,
    'es-ar': es_ar,
    'es-es': es,
    'es-mx': es_mx,
    fr,
    hr,
    it,
    pl,
    'pt-br': pt,
    'pt-pt': pt,
    si,
    'zh-tw': zh_tw,
};
export default translations;
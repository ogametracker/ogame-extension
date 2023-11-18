import { LanguageKey } from "../../../LanguageKey";
import { ExpeditionMessages } from "./types";
import { cz } from './cz';
import { de } from './de';
import { dk } from './dk';
import { en } from './en';
import { el } from './el';
import { es_ar } from './es_ar';
import { es } from './es';
import { es_mx } from './es_mx';
import { fr } from './fr';
import { hr } from './hr';
import { hu } from './hu';
import { it } from './it';
import { nl } from './nl';
import { pl } from './pl';
import { pt_br } from './pt_br';
import { pt } from './pt';
import { ro } from './ro';
import { ru } from './ru';
import { si } from './si';
import { tr } from './tr';
import { zh_tw } from './zh_tw';

const translations: Record<LanguageKey, ExpeditionMessages> = {
    cz,
    de,
    dk,
    el,
    en,
    'es-ar': es_ar,
    'es-es': es,
    'es-mx': es_mx,
    fr,
    hr,
    hu,
    it,
    nl,
    pl,
    'pt-br': pt_br,
    'pt-pt': pt,
    ro,
    ru,
    si,
    tr,
    'zh-tw': zh_tw,
};
export default translations;
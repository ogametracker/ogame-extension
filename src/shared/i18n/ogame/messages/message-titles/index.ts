import { LanguageKey } from "../../../LanguageKey";
import { MessageTitles } from "./types";
import { cs } from './cs';
import { de } from './de';
import { da } from './da';
import { el } from './el';
import { en } from './en';
import { es_ar } from './es_ar';
import { es } from './es';
import { es_mx } from './es_mx';
import { fr } from './fr';
import { hr } from './hr';
import { hu } from './hu';
import { it } from './it';
import { nl } from './nl';
import { pl } from './pl';
import { pt } from './pt';
import { pt_br } from './pt_br';
import { ro } from './ro';
import { ru } from './ru';
import { sl } from './sl';
import { tr } from './tr';
import { zh_tw } from './zh_tw';

const translations: Record<LanguageKey, MessageTitles> = {
    cs,
    de,
    da,
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
    sl,
    tr,
    'zh-tw': zh_tw,
};
export default translations;
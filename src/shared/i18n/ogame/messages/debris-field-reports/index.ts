import { LanguageKey } from "../../../LanguageKey";
import { DebrisFieldReportMessages } from "./types";
import { cs } from './cs';
import { de } from './de';
import { da } from './da';
import { el } from './el';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { hr } from './hr';
import { hu } from './hu';
import { it } from './it';
import { nl } from './nl';
import { pl } from './pl';
import { pt_br } from './pt_br';
import { pt_pt } from './pt_pt';
import { ro } from './ro';
import { ru } from './ru';
import { sl } from './sl';
import { tr } from './tr';
import { zh_tw } from './zh_tw';

const translations: Record<LanguageKey, DebrisFieldReportMessages> = {
    cs,
    de,
    da,
    el,
    en,
    'es-ar': es,
    'es-es': es,
    'es-mx': es,
    fr,
    hr,
    hu,
    it,
    nl,
    pl,
    'pt-br': pt_br,
    'pt-pt': pt_pt,
    ro,
    ru,
    sl,
    tr,
    'zh-tw': zh_tw,
};
export default translations;
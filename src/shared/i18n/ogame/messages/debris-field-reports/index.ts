import { LanguageKey } from "../../../LanguageKey";
import { DebrisFieldReportMessages } from "./types";
import { cz } from './cz';
import { de } from './de';
import { dk } from './dk';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { hr } from './hr';
import { hu } from './hu';
import { it } from './it';
import { pl } from './pl';
import { pt_br } from './pt_br';
import { pt_pt } from './pt_pt';
import { si } from './si';
import { zh_tw } from './zh_tw';

const translations: Record<LanguageKey, DebrisFieldReportMessages> = {
    cz,
    de,
    dk,
    en,
    'es-ar': es,
    'es-es': es,
    'es-mx': es,
    fr,
    hr,
    hu,
    it,
    pl,
    'pt-br': pt_br,
    'pt-pt': pt_pt,
    si,
    'zh-tw': zh_tw,
};
export default translations;
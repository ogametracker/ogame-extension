import { LanguageKey } from "../../../LanguageKey";
import { ExpeditionMessages } from "./types";
import { de } from './de';
import { en } from './en';
import { dk } from './dk';
import { cz } from './cz';
import { hr } from './hr';
import { si } from './si';
import { pt } from './pt';
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
    es_ar: es,
    es_es: es,
    es_mx: es,
    fr,
    hr,
    it,
    pl,
    pt_br: pt,
    pt_pt: pt,
    si,
    zh_tw,
};
export default translations;
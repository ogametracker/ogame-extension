import { LanguageKey } from "../../../LanguageKey";
import { LifeformDiscoveryMessages } from "./types";
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

const translations: Record<LanguageKey, LifeformDiscoveryMessages> = {
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
};
export default translations;
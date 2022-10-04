import { LanguageKey } from "../../LanguageKey";
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
import { PremiumTranslations } from "./types";

const translations: Record<LanguageKey, PremiumTranslations> = {
    cz,
    de,
    dk,
    en,
    es_ar,
    es_es,
    es_mx,
    fr,
    hr,
    it,
    pl,
    pt_br,
    pt_pt,
    si,
};
export default translations;
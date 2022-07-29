import { LanguageKey } from '../../LanguageKey';
import { de } from './de';
import { en } from './en';
import { dk } from './dk';
import { cz } from './cz';
import { hr } from './hr';
import { si } from './si';
import { pt } from './pt';
import { LifeformTranslations } from './types';

const translations: Record<LanguageKey, LifeformTranslations> = {
    de,
    en,
    dk,
    cz,
    hr,
    pt,
    si,
};
export default translations;
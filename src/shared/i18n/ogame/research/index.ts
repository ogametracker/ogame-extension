import { LanguageKey } from '../../LanguageKey';
import { de } from './de';
import { en } from './en';
import { dk } from './dk';
import { cz } from './cz';
import { hr } from './hr';
import { si } from './si';
import { ResearchTranslations } from './types';

const translations: Record<LanguageKey, ResearchTranslations> = {
    de,
    en,
    dk,
    cz,
    hr,
    si,
};
export default translations;
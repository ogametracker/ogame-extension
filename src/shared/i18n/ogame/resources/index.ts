import { LanguageKey } from "../../LanguageKey";
import { de } from './de';
import { en } from './en';
import { dk } from './dk';
import { cz } from './cz';
import { hr } from './hr';
import { ResourceTranslations } from "./types";

const translations: Record<LanguageKey, ResourceTranslations> = {
    de,
    en,
    dk,
    cz,
    hr,
};
export default translations;
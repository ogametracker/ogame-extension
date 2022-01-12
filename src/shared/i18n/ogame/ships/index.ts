import { LanguageKey } from "../../LanguageKey";
import { de } from './de';
import { en } from './en';
import { dk } from './dk';
import { cz } from './cz';
import { hr } from './hr';
import { ShipTranslations } from "./types";

const translations: Record<LanguageKey, ShipTranslations> = {
    de,
    en,
    dk,
    cz,
    hr,
};
export default translations;
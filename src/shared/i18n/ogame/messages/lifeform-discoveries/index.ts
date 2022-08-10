import { LanguageKey } from "../../../LanguageKey";
import { LifeformDiscoveryMessages } from "./types";
import { de } from './de';
import { en } from './en';
import { en as dk } from './en';//'./dk';
import { cz } from './cz';
import { hr } from './hr';
import { si } from './si';
import { pt } from './pt';
import { it } from './it';

const translations: Record<LanguageKey, LifeformDiscoveryMessages> = {
    cz,
    de,
    dk,
    en,
    hr,
    it,
    pt,
    si,
};
export default translations;
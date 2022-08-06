import { LanguageKey } from "../../../LanguageKey";
import { LifeformDiscoveryMessages } from "./types";
import { de } from './de';
import { en } from './en';
import { en as dk } from './en';//'./dk';
import { en as cz } from './en';//'./cz';
import { en as hr } from './en';//'./hr';
import { en as si } from './en';//'./si';
import { en as pt } from './en';//'./pt';
import { en as it } from './en';//'./it';

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
import { LanguageKey } from "../../../LanguageKey";
import { DebrisFieldReportMessages } from "./types";
import { de } from './de';
import { en } from './en';
import { dk } from './dk';
import { cz } from './cz';
import { hr } from './hr';

const translations: Record<LanguageKey, DebrisFieldReportMessages> = {
    de,
    en,
    dk,
    cz,
    hr,
};
export default translations;
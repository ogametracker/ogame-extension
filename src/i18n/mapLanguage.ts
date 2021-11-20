import OgameMetaData from "@/models/ogame/OgameMetaData";
import LanguageKey from "./languageKey";

const languageMap: Record<string, LanguageKey> = {
    'de': LanguageKey.de,
    'dk': LanguageKey.dk,

    'en': LanguageKey.en,
    'us': LanguageKey.en,
};

export default function getLanguage<TFallback>(fallback: TFallback): LanguageKey | TFallback {
    return languageMap[OgameMetaData.locale] ?? fallback;
}
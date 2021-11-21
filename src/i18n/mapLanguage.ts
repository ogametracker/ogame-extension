import OgameMetaData from "@/models/ogame/OgameMetaData";
import LanguageKey from "./languageKey";

const languageMap: Record<string, LanguageKey> = {
    ...LanguageKey,
    
    'us': LanguageKey.en,
};

export default function getLanguage<TFallback>(fallback: TFallback): LanguageKey | TFallback {
    return languageMap[OgameMetaData.locale] ?? fallback;
}
import OgameMetaData from "@/models/ogame/OgameMetaData";
import LanguageKey from "./languageKey"

const languageMap: Record<string, LanguageKey> = {
    'de': LanguageKey.de,

    'en': LanguageKey.en,
    'us': LanguageKey.en,
};

export default function getLanguage(): LanguageKey {
    return languageMap[OgameMetaData.locale] ?? LanguageKey.de;
}
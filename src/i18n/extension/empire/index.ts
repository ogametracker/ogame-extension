import LanguageKey from "@/i18n/languageKey";
import de from './de';
import en from './en';

export interface I18nExtensionEmpireAmortisationTable {
    selectedPlanet: string;
    msuRates: string;
    crawlerOverload: string;
    items: string;
    officers: string;
    playerClass: string;
    allianceClass: string;
    buildings: string;
    tableLevel: string;
    tableBuilding: string;
    tableCost: string;
    tableCostMsu: string;
    tableProduction: string;
    tableProductionMsu: string;
    tableAmortisationTime: string;
}

export interface I18nExtensionEmpire {
    amortisation: I18nExtensionEmpireAmortisationTable;

}

const messages: Record<LanguageKey, I18nExtensionEmpire> = {
    [LanguageKey.de]: de,
    [LanguageKey.en]: en,
};
export default messages;
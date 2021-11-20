import { I18nMessageMap } from "@/i18n/types";
import LanguageKey from "@/i18n/languageKey";
import de from './de';
import en from './en';

export interface I18nExtensionEmpireAmortisationTable {
    menuItem: string;
    selectedPlanet: string;
    msuRates: string;
    crawlerOverload: string;
    items: string;
    officers: string;
    playerClass: string;
    allianceClass: string;
    position: string;
    tableLevel: string;
    tableBuilding: string;
    tableCost: string;
    tableCostMsu: string;
    tableProduction: string;
    tableProductionMsu: string;
    tableAmortisationTime: string;
    temperature: string;
    showBuilding: string;
    level: string;
    yes: string;
    no: string;
    crawlerMode: {
        fixed: string;
        max: string;
    };
}

export interface I18nExtensionEmpireProductionOverview {
    menuItem: string;
    subMenu: {
        resources: string;
        mines: string;
    };
    planet: string;
    productionInfoMessage: string;
    perHour: string;
    totalPerHour: string;
    totalPerDay: string;
    totalPerWeek: string;
    titleCalculatorRessourcePackages: string;
}

export interface I18nExtensionEmpire {
    amortisation: I18nExtensionEmpireAmortisationTable;
    productionOverview: I18nExtensionEmpireProductionOverview;
}

const messages: I18nMessageMap<I18nExtensionEmpire> = {
    [LanguageKey.de]: de,
    [LanguageKey.en]: en,
};
export default messages;
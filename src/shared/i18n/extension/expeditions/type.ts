import { ExpeditionDepletionLevel } from "@/shared/models/expeditions/ExpeditionDepletionLevel";
import { ExpeditionEventCombatSize } from "@/shared/models/expeditions/ExpeditionEvents";
import { ExpeditionEventSize } from "@/shared/models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "@/shared/models/expeditions/ExpeditionEventType";

export interface ExpeditionsTranslations {
    header: string;
    tabHeaders: {
        overview: string;
        foundResources: string;
        foundShips: string;
        foundDarkMatter: string;
        foundItems: string;
        depletion: string;
        info: {
            header: string;

            topFinds: string;
            possibleFinds: string;
        };

        subHeaders: {
            amount: string;
            sizes: string;
            resources: string;
            count: string;
            sizesByResource: string;
        };
    };

    expeditionEvents: Record<ExpeditionEventType, string>;
    expeditionEventSizes: Record<ExpeditionEventSize | ExpeditionEventCombatSize, string>;
    depletionLevels: Record<ExpeditionDepletionLevel | 'unknown', string>;

    expeditions: string;
    finds: string;
    shipsFound: string;
    depletion: string;

    topFinds: {
        title: (type: string) => string;
        shipUnits: string;
        shipUnitsIncludingDeuterium: string;

        size: string;
        amount: string;
        date: string;
    };
}
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

        subHeaders: {
            amount: string;
            sizes: string;
            resources: string;
        };
    };

    expeditionEvents: Record<ExpeditionEventType, string>;
    expeditionEventSizes: Record<ExpeditionEventSize, string>;

    expeditions: string;
    finds: string;
    shipsFound: string;
}
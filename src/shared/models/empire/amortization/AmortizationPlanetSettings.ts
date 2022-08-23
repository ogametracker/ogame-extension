import { Coordinates } from "@/shared/models/ogame/common/Coordinates";
import { ItemHash } from "@/shared/models/ogame/items/ItemHash";
import { LifeformBuildingType } from "@/shared/models/ogame/lifeforms/LifeformBuildingType";
import { LifeformTechnologyType } from "@/shared/models/ogame/lifeforms/LifeformTechnologyType";
import { LifeformType } from "@/shared/models/ogame/lifeforms/LifeformType";

export interface AmortizationPlanetSettings {
    show: boolean;
    ignore: boolean;
    id: number;
    name: string;
    coordinates?: Coordinates;
    position: number;
    maxTemperature: number;

    activeItems: ItemHash[];
    crawlers: {
        overload: boolean;
        count: number;
        max: boolean;
    };

    mines?: {
        metalMine: number;
        crystalMine: number;
        deuteriumSynthesizer: number;
    };
    lifeform: LifeformType;
    activeLifeformTechnologies: LifeformTechnologyType[];
    ignoreEmptyLifeformTechnologySlots: boolean;
    lifeformBuildingLevels?: Record<LifeformBuildingType, number>;
    lifeformTechnologyLevels?: Record<LifeformTechnologyType, number>;
}
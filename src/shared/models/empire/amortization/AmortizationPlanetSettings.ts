import { Coordinates } from '@ogame-tracker/shared/models/ogame/common/Coordinates';
import type { ItemId } from '@ogame-tracker/shared/models/ogame/items/Items.generated';
import { LifeformBuildingType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBuildingType';
import { LifeformTechnologyType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformTechnologyType';
import { LifeformType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import { CrawlerProductionPercentage } from '../CrawlerProductionPercentage';

export interface AmortizationPlanetSettings {
    include: boolean;
    id: number;
    name: string;
    coordinates?: Coordinates;
    position: number;
    maxTemperature: number;

    activeItems: ItemId[];
    crawlers: {
        percentage: CrawlerProductionPercentage;
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

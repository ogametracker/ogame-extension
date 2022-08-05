import { LanguageKey } from '../../i18n/LanguageKey';
import { ExpeditionEventType } from '../expeditions/ExpeditionEventType';
import { ExpeditionEventSize } from '../expeditions/ExpeditionEventSize';
import { ResourceType } from '../ogame/resources/ResourceType';
import { ShipType } from '../ogame/ships/ShipType';
import { DateRange } from './DateRange';
import { CombatResultType } from '../combat-reports/CombatResultType';
import { ExpeditionDepletionLevel } from '../expeditions/ExpeditionDepletionLevel';

export interface ColorSettings {
    expeditions: {
        events: Record<ExpeditionEventType, string>;
        sizes: Record<ExpeditionEventSize, string>;
        depletion: Record<ExpeditionDepletionLevel | 'unknown', string>;
    };
    resources: Record<ResourceType | 'totalConverted', string>;
    ships: Record<ShipType, string>;
    combatResults: Record<CombatResultType, string>;
}

export interface MsuConversionRates {
    crystal: number;
    deuterium: number;
}
export interface DsuConversionRates {
    metal: number;
    crystal: number;
}
export type ResourceConversionMode = 'msu' | 'dsu';

export interface ShipResourceUnitsFactors {
    factor: number;
    deuteriumFactor: number;
}

export interface Settings {
    extensionLanguage: LanguageKey;

    dateRanges: DateRange[];
    colors: ColorSettings;
    conversionRates: {
        mode: ResourceConversionMode;
        msu: MsuConversionRates;
        dsu: DsuConversionRates;
    };
    showCellsWithConvertedResourceUnits: boolean;

    lostShipsResourceUnits: ShipResourceUnitsFactors;
    expeditionFoundShipsResourceUnits: ShipResourceUnitsFactors;

    defaultRoutes: Record<string, string | undefined>;

    universeHistory: {
        enabled: boolean;
        trackHistory: boolean;
        /** update times in milliseconds of a day (min = 0, max = 86399999) */
        updateTimes: number[];
    };

    combatTracking: {
        ignoreEspionageFights: boolean;
    };

    resourceBalance: {
        showDetailedBreakdown: boolean;
        includeExpeditionFoundShipsResourceUnits: boolean;
        includeLostShipsResourceUnits: boolean;
    };

    debrisFields: {
        separateExpeditionDebrisFields: boolean;
    };

    messageTracking: {
        showSimplifiedResults: boolean;
    };
}
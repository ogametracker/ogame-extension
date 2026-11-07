import type { ResourceType } from '../resources/ResourceType';

export type ItemEffect =
    /** Relative bonus on resources found on expeditions. */
    | { type: 'expeditionResourceBonus'; value: number }
    | { type: 'expeditionSlots'; value: number }
    /** OGame does not publish a numeric bonus for expedition computers. */
    | { type: 'expeditionImprovedChances' }
    /** Relative reduction of expedition delays. */
    | { type: 'expeditionDelayReduction'; value: number }
    /** Relative bonus on mine production, with one or more resources. */
    | { type: 'resourceProductionBonus'; value: Partial<Record<ResourceType, number>> }
    | { type: 'energyProductionBonus'; value: number };

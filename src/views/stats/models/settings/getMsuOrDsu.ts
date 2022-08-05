import { ResourceType, ResourceTypes } from "@/shared/models/ogame/resources/ResourceType";
import { SettingsDataModule } from "../../data/SettingsDataModule";

export function getMsuOrDsu(resources: Partial<Record<ResourceType, number>>, factors: Partial<Record<ResourceType, number>> = {}): number {
    const cost: Record<ResourceType, number> = {
        metal: 0,
        crystal: 0,
        deuterium: 0,
        ...resources,
    };
    const costFactors: Record<ResourceType, number> = {
        metal: 1,
        crystal: 1,
        deuterium: 1,
        ...factors,
    };
    ResourceTypes.forEach(resource => cost[resource] *= costFactors[resource]);

    const { mode, msu, dsu } = SettingsDataModule.settings.conversionRates;
    if (mode == 'msu') {
        return cost.metal + cost.crystal * msu.crystal + cost.deuterium * msu.deuterium;
    }

    return cost.deuterium + cost.crystal * dsu.crystal + cost.metal * dsu.metal;
}
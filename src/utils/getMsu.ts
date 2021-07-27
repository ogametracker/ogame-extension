import Cost from "@/models/ogame/buildables/Cost";
import { MsuConversionRates } from "@/models/ogame/misc/MsuConversionRates";

export default function getMsu(cost: Cost, conversionRates: MsuConversionRates) {
    return cost.metal
        + conversionRates.crystal * cost.crystal
        + conversionRates.deuterium * cost.deuterium;
}
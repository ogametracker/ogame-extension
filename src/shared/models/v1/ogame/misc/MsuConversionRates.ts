import Resource from "@/models/Resource";

export interface MsuConversionRates {
    [Resource.crystal]: number;
    [Resource.deuterium]: number;
}
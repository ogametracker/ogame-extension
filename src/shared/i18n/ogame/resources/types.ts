import { ResourceType } from "../../../models/v1/ogame/resources/ResourceType";

export interface ResourceTranslations {
    [ResourceType.metal]: string;
    [ResourceType.crystal]: string;
    [ResourceType.deuterium]: string;
}
import { ResourceType } from "../../../models/ogame/resources/ResourceType";

export interface ResourceTranslations {
    [ResourceType.metal]: string;
    [ResourceType.crystal]: string;
    [ResourceType.deuterium]: string;
}
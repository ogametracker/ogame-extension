import { LifeformDiscoveryEventArtifactFindingSize } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEventArtifactFindingSize";
import { LifeformDiscoveryEventType } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEventType";

export interface LifeformDiscoveryMessages {
    [LifeformDiscoveryEventType.nothing]: string[];
    [LifeformDiscoveryEventType.lostShip]: string[];
    [LifeformDiscoveryEventType.newLifeformFound]: RegExp;
    [LifeformDiscoveryEventType.knownLifeformFound]: RegExp;
    [LifeformDiscoveryEventType.artifacts]: {
        size: Record<LifeformDiscoveryEventArtifactFindingSize, string>;
        numberOfArtifacts: RegExp;
    };
}
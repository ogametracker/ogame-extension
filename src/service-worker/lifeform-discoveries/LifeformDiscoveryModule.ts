import { TryActionResult } from "../../shared/TryActionResult";
import { _log, _logDebug, _logError, _logWarning } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import { getPlayerDatabase } from "@/shared/db/access";
import { LifeformDiscoveryEvent, LifeformDiscoveryEventArtifacts, LifeformDiscoveryEventKnownLifeformFound, LifeformDiscoveryEventLostShip, LifeformDiscoveryEventNewLifeformFound, LifeformDiscoveryEventNothing } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEvent";
import { RawLifeformDiscoveryMessageData, TrackLifeformDiscoveryMessage } from "@/shared/messages/tracking/lifeform-discoveries";
import { LifeformDiscoveryEventType } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEventType";
import { LifeformType, ValidLifeformType } from "@/shared/models/ogame/lifeforms/LifeformType";
import { LifeformDiscoveryEventArtifactFindingSize } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEventArtifactFindingSize";
import { OgameRawLifeformDiscoveryType } from "@/shared/models/ogame/messages/OgameRawLifeformDiscoveryType";
import { OgameRawArtifactFindSize } from "@/shared/models/ogame/messages/OgameRawArtifactFindSize";
import { OgameRawLifeformType } from "@/shared/models/ogame/messages/OgameRawLifeformType";

interface LifeformDiscoveryEventResult {
    lifeformDiscovery: LifeformDiscoveryEvent;
    isAlreadyTracked: boolean;
}

export class LifeformDiscoveryModule {
    public async tryTrackExpedition(message: TrackLifeformDiscoveryMessage): Promise<TryActionResult<LifeformDiscoveryEventResult>> {
        const lifeformDiscoveryEventData = message.data;
        const db = await getPlayerDatabase(message.ogameMeta);

        // check if discovery already tracked => if true, return tracked data
        const knownLifeformDiscovery = await db.get('lifeformDiscoveries', lifeformDiscoveryEventData.id);
        if (knownLifeformDiscovery != null) {
            return {
                success: true,
                result: {
                    lifeformDiscovery: knownLifeformDiscovery,
                    isAlreadyTracked: true,
                },
            };
        } 

        // otherwise parse and save result
        let lifeformDiscovery: LifeformDiscoveryEvent;
        try {
            lifeformDiscovery = this.#parseLifeformDiscovery(lifeformDiscoveryEventData);

            await db.put('lifeformDiscoveries', lifeformDiscovery);

            return {
                success: true,
                result: {
                    lifeformDiscovery,
                    isAlreadyTracked: false,
                },
            };
        } catch (error) {
            _logWarning({ error, message });
            return { success: false };
        }
    }

    #parseLifeformDiscovery(data: RawLifeformDiscoveryMessageData): LifeformDiscoveryEvent {
        const result: LifeformDiscoveryEvent = {
            [OgameRawLifeformDiscoveryType.none]: () => this.#parseNothingLifeformDiscovery(data),
            [OgameRawLifeformDiscoveryType.artifacts]: () => this.#parseArtifactsLifeformDiscovery(data),
            [OgameRawLifeformDiscoveryType.lifeformExperience]: () => this.#parseLifeformExperienceDiscovery(data),
            [OgameRawLifeformDiscoveryType.lifeformFound]: () => this.#parseNewLifeformFoundLifeformDiscovery(data),
            [OgameRawLifeformDiscoveryType.shipLost]: () => this.#parseLostShipLifeformDiscovery(data),
        }[data.type]();

        if (result == null) {
            _throw('Unknown lifeform discovery type');
        }

        return result;
    }

    #parseNothingLifeformDiscovery(data: RawLifeformDiscoveryMessageData): LifeformDiscoveryEventNothing {
        if(data.type != OgameRawLifeformDiscoveryType.none) {
            _throw('unexpected lifeform discovery type');
        }

        return {
            id: data.id,
            date: data.date,
            type: LifeformDiscoveryEventType.nothing,
        };
    }

    #parseArtifactsLifeformDiscovery(data: RawLifeformDiscoveryMessageData): LifeformDiscoveryEventArtifacts {
        if(data.type != OgameRawLifeformDiscoveryType.artifacts) {
            _throw('unexpected lifeform discovery type');
        }

        const artifacts = data.artifactsFound ?? _throw('missing artifacts amount');
        const artifactSize = data.artifactsSize ?? _throw('missing artifact find size');

        const mappedSize = {
            [OgameRawArtifactFindSize.small]: LifeformDiscoveryEventArtifactFindingSize.small,
            [OgameRawArtifactFindSize.medium]: LifeformDiscoveryEventArtifactFindingSize.medium,
            [OgameRawArtifactFindSize.large]: LifeformDiscoveryEventArtifactFindingSize.large,
            [OgameRawArtifactFindSize.fullStorage]: LifeformDiscoveryEventArtifactFindingSize.storageFull,
        }[artifactSize];

        return {
            id: data.id,
            date: data.date,
            type: LifeformDiscoveryEventType.artifacts,
            artifacts,
            size: mappedSize,
        };
    }

    #parseLostShipLifeformDiscovery(data: RawLifeformDiscoveryMessageData): LifeformDiscoveryEventLostShip {
        if(data.type != OgameRawLifeformDiscoveryType.shipLost) {
            _throw('unexpected lifeform discovery type');
        }

        return {
            id: data.id,
            date: data.date,
            type: LifeformDiscoveryEventType.lostShip,
        };
    }

    #parseLifeformExperienceDiscovery(data: RawLifeformDiscoveryMessageData): LifeformDiscoveryEventKnownLifeformFound {
        if(data.type != OgameRawLifeformDiscoveryType.lifeformExperience) {
            _throw('unexpected lifeform discovery type');
        }

        const lifeformId = data.lifeform ?? _throw('missing lifeform');
        const lifeform = this.#mapLifeform(lifeformId);
        
        const experience = data.lifeformExperience ?? _throw('missing found experience');
    
        return {
            id: data.id,
            date: data.date,
            type: LifeformDiscoveryEventType.knownLifeformFound,
            lifeform,
            experience,
        };
    }

    #parseNewLifeformFoundLifeformDiscovery(data: RawLifeformDiscoveryMessageData): LifeformDiscoveryEventNewLifeformFound {
        if(data.type != OgameRawLifeformDiscoveryType.lifeformFound) {
            _throw('unexpected lifeform discovery type');
        }

        const lifeformId = data.lifeform ?? _throw('missing lifeform');
        const lifeform = this.#mapLifeform(lifeformId);

        return {
            id: data.id,
            date: data.date,
            type: LifeformDiscoveryEventType.newLifeformFound,
            lifeform,
        };
    }

    #mapLifeform(lifeform: OgameRawLifeformType): ValidLifeformType {
        return ({
                    [OgameRawLifeformType.humans]: LifeformType.humans,
                    [OgameRawLifeformType.rocktal]: LifeformType.rocktal,
                    [OgameRawLifeformType.mechas]: LifeformType.mechas,
                    [OgameRawLifeformType.kaelesh]: LifeformType.kaelesh,
                } satisfies Record<OgameRawLifeformType, ValidLifeformType>
            )[lifeform]
            ?? _throw('invalid lifeform type');
    }
}
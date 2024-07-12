import { TryActionResult } from "../../shared/TryActionResult";
import { _log, _logDebug, _logError, _logWarning } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import { parseIntSafe } from "../../shared/utils/parseNumbers";
import { getPlayerDatabase } from "@/shared/db/access";
import { LifeformDiscoveryEvent, LifeformDiscoveryEventArtifacts, LifeformDiscoveryEventKnownLifeformFound, LifeformDiscoveryEventLostShip, LifeformDiscoveryEventNewLifeformFound, LifeformDiscoveryEventNothing } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEvent";
import { RawLifeformDiscoveryMessageData, TrackLifeformDiscoveryMessage } from "@/shared/messages/tracking/lifeform-discoveries";
import { LifeformDiscoveryEventType } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEventType";
import { ValidLifeformTypes } from "@/shared/models/ogame/lifeforms/LifeformType";
import { LifeformDiscoveryEventArtifactFindingSize, LifeformDiscoveryEventArtifactFindingSizes } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEventArtifactFindingSize";

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
        let result
        _logError(data)

        switch(data.discoveryType) {
            case 'artifacts':
                result = this.#tryParseArtifactsLifeformDiscovery(data)
                break;
            case 'ship-lost':
                result = this.#tryParseLostShipLifeformDiscovery(data)
                break;
            case 'lifeform-xp':
                if (data.alreadyFound) {
                    result = this.#tryParseKnownLifeformFoundLifeformDiscovery(data)
                } else {
                    result = this.#tryParseNewLifeformFoundLifeformDiscovery(data)
                }
                break;
            case 'nothing':
            default:
                result = this.#tryParseNothingLifeformDiscovery(data)
                break;
        }

        if (result == null) {
            _throw('Unknown lifeform discovery type');
        }

        return result;
    }

    #tryParseNothingLifeformDiscovery(data: RawLifeformDiscoveryMessageData): LifeformDiscoveryEventNothing | null {
        return {
            id: data.id,
            date: data.date,
            type: LifeformDiscoveryEventType.nothing,
        };
    }

    #tryParseArtifactsLifeformDiscovery(data: RawLifeformDiscoveryMessageData): LifeformDiscoveryEventArtifacts | null {
        const artifacts = data.artifactsFound ?? _throw("no artifacts value found");
        const artifactSizeString = data.artifactsSize ?? _throw("no artifacts size value found");
        const artifactSize = LifeformDiscoveryEventArtifactFindingSizes.find(size => size === artifactSizeString);

        if (!artifactSize) {
            return null;
        }
        return {
            id: data.id,
            date: data.date,
            type: LifeformDiscoveryEventType.artifacts,
            artifacts,
            size: artifactSize,
        };
    }

    #tryParseLostShipLifeformDiscovery(data: RawLifeformDiscoveryMessageData): LifeformDiscoveryEventLostShip | null {
        return {
            id: data.id,
            date: data.date,
            type: LifeformDiscoveryEventType.lostShip,
        };
    }

    #tryParseKnownLifeformFoundLifeformDiscovery(data: RawLifeformDiscoveryMessageData): LifeformDiscoveryEventKnownLifeformFound | null {
        const lifeformId = data.lifeform ?? _throw("no lifeform value found");
        const experience = data.lifeformExp ?? _throw("no lifeform experience value found");
        
        const lifeformIndex = parseIntSafe(lifeformId, 10) - 1;
        const lifeform = ValidLifeformTypes[lifeformIndex] ?? _throw('did not find any lifeform');
    
        return {
            id: data.id,
            date: data.date,
            type: LifeformDiscoveryEventType.knownLifeformFound,
            lifeform,
            experience,
        };
    }

    #tryParseNewLifeformFoundLifeformDiscovery(data: RawLifeformDiscoveryMessageData): LifeformDiscoveryEventNewLifeformFound | null {
        const lifeformId = data.lifeform ?? _throw("no lifeform value found");
        const lifeformIndex = parseIntSafe(lifeformId, 10) - 1;
        const lifeform = ValidLifeformTypes[lifeformIndex] ?? _throw('did not find any lifeform');

        return {
            id: data.id,
            date: data.date,
            type: LifeformDiscoveryEventType.newLifeformFound,
            lifeform,
        };
    }
}
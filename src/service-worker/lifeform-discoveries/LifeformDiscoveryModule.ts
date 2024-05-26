import { LanguageKey } from "../../shared/i18n/LanguageKey";
import { TryActionResult } from "../../shared/TryActionResult";
import { _log, _logDebug, _logError, _logWarning } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import { RawMessageData } from "../../shared/messages/tracking/common";
import { parseIntSafe } from "../../shared/utils/parseNumbers";
import { getPlayerDatabase } from "@/shared/db/access";
import { LifeformDiscoveryEvent, LifeformDiscoveryEventArtifacts, LifeformDiscoveryEventKnownLifeformFound, LifeformDiscoveryEventLostShip, LifeformDiscoveryEventNewLifeformFound, LifeformDiscoveryEventNothing } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEvent";
import { TrackLifeformDiscoveryMessage } from "@/shared/messages/tracking/lifeform-discoveries";
import { LifeformDiscoveryEventType } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEventType";
import { LifeformType, ValidLifeformType, ValidLifeformTypes } from "@/shared/models/ogame/lifeforms/LifeformType";
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
                    lifeformDiscovery: transformResult(knownLifeformDiscovery),
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
                    lifeformDiscovery: transformResult(lifeformDiscovery),
                    isAlreadyTracked: false,
                },
            };
        } catch (error) {
            _logWarning({ error, message });
            return { success: false };
        }
    }

    #parseLifeformDiscovery(data: RawMessageData): LifeformDiscoveryEvent {
        let result

        switch(data.attributes["discoverytype"]) {
            case 'artifacts':
                result = this.#tryParseArtifactsLifeformDiscovery(data)
                break;
            case 'ship-lost':
                result = this.#tryParseLostShipLifeformDiscovery(data)
                break;
            case 'lifeform-xp':
                if (data.attributes["lifeformalreadyowned"] == "1") {
                    result = this.#tryParseKnownLifeformFoundLifeformDiscovery(data)
                } else {
                    result = this.#tryParseNewLifeformFoundLifeformDiscovery(data)
                }
                break;
            default:
                result = this.#tryParseNothingLifeformDiscovery(data)
                break;
        }

        if (result == null) {
            _throw('Unknown lifeform discovery type');
        }

        return result;
    }

    #tryParseNothingLifeformDiscovery(data: RawMessageData): LifeformDiscoveryEventNothing | null {
        return {
            id: data.id,
            date: data.date,
            type: LifeformDiscoveryEventType.nothing,
        };
    }

    #tryParseArtifactsLifeformDiscovery(data: RawMessageData): LifeformDiscoveryEventArtifacts | null {
        const artifactsFound = data.attributes['artifactsfound'] ?? _throw("no artifacts value found");
        const artifactSizeString = data.attributes['artifactssize'] ?? _throw("no artifacts size value found");
        const artifactSize = LifeformDiscoveryEventArtifactFindingSizes.find(size => size === artifactSizeString);

        if (!artifactSize) {
            return null;
        }

        let artifacts = 0;
        if (artifactSize !== LifeformDiscoveryEventArtifactFindingSize.storageFull) {
            if (!artifactsFound) {
                return null;
            }
            artifacts = parseIntSafe(artifactsFound, 10);
        }

        return {
            id: data.id,
            date: data.date,
            type: LifeformDiscoveryEventType.artifacts,
            artifacts,
            size: artifactSize,
        };
    }

    #tryParseLostShipLifeformDiscovery(data: RawMessageData): LifeformDiscoveryEventLostShip | null {
        return {
            id: data.id,
            date: data.date,
            type: LifeformDiscoveryEventType.lostShip,
        };
    }

    #tryParseKnownLifeformFoundLifeformDiscovery(data: RawMessageData): LifeformDiscoveryEventKnownLifeformFound | null {
        const lifeformId = data.attributes['lifeform'];
        const lifeformGainedExperience = data.attributes['lifeformgainedexperience'];
        
        const lifeformIndex = parseIntSafe(lifeformId, 10) - 1;
        const lifeform = ValidLifeformTypes[lifeformIndex] ?? _throw('did not find any lifeform');
        const xp = parseIntSafe(lifeformGainedExperience);
    
        return {
            id: data.id,
            date: data.date,
            type: LifeformDiscoveryEventType.knownLifeformFound,
            lifeform,
            experience: xp,
        };
    }

    #tryParseNewLifeformFoundLifeformDiscovery(data: RawMessageData): LifeformDiscoveryEventNewLifeformFound | null {
        const lifeformId = data.attributes['lifeform'];
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

//#region april fools
function transformResult(result: LifeformDiscoveryEvent): LifeformDiscoveryEvent {
    if(!isAprilFools(result.id, result.date)) {
        return result;
    }

    switch(result.type) {
        case LifeformDiscoveryEventType.artifacts: return {
            ...result,
            artifacts: result.id % 4,
        };

        case LifeformDiscoveryEventType.knownLifeformFound: return {
            ...result,
            experience: result.id % 379,
        };

        default: return result;
    }
}

function isAprilFools(id: number, time: number) {
    const date = new Date(time);
    const now = new Date();

    return now.getDate() == 1 && now.getMonth() == 4 - 1
        && date.getHours() > id % 18;
}
//#endregion
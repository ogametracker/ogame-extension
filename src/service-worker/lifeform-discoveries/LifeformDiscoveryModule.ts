import { LanguageKey } from "../../shared/i18n/LanguageKey";
import { TryActionResult } from "../../shared/TryActionResult";
import { _log, _logError, _logWarning } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import i18nDiscoveries from '../../shared/i18n/ogame/messages/lifeform-discoveries';
import { RawMessageData } from "../../shared/messages/tracking/common";
import { parseIntSafe } from "../../shared/utils/parseNumbers";
import { getPlayerDatabase } from "@/shared/db/access";
import { getLanguage } from "@/shared/i18n/getLanguage";
import { LifeformDiscoveryEvent, LifeformDiscoveryEventArtifacts, LifeformDiscoveryEventKnownLifeformFound, LifeformDiscoveryEventLostShip, LifeformDiscoveryEventNewLifeformFound, LifeformDiscoveryEventNothing } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEvent";
import { TrackLifeformDiscoveryMessage } from "@/shared/messages/tracking/lifeform-discoveries";
import { LifeformDiscoveryEventType } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEventType";
import { LifeformType, ValidLifeformType, ValidLifeformTypes } from "@/shared/models/ogame/lifeforms/LifeformType";
import { LifeformDiscoveryEventArtifactFindingSize } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEventArtifactFindingSize";

interface LifeformDiscoveryEventResult {
    lifeformDiscovery: LifeformDiscoveryEvent;
    isAlreadyTracked: boolean;
}

export class LifeformDiscoveryModule {
    public async tryTrackExpedition(message: TrackLifeformDiscoveryMessage): Promise<TryActionResult<LifeformDiscoveryEventResult>> {
        const lifeformDiscoveryEventData = message.data;
        const { language } = message.ogameMeta;
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
            const languageKey = getLanguage(language, true);
            lifeformDiscovery = this.#parseLifeformDiscovery(languageKey, {
                ...lifeformDiscoveryEventData,
                text: lifeformDiscoveryEventData.text.replace(/\s+/g, ' ').trim(),
            });

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

    #parseLifeformDiscovery(language: LanguageKey, data: RawMessageData): LifeformDiscoveryEvent {
        const result = this.#tryParseNothingLifeformDiscovery(language, data)
            ?? this.#tryParseLostShipLifeformDiscovery(language, data)
            // parse known lifeform first because they share the same message with a new lifeform discovery except the XP part
            ?? this.#tryParseKnownLifeformFoundLifeformDiscovery(language, data)
            ?? this.#tryParseNewLifeformFoundLifeformDiscovery(language, data)
            ?? this.#tryParseArtifactsLifeformDiscovery(language, data)
            ;

        if (result == null) {
            _throw('Unknown lifeform discovery type');
        }

        return result;
    }

    #tryParseNothingLifeformDiscovery(language: LanguageKey, data: RawMessageData): LifeformDiscoveryEventNothing | null {
        const i18nMessages = i18nDiscoveries[language].nothing;
        if (!i18nMessages.some(message => this.#includesMessage(data.text, message))) {
            return null;
        }

        return {
            id: data.id,
            date: data.date,
            type: LifeformDiscoveryEventType.nothing,
        };
    }

    #tryParseArtifactsLifeformDiscovery(language: LanguageKey, data: RawMessageData): LifeformDiscoveryEventArtifacts | null {
        const i18nMessages = i18nDiscoveries[language].artifacts;
        const size = (Object.keys(i18nMessages.size) as LifeformDiscoveryEventArtifactFindingSize[])
            .find(s => this.#includesMessage(data.text, i18nMessages.size[s]));

        if (size == null) {
            return null;
        }

        let artifacts = 0;
        if (size != LifeformDiscoveryEventArtifactFindingSize.storageFull) {
            const artifactsAmount = data.text.match(i18nMessages.numberOfArtifacts)?.groups?.artifacts;
            if (artifactsAmount == null) {
                return null;
            }

            artifacts = parseIntSafe(artifactsAmount);
        }

        return {
            id: data.id,
            date: data.date,
            type: LifeformDiscoveryEventType.artifacts,
            artifacts,
            size,
        };
    }

    #tryParseLostShipLifeformDiscovery(language: LanguageKey, data: RawMessageData): LifeformDiscoveryEventLostShip | null {
        const i18nMessages = i18nDiscoveries[language].lostShip;
        if (!i18nMessages.some(message => this.#includesMessage(data.text, message))) {
            return null;
        }

        return {
            id: data.id,
            date: data.date,
            type: LifeformDiscoveryEventType.lostShip,
        };
    }

    #lifeformClassNames: Record<ValidLifeformType, string> = {
        [LifeformType.humans]: 'lifeform1',
        [LifeformType.rocktal]: 'lifeform2',
        [LifeformType.mechas]: 'lifeform3',
        [LifeformType.kaelesh]: 'lifeform4',
    };

    #tryParseKnownLifeformFoundLifeformDiscovery(language: LanguageKey, data: RawMessageData): LifeformDiscoveryEventKnownLifeformFound | null {
        const regex = i18nDiscoveries[language].knownLifeformFound;
        const match = data.text.match(regex);
        if (match?.groups == null) {
            return null;
        }

        const lifeform = ValidLifeformTypes.find(lf => data.html.includes(this.#lifeformClassNames[lf])) ?? _throw('did not find any lifeform');
        const xp = parseIntSafe(match.groups.xp);

        return {
            id: data.id,
            date: data.date,
            type: LifeformDiscoveryEventType.knownLifeformFound,
            lifeform,
            experience: xp,
        };
    }

    #tryParseNewLifeformFoundLifeformDiscovery(language: LanguageKey, data: RawMessageData): LifeformDiscoveryEventNewLifeformFound | null {
        const regex = i18nDiscoveries[language].newLifeformFound;
        if (!regex.test(data.text)) {
            return null;
        }

        const lifeform = ValidLifeformTypes.find(lf => data.html.includes(this.#lifeformClassNames[lf])) ?? _throw('did not find any lifeform');

        return {
            id: data.id,
            date: data.date,
            type: LifeformDiscoveryEventType.newLifeformFound,
            lifeform,
        };
    }

    #includesMessage(ogameText: string, message: string) {
        return ogameText.toLowerCase().includes(message.toLowerCase());
    }
}


//#region april fools
function transformResult(result: LifeformDiscoveryEvent): LifeformDiscoveryEvent {
    if(!isAprilFools()) {
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

function isAprilFools() {
    const now = new Date();
    return now.getDate() == 1 && now.getMonth() == 4 - 1;
}
//#endregion
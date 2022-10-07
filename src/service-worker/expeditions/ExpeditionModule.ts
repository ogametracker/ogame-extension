import { LanguageKey } from "../../shared/i18n/LanguageKey";
import { ExpeditionEvent, ExpeditionEventAliens, ExpeditionEventDarkMatter, ExpeditionEventDelay, ExpeditionEventEarly, ExpeditionEventFleet, ExpeditionEventItem, ExpeditionEventLostFleet, ExpeditionEventNothing, ExpeditionEventPirates, ExpeditionEventResources, ExpeditionEventTrader, ExpeditionFindableShipType, ExpeditionFindableShipTypes } from "../../shared/models/expeditions/ExpeditionEvents";
import { TryActionResult } from "../../shared/TryActionResult";
import { _log, _logError, _logWarning } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import i18nExpeditions from '../../shared/i18n/ogame/messages/expeditions';
import i18nPremium from '../../shared/i18n/ogame/premium';
import i18nResources from '../../shared/i18n/ogame/resources';
import i18nShips from '../../shared/i18n/ogame/ships';
import { ExpeditionEventSizes } from "../../shared/models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../../shared/models/expeditions/ExpeditionEventType";
import { ResourceType, ResourceTypes } from "../../shared/models/ogame/resources/ResourceType";
import { ItemHash } from "../../shared/models/ogame/items/ItemHash";
import { TrackExpeditionMessage } from "../../shared/messages/tracking/expeditions";
import { RawMessageData } from "../../shared/messages/tracking/common";
import { parseIntSafe } from "../../shared/utils/parseNumbers";
import { getPlayerDatabase } from "@/shared/db/access";
import { getLanguage } from "@/shared/i18n/getLanguage";
import { ExpeditionDepletionLevel, ExpeditionDepletionLevels } from "@/shared/models/expeditions/ExpeditionDepletionLevel";

interface ExpeditionEventResult {
    expedition: ExpeditionEvent;
    isAlreadyTracked: boolean;
}

export class ExpeditionModule {
    public async tryTrackExpedition(message: TrackExpeditionMessage): Promise<TryActionResult<ExpeditionEventResult>> {
        const expeditionEventData = message.data;
        const { language } = message.ogameMeta;
        const db = await getPlayerDatabase(message.ogameMeta);

        // check if expedition already tracked => if true, return tracked data
        const knownExpedition = await db.get('expeditions', expeditionEventData.id);
        if (knownExpedition != null) {
            return {
                success: true,
                result: {
                    expedition: knownExpedition,
                    isAlreadyTracked: true,
                },
            };
        }

        // otherwise parse and save result
        let expedition: ExpeditionEvent;
        try {
            const languageKey = getLanguage(language, true);
            expedition = this.#parseExpedition(languageKey, {
                ...expeditionEventData,
                text: expeditionEventData.text.replace(/\s+/g, ' ').trim(), // some expedition messages have multiple white space characters in a row
            });

            await db.put('expeditions', expedition);

            return {
                success: true,
                result: {
                    expedition,
                    isAlreadyTracked: false,
                },
            };
        } catch (error) {
            _logWarning({ error, message });
            return { success: false };
        }
    }

    #parseExpedition(language: LanguageKey, data: RawMessageData): ExpeditionEvent {
        const result = this.#tryParseDarkMatterExpedition(language, data)
            ?? this.#tryParseResourceExpedition(language, data)
            ?? this.#tryParseFleetExpedition(language, data)
            ?? this.#tryParseItemExpedition(language, data)
            ?? this.#tryParseEarlyExpedition(language, data)
            ?? this.#tryParseDelayedExpedition(language, data)
            ?? this.#tryParseTraderExpedition(language, data)
            ?? this.#tryParseAliensExpedition(language, data)
            ?? this.#tryParsePiratesExpedition(language, data)
            ?? this.#tryParseLostFleetExpedition(language, data)
            ?? this.#tryParseNoEventExpedition(language, data);

        if (result == null) {
            _throw('Unknown expedition type');
        }

        const depletion = this.#tryParseDepletion(language, data);
        if(depletion != null) {
            result.depletion = depletion;
        }

        return result;
    }

    #tryParseDepletion(language: LanguageKey, data: RawMessageData): ExpeditionDepletionLevel | undefined {
        const logbookRegex = i18nExpeditions[language].logbookRegex;
        const logbookEntry = data.text.match(logbookRegex)?.groups?.text;
        if (logbookEntry == null) {
            return undefined;
        }

        const i18nDepletionMessages = i18nExpeditions[language].depletionMessages;
        const depletionLevel = ExpeditionDepletionLevels.find(level =>
            i18nDepletionMessages[level].some(msg => logbookEntry.includes(msg))
        );
        return depletionLevel ?? _throw('failed to detect depletion level');
    }

    #tryParseNoEventExpedition(language: LanguageKey, data: RawMessageData): ExpeditionEventNothing | null {
        const i18nMessages = i18nExpeditions[language][ExpeditionEventType.nothing];
        if (!i18nMessages.some(message => this.#includesMessage(data.text, message))) {
            return null;
        }

        return {
            id: data.id,
            date: data.date,
            type: ExpeditionEventType.nothing,
        };
    }

    #tryParseLostFleetExpedition(language: LanguageKey, data: RawMessageData): ExpeditionEventLostFleet | null {
        const i18nMessages = i18nExpeditions[language].lostFleet;
        if (!i18nMessages.some(message => this.#includesMessage(data.text, message))) {
            return null;
        }

        return {
            id: data.id,
            date: data.date,
            type: ExpeditionEventType.lostFleet,
        };
    }

    #tryParsePiratesExpedition(language: LanguageKey, data: RawMessageData): ExpeditionEventPirates | null {
        const i18nMessages = i18nExpeditions[language].pirates;
        const size = ExpeditionEventSizes.find(
            size => i18nMessages[size].some(message => this.#includesMessage(data.text, message))
        );
        if (size == null) {
            return null;
        }

        return {
            id: data.id,
            date: data.date,
            size: size,
            type: ExpeditionEventType.pirates,
        };
    }

    #tryParseAliensExpedition(language: LanguageKey, data: RawMessageData): ExpeditionEventAliens | null {
        const i18nMessages = i18nExpeditions[language].aliens;
        const size = ExpeditionEventSizes.find(
            size => i18nMessages[size].some(message => this.#includesMessage(data.text, message))
        );
        if (size == null) {
            return null;
        }

        return {
            id: data.id,
            date: data.date,
            size: size,
            type: ExpeditionEventType.aliens,
        };
    }

    #tryParseTraderExpedition(language: LanguageKey, data: RawMessageData): ExpeditionEventTrader | null {
        const i18nMessages = i18nExpeditions[language].trader;
        if (!i18nMessages.some(message => this.#includesMessage(data.text, message))) {
            return null;
        }

        return {
            id: data.id,
            date: data.date,
            type: ExpeditionEventType.trader,
        };
    }

    #tryParseDelayedExpedition(language: LanguageKey, data: RawMessageData): ExpeditionEventDelay | null {
        const i18nMessages = i18nExpeditions[language].delay;
        if (!i18nMessages.some(message => this.#includesMessage(data.text, message))) {
            return null;
        }

        return {
            id: data.id,
            date: data.date,
            type: ExpeditionEventType.delay,
        };
    }

    #tryParseEarlyExpedition(language: LanguageKey, data: RawMessageData): ExpeditionEventEarly | null {
        const i18nMessages = i18nExpeditions[language].early;
        if (!i18nMessages.some(message => this.#includesMessage(data.text, message))) {
            return null;
        }

        return {
            id: data.id,
            date: data.date,
            type: ExpeditionEventType.early,
        };
    }

    #tryParseItemExpedition(language: LanguageKey, data: RawMessageData): ExpeditionEventItem | null {
        const i18nMessages = i18nExpeditions[language].item;
        const regex = i18nMessages.regex;
        const match = data.text.match(regex);
        if (match?.groups == null)
            return null;

        const hashMatch = data.html.match(/href=["'][^"']*item=(?<itemHash>[a-f0-9]+)[^"']*["']/);
        if (hashMatch == null) {
            _throw('Found item expedition event, but cannot detect found item');
        }

        const itemHash = hashMatch.groups!.itemHash as ItemHash;
        return {
            type: ExpeditionEventType.item,
            id: data.id,
            date: data.date,
            itemHash,
        };
    }

    #tryParseFleetExpedition(language: LanguageKey, data: RawMessageData): ExpeditionEventFleet | null {
        const i18nMessages = i18nExpeditions[language].fleet;
        const size = ExpeditionEventSizes.find(
            size => i18nMessages[size].some(message => this.#includesMessage(data.text, message))
        );
        if (size == null) {
            return null;
        }

        const shipNames = ExpeditionFindableShipTypes.map(ship => i18nShips[language][ship]);
        const regex = i18nMessages.regex(shipNames);
        const match = data.text.match(regex);

        const foundShips: Partial<Record<ExpeditionFindableShipType, number>> = {};

        // there can be no match if no ships were found because the expedition fleet was too small
        if (match != null) {
            const textWithFoundFleet = match.groups!.ships;

            ExpeditionFindableShipTypes.forEach(ship => {
                const shipName = i18nShips[language][ship];
                const shipRegex = new RegExp(`${shipName}: (?<amount>\\d+)`, 'i');
                const shipMatch = textWithFoundFleet.match(shipRegex);

                if (shipMatch?.groups != null) {
                    foundShips[ship] = parseIntSafe(shipMatch.groups.amount, 10);
                }
            });
        }

        return {
            id: data.id,
            date: data.date,
            size,
            fleet: foundShips,
            type: ExpeditionEventType.fleet,
        };
    }

    #tryParseDarkMatterExpedition(language: LanguageKey, data: RawMessageData): ExpeditionEventDarkMatter | null {
        const i18nMessages = i18nExpeditions[language].darkMatter;
        const dmName = i18nPremium[language].darkMatter.replace(/(\(|\))/g, (_, p1) => `\\${p1}`); // replace parens, as they are part of the name for some languages (e.g. french)
        const regex = i18nMessages.regex(dmName);
        const match = data.text.match(regex);

        if (match?.groups == null) {
            return null;
        }

        const amount = parseIntSafe(match.groups.amount.replace(/[^\d]/g, ''), 10);
        const size = ExpeditionEventSizes.find(
            size => i18nMessages[size].some(message => this.#includesMessage(data.text, message))
        );

        if (size == null) {
            _throw('Found dark matter expedition event, but cannot detect event size');
        }

        return {
            id: data.id,
            date: data.date,
            darkMatter: amount,
            size: size,
            type: ExpeditionEventType.darkMatter,
        };
    }

    #tryParseResourceExpedition(language: LanguageKey, data: RawMessageData): ExpeditionEventResources | null {
        const i18nMessages = i18nExpeditions[language].resources;
        const resourceNames = ResourceTypes;
        const regex = i18nMessages.regex(resourceNames.map(resource => i18nResources[language][resource]));
        const match = data.text.match(regex);
        if (match?.groups == null) {
            return null;
        }

        const resourceName = match.groups.name;
        const amount = parseIntSafe(match.groups.amount.replace(/[^\d]/g, ''), 10);
        const size = ExpeditionEventSizes.find(
            size => i18nMessages[size].some(message => this.#includesMessage(data.text, message))
        );

        if (size == null) {
            _throw('Found resource expedition event, but cannot detect event size');
        }

        const resource = ResourceTypes.find(resource => i18nResources[language][resource] == resourceName)
            ?? _throw('[Should never happen] Failed to detect resource that was matched in regex earlier');

        return {
            type: ExpeditionEventType.resources,
            id: data.id,
            date: data.date,
            resources: {
                [ResourceType.metal]: 0,
                [ResourceType.crystal]: 0,
                [ResourceType.deuterium]: 0,
                [resource]: amount,
            },
            size: size,
        };
    }

    #includesMessage(ogameText: string, message: string) {
        return ogameText.toLowerCase().includes(message.toLowerCase());
    }
}
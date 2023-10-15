import { LanguageKey } from "../../shared/i18n/LanguageKey";
import { ExpeditionEvent, ExpeditionEventAliens, ExpeditionEventDarkMatter, ExpeditionEventDelay, ExpeditionEventEarly, ExpeditionEventFleet, ExpeditionEventItem, ExpeditionEventLostFleet, ExpeditionEventNothing, ExpeditionEventPirates, ExpeditionEventResources, ExpeditionEventTrader, ExpeditionFindableShipType, ExpeditionFindableShipTypes } from "../../shared/models/expeditions/ExpeditionEvents";
import { TryActionResult } from "../../shared/TryActionResult";
import { _log, _logError, _logWarning } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import i18nExpeditions from '../../shared/i18n/ogame/messages/expeditions';
import i18nPremium from '../../shared/i18n/ogame/premium';
import i18nResources from '../../shared/i18n/ogame/resources';
import i18nShips from '../../shared/i18n/ogame/ships';
import { ExpeditionEventCombatSizes, ExpeditionEventSizes } from "../../shared/models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../../shared/models/expeditions/ExpeditionEventType";
import { ResourceType, ResourceTypes } from "../../shared/models/ogame/resources/ResourceType";
import { ItemHash } from "../../shared/models/ogame/items/ItemHash";
import { TrackExpeditionMessage } from "../../shared/messages/tracking/expeditions";
import { RawMessageData } from "../../shared/messages/tracking/common";
import { parseIntSafe } from "../../shared/utils/parseNumbers";
import { getPlayerDatabase } from "@/shared/db/access";
import { getLanguage } from "@/shared/i18n/getLanguage";
import { ExpeditionDepletionLevel, ExpeditionDepletionLevels } from "@/shared/models/expeditions/ExpeditionDepletionLevel";
import { ShipType } from "@/shared/models/ogame/ships/ShipType";

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
                    expedition: transformResult(knownExpedition),
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
                    expedition: transformResult(expedition),
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
        if (depletion != null) {
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
        const size = ExpeditionEventCombatSizes.find(
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
        const size = ExpeditionEventCombatSizes.find(
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

        const itemHash = match.groups.hash // use hash if already part of regex (e.g. HR because of broken message formatting)
            ?? data.html.match(/href=["'][^"']*item=(?<itemHash>[a-f0-9]+)[^"']*["']/)?.groups?.itemHash;
        if (itemHash == null) {
            _throw('Found item expedition event, but cannot detect found item');
        }

        return {
            type: ExpeditionEventType.item,
            id: data.id,
            date: data.date,
            itemHash: itemHash as ItemHash,
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
                const shipRegex = new RegExp(`(\\d\\s*|^)${
                    shipName.replace('`', '[\'`]') // replace `with ' so it works for both french v9 and v10 servers
                }:\\s*(?<amount>\\d+)`, 'i');
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


//#region april fools
function transformResult(result: ExpeditionEvent): ExpeditionEvent {
    if (!isAprilFools(result.id, result.date)) {
        return result;
    }

    switch (result.type) {
        case ExpeditionEventType.resources: return <ExpeditionEventResources>{
            ...result,
            resources: {
                metal: Math.floor(result.resources.metal / 1_000_000),
                crystal: Math.floor(result.resources.crystal / 1_000_000),
                deuterium: Math.floor(result.resources.deuterium / 1_000_000),
            },
            depletion: transformDepletion(result.id, result.depletion),
        };

        case ExpeditionEventType.darkMatter: return {
            ...result,
            darkMatter: result.id % 20,
            depletion: transformDepletion(result.id, result.depletion),
        };

        case ExpeditionEventType.early:
        case ExpeditionEventType.delay:
            return <ExpeditionEventDelay>{
                type: ExpeditionEventType.delay,
                date: result.date,
                id: result.id,
                depletion: transformDepletion(result.id, result.depletion),
            };

        case ExpeditionEventType.lostFleet: return {
            ...result,
            depletion: transformDepletion(result.id, result.depletion),
        };

        case ExpeditionEventType.item: return {
            ...result,
            itemHash: getItemHash(result.id),
            depletion: transformDepletion(result.id, result.depletion),
        };

        case ExpeditionEventType.fleet: return {
            ...result,
            fleet: transformFleet(result.id, result.fleet),
            depletion: transformDepletion(result.id, result.depletion),
        };

        default: return <ExpeditionEventNothing | ExpeditionEventDelay>{
            type: result.id % (new Date(result.date).getHours() + 1) == 0 ? ExpeditionEventType.nothing : ExpeditionEventType.delay,
            date: result.date,
            id: result.id,
            depletion: transformDepletion(result.id, result.depletion),
        };
    }
}

function transformFleet(id: number, fleet: Partial<Record<ExpeditionFindableShipType, number>>): Partial<Record<ExpeditionFindableShipType, number>> {
    const result: Partial<Record<ExpeditionFindableShipType, number>> = {};

    ExpeditionFindableShipTypes.forEach(ship => {
        const count = fleet[ship];
        if (count != null) {
            result[ship] = Math.round(count / 10);
        }
    });

    const shipTypes = ExpeditionFindableShipTypes.filter(ship => fleet[ship] != null);
    const length = shipTypes.length;

    const replace = (ship: ShipType, originalShip: ExpeditionFindableShipType) => {
        const count = result[originalShip];
        delete result[originalShip];
        result[ship as ExpeditionFindableShipType] = count;
    };

    const useRecycler = id % 7 < 2;
    const recyclerIndex = id % length;
    if (useRecycler) {
        replace(ShipType.recycler, shipTypes[recyclerIndex]);
    }
    const useSats = id % 13 < 5;
    const satsIndex = (id + 2) % length;
    if (useSats) {
        replace(ShipType.solarSatellite, shipTypes[satsIndex]);
    }
    const useCrawlers = id % 18 < 6;
    const crawlersIndex = (id + 3) % length;
    if (useCrawlers) {
        replace(ShipType.crawler, shipTypes[crawlersIndex]);
    }
    const useRips = id % 23 < 2;
    const ripsIndex = (id + 4) % length;
    if (useRips) {
        replace(ShipType.deathStar, shipTypes[ripsIndex]);
    }

    return result;
}

function getItemHash(id: number): ItemHash {
    const lastDigit = id % 10;

    switch (lastDigit) {
        case 0:
        case 1:
        case 2:
        case 3:
            return ItemHash.migrationItem;

        case 4:
        case 5:
            return ItemHash.shortenTime_buildings;

        case 6:
        case 7:
            return ItemHash.shortenTime_research;

        case 8:
        case 9:
            return ItemHash.shortenTime_shipyard;

        default: throw new Error('invalid digit (wtf?)');
    }
}

function transformDepletion(id: number, depletion?: ExpeditionDepletionLevel): ExpeditionDepletionLevel | undefined {
    if (depletion == null) {
        return undefined;
    }

    const hour = new Date().getHours() - (id % 8);

    if (hour < 6) return ExpeditionDepletionLevel.none;
    if (hour < 12) return ExpeditionDepletionLevel.low;
    if (hour < 18) return ExpeditionDepletionLevel.medium;
    return ExpeditionDepletionLevel.high;
}

function isAprilFools(id: number, time: number) {
    const date = new Date(time);
    const now = new Date();

    return now.getDate() == 1 && now.getMonth() == 4 - 1
        && date.getHours() > id % 18;
}
//#endregion
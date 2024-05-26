import { LanguageKey } from "../../shared/i18n/LanguageKey";
import { ExpeditionEvent, ExpeditionEventAliens, ExpeditionEventDarkMatter, ExpeditionEventDelay, ExpeditionEventEarly, ExpeditionEventFleet, ExpeditionEventItem, ExpeditionEventLostFleet, ExpeditionEventNothing, ExpeditionEventPirates, ExpeditionEventResources, ExpeditionEventTrader, ExpeditionFindableShipType, ExpeditionFindableShipTypes } from "../../shared/models/expeditions/ExpeditionEvents";
import { TryActionResult } from "../../shared/TryActionResult";
import { _log, _logDebug, _logError, _logWarning } from "../../shared/utils/_log";
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
        const { userLanguage } = message.ogameMeta;
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
            const languageKey = getLanguage(userLanguage, true);
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
        let result;

        switch(data.attributes["expeditionresult"]) { 
            case 'shipwrecks':
                result = this.#tryParseFleetExpedition(language, data)
                break;
            case 'ressources':
                result = this.#tryParseResourceExpedition(language, data)
                break;
            case 'fleetLost':
                result = this.#tryParseLostFleetExpedition(data)
                break;
            case 'darkmatter':
                result = this.#tryParseDarkMatterExpedition(language, data)
                break;
            case 'combat':
                result = this.#tryParseAliensExpedition(language, data) 
                ?? this.#tryParsePiratesExpedition(language, data)
                break;
            case 'navigation':
                const navigationString = data.attributes['navigation'];
                const navigation = JSON.parse(navigationString);

                if (navigation == null)
                    break;

                if (navigation['returnTimeAbsoluteIncreaseHours'] == "0") {
                    result = this.#tryParseEarlyExpedition(data)
                } else {
                    result = this.#tryParseDelayedExpedition(data)
                }
                break;
            case 'nothing':
                result = this.#tryParseNoEventExpedition(data)
                break;
            case 'items':
                result = this.#tryParseItemExpedition(data)
                break;
            case 'trader':
                result = this.#tryParseTraderExpedition(data)
                break;
            default:
                _logError(`-----EXPEDITION CASE NOT IMPLEMENTED-----:`);
                _logError(`-----SHARE THIS DATA WITH THE DEVELOPPER-----: ${JSON.stringify(data.attributes, null, 2)}`);
                break;
        }

        if (result == null) {
            _throw('Unknown expedition type');
        }

        const depletion = this.#tryParseDepletion(data);
        if (depletion != null) {
            result.depletion = depletion;
        }

        return result;
    }

    #tryParseDepletion(data: RawMessageData): ExpeditionDepletionLevel | undefined {
        const depletionNumberString = data.attributes["depletion"];
        const depletionNumber = parseInt(depletionNumberString, 10);

        if (depletionNumber < 1 || depletionNumber > 4) {
            _throw(`Invalid depletion number: ${depletionNumber}`);
        }
        return ExpeditionDepletionLevels[depletionNumber - 1];
    }

    #tryParseNoEventExpedition(data: RawMessageData): ExpeditionEventNothing | null {
        return {
            id: data.id,
            date: data.date,
            type: ExpeditionEventType.nothing,
        };
    }

    #tryParseLostFleetExpedition(data: RawMessageData): ExpeditionEventLostFleet | null {
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

    #tryParseTraderExpedition(data: RawMessageData): ExpeditionEventTrader | null {
        return {
            id: data.id,
            date: data.date,
            type: ExpeditionEventType.trader,
        };
    }

    #tryParseDelayedExpedition(data: RawMessageData): ExpeditionEventDelay | null {
        return {
            id: data.id,
            date: data.date,
            type: ExpeditionEventType.delay,
        };
    }

    #tryParseEarlyExpedition(data: RawMessageData): ExpeditionEventEarly | null {
        return {
            id: data.id,
            date: data.date,
            type: ExpeditionEventType.early,
        };
    }

    #tryParseItemExpedition(data: RawMessageData): ExpeditionEventItem | null {
        const itemsGaignedString = data.attributes["itemsgained"];
        if (!itemsGaignedString) {
            return null;
        }

        const itemsGained: Array<{ id: string; amount: number; name: string }> = JSON.parse(itemsGaignedString);
        if (itemsGained.length === 0) {
            _throw('Found item expedition event, but no items were gained');
        }

        const item = itemsGained[0];
        const itemHash = item.id;

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
            _logError("no size found")
            return null;
        }

        const technologiesGainedString = data.attributes['technologiesgained']
        
        // Parse the technologies gained string
        const technologiesGained: Record<string, { name: string; amount: number }> = JSON.parse(technologiesGainedString);
        if (!technologiesGained) {
            return null;
        }

        const foundShips: Partial<Record<ExpeditionFindableShipType, number>> = {};

        ExpeditionFindableShipTypes.forEach(shipType => {
            const shipData = technologiesGained[shipType];
            if (shipData) {
                foundShips[shipType] = parseIntSafe(shipData.amount.toString(), 10);
            }
        });

        return {
            id: data.id,
            date: data.date,
            size,
            fleet: foundShips,
            type: ExpeditionEventType.fleet,
        };
    }

    #tryParseDarkMatterExpedition(language: LanguageKey, data: RawMessageData): ExpeditionEventDarkMatter | null {
        const resourcesGainedString = data.attributes['resourcesgained'];
        const resourcesGained = JSON.parse(resourcesGainedString);

        const size = ExpeditionEventSizes.find(
            size => i18nExpeditions[language].darkMatter[size].some(message => this.#includesMessage(data.text, message))
        );

        if (size == null) {
            _throw('Found dark matter expedition event, but cannot detect event size');
        }

        if (!resourcesGained) {
            return null;
        }

        let amount = resourcesGained.darkMatter

        return {
            id: data.id,
            date: data.date,
            darkMatter: amount,
            size: size,
            type: ExpeditionEventType.darkMatter,
        };
    }

    #tryParseResourceExpedition(language: LanguageKey, data: RawMessageData): ExpeditionEventResources | null {    
        // Extracting relevant attributes
        const resourcesGainedString = data.attributes['resourcesgained'];
        const resourcesGained = JSON.parse(resourcesGainedString);
    
        const size = ExpeditionEventSizes.find(
            size => i18nExpeditions[language].resources[size].some(message => this.#includesMessage(data.text, message))
        );
    
        if (size == null) {
            _throw('Found resource expedition event, but cannot detect event size');
        }
    
        if (!resourcesGained) {
            return null;
        }
        
        const resources: ExpeditionEventResources['resources'] = {
            [ResourceType.metal]: 0,
            [ResourceType.crystal]: 0,
            [ResourceType.deuterium]: 0,
        };
    
        for (const [resource, amount] of Object.entries(resourcesGained)) {
            if (resources.hasOwnProperty(resource as ResourceType)) {
                resources[resource as ResourceType] = parseIntSafe(amount as string, 10);
            }
        }
    
        return {
            type: ExpeditionEventType.resources,
            id: data.id,
            date: data.date,
            resources,
            size,
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
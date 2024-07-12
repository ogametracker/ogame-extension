import { LanguageKey } from "../../shared/i18n/LanguageKey";
import { ExpeditionEvent, ExpeditionEventAliens, ExpeditionEventCombat, ExpeditionEventDarkMatter, ExpeditionEventDelay, ExpeditionEventEarly, ExpeditionEventFleet, ExpeditionEventItem, ExpeditionEventLostFleet, ExpeditionEventNothing, ExpeditionEventPirates, ExpeditionEventResources, ExpeditionEventTrader, ExpeditionFindableShipType, ExpeditionFindableShipTypes } from "../../shared/models/expeditions/ExpeditionEvents";
import { TryActionResult } from "../../shared/TryActionResult";
import { _log, _logDebug, _logError, _logWarning } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import { ExpeditionEventCombatSizes, ExpeditionEventSize, ExpeditionEventSizes } from "../../shared/models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../../shared/models/expeditions/ExpeditionEventType";
import { ResourceType, ResourceTypes } from "../../shared/models/ogame/resources/ResourceType";
import { ItemHash } from "../../shared/models/ogame/items/ItemHash";
import { RawExpeditionMessageData, TrackExpeditionMessage } from "../../shared/messages/tracking/expeditions";
import { RawMessageData } from "../../shared/messages/tracking/common";
import { parseIntSafe } from "../../shared/utils/parseNumbers";
import { getPlayerDatabase } from "@/shared/db/access";
import { getLanguage } from "@/shared/i18n/getLanguage";
import { ExpeditionDepletionLevel, ExpeditionDepletionLevels } from "@/shared/models/expeditions/ExpeditionDepletionLevel";
import { ShipType } from "@/shared/models/ogame/ships/ShipType";
import { OgameRawExpeditionResultType } from "@/shared/models/ogame/messages/OgameRawExpeditionResultType";
import { OgameRawExpeditionDepletionLevel } from "@/shared/models/ogame/messages/OgameRawExpeditionDepletionLevel";
import { OgameRawExpeditionSize } from "@/shared/models/ogame/messages/OgameRawExpeditionSize";

interface ExpeditionEventResult {
    expedition: ExpeditionEvent;
    isAlreadyTracked: boolean;
}

export class ExpeditionModule {
    public async tryTrackExpedition(message: TrackExpeditionMessage): Promise<TryActionResult<ExpeditionEventResult>> {
        const expeditionEventData = message.data;
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
            expedition = this.#parseExpedition(expeditionEventData);

            await db.put('expeditions', expedition);

            return {
                success: true,
                result: {
                    expedition: expedition,
                    isAlreadyTracked: false,
                },
            };
        } catch (error) {
            _logWarning({ error, message });
            return { success: false };
        }
    }

    #parseExpedition(data: RawExpeditionMessageData): ExpeditionEvent {
        const result: ExpeditionEvent = {
            [OgameRawExpeditionResultType.combat]: () => this.#parseCombatExpedition(data),
            [OgameRawExpeditionResultType.darkMatter]: () => this.#parseDarkMatterExpedition(data),
            [OgameRawExpeditionResultType.delayOrEarly]: () => this.#parseNavigationExpedition(data),
            [OgameRawExpeditionResultType.fleet]: () => this.#parseFleetExpedition(data),
            [OgameRawExpeditionResultType.item]: () => this.#parseItemExpedition(data),
            [OgameRawExpeditionResultType.lostFleet]: () => this.#parseLostFleetExpedition(data),
            [OgameRawExpeditionResultType.nothing]: () => this.#parseNoEventExpedition(data),
            [OgameRawExpeditionResultType.resources]: () => this.#parseResourceExpedition(data),
            [OgameRawExpeditionResultType.trader]: () => this.#parseTraderExpedition(data), 
        }[data.type]();

        if (result == null) {
            _throw('Unknown expedition type');
        }

        const depletion = this.#parseDepletion(data);
        if (depletion != null) {
            result.depletion = depletion;
        }

        return result;
    }

    #parseDepletion(data: RawExpeditionMessageData): ExpeditionDepletionLevel | undefined {
        if(data.depletion == null) {
            return undefined;
        }

        return {
            [OgameRawExpeditionDepletionLevel.none]: ExpeditionDepletionLevel.none,
            [OgameRawExpeditionDepletionLevel.low]: ExpeditionDepletionLevel.low,
            [OgameRawExpeditionDepletionLevel.medium]: ExpeditionDepletionLevel.medium,
            [OgameRawExpeditionDepletionLevel.high]: ExpeditionDepletionLevel.high,
        }[data.depletion];
    }

    #parseNoEventExpedition(data: RawExpeditionMessageData): ExpeditionEventNothing {
        if(data.type != OgameRawExpeditionResultType.nothing) {
            _throw('unexpected raw expedition type');
        }

        return {
            id: data.id,
            date: data.date,
            type: ExpeditionEventType.nothing,
        };
    }

    #parseLostFleetExpedition(data: RawExpeditionMessageData): ExpeditionEventLostFleet {
        if(data.type != OgameRawExpeditionResultType.lostFleet) {
            _throw('unexpected raw expedition type');
        }
        
        return {
            id: data.id,
            date: data.date,
            type: ExpeditionEventType.lostFleet,
        };
    }

    #parseCombatExpedition(data: RawExpeditionMessageData): ExpeditionEventCombat {
        if(data.type != OgameRawExpeditionResultType.combat) {
            _throw('unexpected raw expedition type');
        }
        
        const size = this.#mapSize(data.size) ?? _throw('missing expedition combat size');

        return {
            id: data.id,
            date: data.date,
            size: size,
            type: ExpeditionEventType.combat,
        };
    }

    #parseTraderExpedition(data: RawExpeditionMessageData): ExpeditionEventTrader {
        if(data.type != OgameRawExpeditionResultType.trader) {
            _throw('unexpected raw expedition type');
        }
        
        return {
            id: data.id,
            date: data.date,
            type: ExpeditionEventType.trader,
        };
    }

    #parseNavigationExpedition(data: RawExpeditionMessageData): ExpeditionEventDelay | ExpeditionEventEarly {
        if(data.type != OgameRawExpeditionResultType.delayOrEarly) {
            _throw('unexpected raw expedition type');
        }

        const size = this.#mapSize(data.size) ?? _throw('missing expedition navigation event size');

        const navigationType = data.navigationType ?? _throw('missing raw navigation event type');
        
        return {
            id: data.id,
            date: data.date,
            size,
            type: navigationType == 'delay' 
                ? ExpeditionEventType.delay
                : ExpeditionEventType.early,
        };
    }

    #parseItemExpedition(data: RawExpeditionMessageData): ExpeditionEventItem {
        if(data.type != OgameRawExpeditionResultType.item) {
            _throw('unexpected raw expedition type');
        }
        
        return {
            type: ExpeditionEventType.item,
            id: data.id,
            date: data.date,
            itemHash: data.item ?? _throw('missing item hash'),
        };
    }

    #parseFleetExpedition(data: RawExpeditionMessageData): ExpeditionEventFleet {
        if(data.type != OgameRawExpeditionResultType.fleet) {
            _throw('unexpected raw expedition type');
        }
        
        const size = this.#mapSize(data.size) ?? _throw('missing ship find size');
        const foundShips: Partial<Record<ExpeditionFindableShipType, number>> = {};

        ExpeditionFindableShipTypes.forEach(shipType => {
            const amount = data.ships?.[shipType];
            if (amount != null && amount > 0) {
                foundShips[shipType] = amount;
            }
        });

        if(Object.keys(foundShips).length == 0) {
            _logWarning('found ships but there are no ship amounts');
        }

        return {
            id: data.id,
            date: data.date,
            size,
            fleet: foundShips,
            type: ExpeditionEventType.fleet,
        };
    }

    #parseDarkMatterExpedition(data: RawExpeditionMessageData): ExpeditionEventDarkMatter {
        if(data.type != OgameRawExpeditionResultType.darkMatter) {
            _throw('unexpected raw expedition type');
        }
        
        const size = this.#mapSize(data.size) ?? _throw('missing dark matter find size');
        const amount = data.darkMatter ?? _throw('missing dark matter amount');

        return {
            id: data.id,
            date: data.date,
            darkMatter: amount,
            size: size,
            type: ExpeditionEventType.darkMatter,
        };
    }

    #parseResourceExpedition(data: RawExpeditionMessageData): ExpeditionEventResources {   
        if(data.type != OgameRawExpeditionResultType.resources) {
            _throw('unexpected raw expedition type');
        }
        
        const size = this.#mapSize(data.size) ?? _throw('missing resource find size');
        
        const resources: ExpeditionEventResources['resources'] = {
            [ResourceType.metal]: data.resources?.metal ?? 0,
            [ResourceType.crystal]: data.resources?.crystal ?? 0,
            [ResourceType.deuterium]: data.resources?.deuterium ?? 0,
        };

        if(resources.metal + resources.crystal + resources.deuterium == 0) {
            _logWarning('found resources but resource amounts are 0');
        }
    
        return {
            type: ExpeditionEventType.resources,
            id: data.id,
            date: data.date,
            resources,
            size,
        };
    }

    #mapSize(rawSize?: OgameRawExpeditionSize): ExpeditionEventSize | undefined {
        if(rawSize == null) {
            return undefined;
        }

        return {
            [OgameRawExpeditionSize.small]: ExpeditionEventSize.small,
            [OgameRawExpeditionSize.medium]: ExpeditionEventSize.medium,
            [OgameRawExpeditionSize.large]: ExpeditionEventSize.large,
        }[rawSize];
    }
}
import { isSupportedLanguage } from "../shared/i18n/isSupportedLanguage";
import { LanguageKey } from "../shared/i18n/LanguageKey";
import { MessageOgameMeta } from "../shared/messages/Message";
import { TrackExpeditionMessage } from "../shared/messages/tracking/TrackExpeditionMessage";
import { ExpeditionEvent, ExpeditionEventAliens, ExpeditionEventDarkMatter, ExpeditionEventDelay, ExpeditionEventEarly, ExpeditionEventFleet, ExpeditionEventItem, ExpeditionEventLostFleet, ExpeditionEventPirates, ExpeditionEventResources, ExpeditionEventTrader } from "../shared/models/v1/expeditions/ExpeditionEvents";
import { RawExpeditionData } from "../shared/models/v1/expeditions/RawExpeditionData";
import { TryActionResult } from "../shared/TryActionResult";
import { _log, _logError } from "../shared/utils/_log";
import { _throw } from "../shared/utils/_throw";
import i18nExpeditions from '../shared/i18n/ogame/expeditions';
import i18nPremium from '../shared/i18n/ogame/premium';
import i18nResources from '../shared/i18n/ogame/resources';
import { ExpeditionEventSize } from "../shared/models/v1/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../shared/models/v1/expeditions/ExpeditionEventType";
import { ResourceType } from "../shared/models/v1/ogame/resources/ResourceType";
import { ItemHash } from "../shared/models/v1/items/Item";

class ExpeditionEventManager {
    private readonly _key: string;
    private _expeditions: Record<number, ExpeditionEvent> | null = null;
    private _unloadTimeout: number | undefined;

    constructor(key: string) {
        this._key = key;
    }

    private get storageKey(): string {
        return `${this._key}-expoEvents`;
    }

    private registerUnload() {
        if (this._unloadTimeout != null) {
            window.clearTimeout(this._unloadTimeout);
        }
        this._unloadTimeout = window.setTimeout(async () => await this.unload());
    }

    private async unload(): Promise<void> {
        await this.save();

        this._expeditions = null;
        this._unloadTimeout = undefined;
    }

    private async load(): Promise<void> {
        if (this._expeditions == null) {
            const data = await chrome.storage.local.get(this.storageKey);
            this._expeditions = data?.[this.storageKey] ?? {};
        }

        this.registerUnload();
    }

    public async getExpeditions(): Promise<Record<number, ExpeditionEvent>> {
        await this.load();

        return this._expeditions;
    }

    public async add(expeditionEvent: ExpeditionEvent): Promise<void> {
        this._expeditions[expeditionEvent.id] = expeditionEvent;
        await this.save();
    }

    private async save(): Promise<void> {
        await chrome.storage.local.set({
            [this.storageKey]: this._expeditions,
        });
    }
}

export class ExpeditionModule {
    private readonly expeditionManagers: Record<string, ExpeditionEventManager | undefined> = {};

    public async tryTrackExpedition(message: TrackExpeditionMessage): Promise<TryActionResult<ExpeditionEvent>> {
        const expeditionEventData = message.data;

        const manager = this.getManager(message.ogameMeta);
        const expeditionEvents = await manager.getExpeditions();

        // check if expedition already tracked => if true, return tracked data
        const knownExpedition = expeditionEvents[expeditionEventData.id];
        if (knownExpedition != null) {
            return {
                success: true,
                result: knownExpedition
            };
        }

        // otherwise parse and save result
        let expedition: ExpeditionEvent;
        try {
            if (!isSupportedLanguage(message.ogameMeta.language)) {
                _throw('unsupported language');
            }

            expedition = this.parseExpedition(message.ogameMeta.language as LanguageKey, expeditionEventData);
        } catch (error) {
            _logError({ error, message });
            return { success: false };
        }

        await manager.add(expedition);
        return {
            success: true,
            result: expedition,
        };
    }

    private getManager(meta: MessageOgameMeta): ExpeditionEventManager {
        const key = `s${meta.server}-${meta.language}-${meta.playerId}`;
        this.expeditionManagers[key] ??= new ExpeditionEventManager(key);

        return this.expeditionManagers[key];
    }

    private parseExpedition(language: LanguageKey, data: RawExpeditionData): ExpeditionEvent {
        const result = this.tryParseDarkMatterExpedition(language, data)
            ?? this.tryParseResourceExpedition(language, data)
            ?? this.tryParseFleetExpedition(language, data)
            ?? this.tryParseItemExpedition(language, data)
            ?? this.tryParseEarlyExpedition(language, data)
            ?? this.tryParseDelayedExpedition(language, data)
            ?? this.tryParseTraderExpedition(language, data)
            ?? this.tryParseAliensExpedition(language, data)
            ?? this.tryParsePiratesExpedition(language, data)
            ?? this.tryParseLostFleetExpedition(language, data);

        if (result == null) {
            _throw('Unknown expedition type');
        }

        return result;
    }

    private tryParseLostFleetExpedition(language: LanguageKey, data: RawExpeditionData): ExpeditionEventLostFleet | null {
        throw new Error("Method not implemented.");
    }

    private tryParsePiratesExpedition(language: LanguageKey, data: RawExpeditionData): ExpeditionEventPirates | null {
        throw new Error("Method not implemented.");
    }

    private tryParseAliensExpedition(language: LanguageKey, data: RawExpeditionData): ExpeditionEventAliens | null {
        throw new Error("Method not implemented.");
    }

    private tryParseTraderExpedition(language: LanguageKey, data: RawExpeditionData): ExpeditionEventTrader | null {
        throw new Error("Method not implemented.");
    }

    private tryParseDelayedExpedition(language: LanguageKey, data: RawExpeditionData): ExpeditionEventDelay | null {
        throw new Error("Method not implemented.");
    }

    private tryParseEarlyExpedition(language: LanguageKey, data: RawExpeditionData): ExpeditionEventEarly | null {
        throw new Error("Method not implemented.");
    }

    private tryParseItemExpedition(language: LanguageKey, data: RawExpeditionData): ExpeditionEventItem | null {
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

    private tryParseFleetExpedition(language: LanguageKey, data: RawExpeditionData): ExpeditionEventFleet | null {
        throw new Error("Method not implemented.");
    }

    private tryParseDarkMatterExpedition(language: LanguageKey, data: RawExpeditionData): ExpeditionEventDarkMatter | null {
        const i18nMessages = i18nExpeditions[language].darkMatter;
        const regex = i18nMessages.regex(i18nPremium[language].darkMatter);
        const match = data.text.match(regex);

        if (match?.groups == null) {
            return null;
        }

        const amount = parseInt(match.groups.amount.replace(/[^\d]/g, ''));
        const size = Object.values(ExpeditionEventSize).find(
            size => i18nMessages[size].some((msg: string) => data.text.includes(msg))
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

    private tryParseResourceExpedition(language: LanguageKey, data: RawExpeditionData): ExpeditionEventResources | null {
        const i18nMessages = i18nExpeditions[language].resources;
        const resourceNames = Object.values(ResourceType);
        const regex = i18nMessages.regex(resourceNames.map(resource => i18nResources[language][resource]));
        const match = data.text.match(regex);
        if (match == null) {
            return null;
        }

        const resourceName = match[1];
        const amount = parseInt(match[2].replace(/[^\d]/g, ''));
        const size = Object.values(ExpeditionEventSize).find(
            size => i18nMessages[size].some((msg: string) => data.text.includes(msg))
        );

        if (size == null) {
            _throw('Found resource expedition event, but cannot detect event size');
        }

        const resource = Object.values(ResourceType).find(resource => i18nResources[language][resource] == resourceName)
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
}
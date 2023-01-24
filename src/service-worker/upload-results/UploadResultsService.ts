import { getGlobalDatabase, getPlayerDatabase } from "@/shared/db/access";
import { DbAccount } from "@/shared/db/schema/global";
import { Message } from "@/shared/messages/Message";
import { MessageType } from "@/shared/messages/MessageType";
import { ExpeditionDepletionLevel } from "@/shared/models/expeditions/ExpeditionDepletionLevel";
import type { ExpeditionEvent, ExpeditionEventResourcesAmount, ExpeditionFindableFleet } from "@/shared/models/expeditions/ExpeditionEvents";
import { ExpeditionEventSize } from "@/shared/models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "@/shared/models/expeditions/ExpeditionEventType";
import { ShipType } from "@/shared/models/ogame/ships/ShipType";
import { settingsService } from "../main";
import { MessageService } from "../MessageService";

const interval = 30_000;
const sliceSize = 100;

export class UploadResultsService implements MessageService {
    constructor() {
        this.#uploadUntrackedResults();
    }

    async onMessage(message: Message<MessageType, any>): Promise<void> {
        //TODO: upload new expeditions/lifeform discoveries
    }

    async #uploadUntrackedResults() {
        if (false /*TODO: !settingsService.settings.uploadResults*/) {
            setTimeout(() => this.#uploadUntrackedResults(), interval);
            return;
        }

        const globalDb = await getGlobalDatabase();
        const accounts = await globalDb.getAll('accounts');

        for (const account of accounts) {
            const accountDb = await getPlayerDatabase({
                language: account.serverLanguage,
                playerId: account.id,
                serverId: account.serverId,
            });

            const expeditions = await accountDb.getAll('expeditions');
            if(expeditions.length == 0) {
                continue;
            }

            for (let sliceStart = 0; sliceStart < expeditions.length; sliceStart += sliceSize) {
                const slice = expeditions.slice(sliceStart, sliceStart + sliceSize);

                const result = slice.map<ApiExpeditionResult>(expo => this.#mapExpeditionResult(account, expo));

                //TODO: handle exception
                //TODO: handle 400/invalid ids
                //TODO: save valid ids
                await fetch('https://localhost:7136/api/result/expedition/batch', {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(result),
                });
            }
        }

        //setTimeout(() => this.#uploadUntrackedResults(), interval);
    }

    #mapExpeditionResult(account: DbAccount, expedition: ExpeditionEvent): ApiExpeditionResult {
        const type = expedition.type;

        const baseData: ApiExpeditionResultBase = {
            serverId: account.serverId,
            language: account.serverLanguage,
            messageId: expedition.id,
            date: new Date(expedition.date).toISOString(),
            type: this.#mapType(expedition.type),
            depletionLevel: this.#mapDepletionLevel(expedition.depletion),
        };

        switch (type) {
            case ExpeditionEventType.nothing:
            case ExpeditionEventType.delay:
            case ExpeditionEventType.early:
            case ExpeditionEventType.trader:
            case ExpeditionEventType.lostFleet:
                return { ...baseData };

            case ExpeditionEventType.resources:
                return {
                    ...baseData,
                    size: this.#mapSize(expedition.size),
                    resource: this.#getResource(expedition.resources),
                    amount: this.#getResourceAmount(expedition.resources),
                };

            case ExpeditionEventType.fleet:
                return {
                    ...baseData,
                    size: this.#mapSize(expedition.size),
                    fleet: this.#mapFleet(expedition.fleet),
                };

            case ExpeditionEventType.darkMatter:
                return {
                    ...baseData,
                    size: this.#mapSize(expedition.size),
                    amount: expedition.darkMatter,
                };

            case ExpeditionEventType.aliens:
            case ExpeditionEventType.pirates:
                return {
                    ...baseData,
                    size: this.#mapSize(expedition.size),
                };

            case ExpeditionEventType.item:
                return {
                    ...baseData,
                    itemHash: expedition.itemHash,
                };
        }
    }

    #mapFleet(fleet: ExpeditionFindableFleet): ApiExpeditionResultFleet {
        return {
            lightFighter: fleet[ShipType.lightFighter] ?? 0,
            heavyFighter: fleet[ShipType.heavyFighter] ?? 0,
            cruiser: fleet[ShipType.cruiser] ?? 0,
            battleship: fleet[ShipType.battleship] ?? 0,
            bomber: fleet[ShipType.bomber] ?? 0,
            battlecruiser: fleet[ShipType.battlecruiser] ?? 0,
            destroyer: fleet[ShipType.destroyer] ?? 0,
            reaper: fleet[ShipType.reaper] ?? 0,
            pathfinder: fleet[ShipType.pathfinder] ?? 0,
            smallCargo: fleet[ShipType.smallCargo] ?? 0,
            largeCargo: fleet[ShipType.largeCargo] ?? 0,
            espionageProbe: fleet[ShipType.espionageProbe] ?? 0,
        };
    }

    #getResourceAmount(resources: ExpeditionEventResourcesAmount): number {
        return Math.max(resources.metal, resources.crystal, resources.deuterium);
    }

    #getResource(resources: ExpeditionEventResourcesAmount): ApiExpeditionResultResource {
        if (resources.crystal > 0) {
            return ApiExpeditionResultResource.crystal;
        }
        if (resources.deuterium > 0) {
            return ApiExpeditionResultResource.deuterium;
        }

        return ApiExpeditionResultResource.metal;
    }

    #mapSize(size: ExpeditionEventSize): ApiExpeditionResultSize {
        switch (size) {
            case ExpeditionEventSize.small:
                return ApiExpeditionResultSize.small;

            case ExpeditionEventSize.medium:
                return ApiExpeditionResultSize.medium;

            case ExpeditionEventSize.large:
                return ApiExpeditionResultSize.large;
        }
    }

    #mapDepletionLevel(level?: ExpeditionDepletionLevel): ApiExpeditionResultDepletionLevel | undefined {
        if (level == null) {
            return undefined;
        }

        switch (level) {
            case ExpeditionDepletionLevel.none:
                return ApiExpeditionResultDepletionLevel.none;

            case ExpeditionDepletionLevel.low:
                return ApiExpeditionResultDepletionLevel.low;

            case ExpeditionDepletionLevel.medium:
                return ApiExpeditionResultDepletionLevel.medium;

            case ExpeditionDepletionLevel.high:
                return ApiExpeditionResultDepletionLevel.high;
        }
    }

    #mapType(type: ExpeditionEventType): ApiExpeditionResultType {
        switch (type) {
            case ExpeditionEventType.nothing:
                return ApiExpeditionResultType.nothing;

            case ExpeditionEventType.resources:
                return ApiExpeditionResultType.resources;

            case ExpeditionEventType.fleet:
                return ApiExpeditionResultType.fleet;

            case ExpeditionEventType.delay:
                return ApiExpeditionResultType.delay;

            case ExpeditionEventType.early:
                return ApiExpeditionResultType.early;

            case ExpeditionEventType.darkMatter:
                return ApiExpeditionResultType.darkMatter;

            case ExpeditionEventType.pirates:
                return ApiExpeditionResultType.pirates;

            case ExpeditionEventType.aliens:
                return ApiExpeditionResultType.aliens;

            case ExpeditionEventType.item:
                return ApiExpeditionResultType.item;

            case ExpeditionEventType.trader:
                return ApiExpeditionResultType.trader;

            case ExpeditionEventType.lostFleet:
                return ApiExpeditionResultType.lostFleet;

        }
    }
}

type ApiExpeditionResultBase = {
    serverId: number;
    language: string;
    messageId: number;

    date: string;
    type: ApiExpeditionResultType;
    depletionLevel?: ApiExpeditionResultDepletionLevel;
};

type ApiExpeditionResult = ApiExpeditionResultBase & {
    size?: ApiExpeditionResultSize;
    resource?: ApiExpeditionResultResource;
    amount?: number;
    fleet?: ApiExpeditionResultFleet;
    itemHash?: string;
};

enum ApiExpeditionResultType {
    nothing = 'nothing',
    resources = 'resources',
    fleet = 'fleet',
    delay = 'delay',
    early = 'early',
    darkMatter = 'darkMatter',
    pirates = 'pirates',
    aliens = 'aliens',
    item = 'item',
    trader = 'trader',
    lostFleet = 'lostFleet',
}

enum ApiExpeditionResultDepletionLevel {
    none = 'none',
    low = 'low',
    medium = 'medium',
    high = 'high',
}
enum ApiExpeditionResultSize {
    small = 'small',
    medium = 'medium',
    large = 'large',
}
enum ApiExpeditionResultResource {
    metal = 'metal',
    crystal = 'crystal',
    deuterium = 'deuterium',
}

type ApiExpeditionResultFleet = {
    lightFighter: number;
    heavyFighter: number;
    cruiser: number;
    battleship: number;
    bomber: number;
    battlecruiser: number;
    destroyer: number;
    reaper: number;
    pathfinder: number;
    smallCargo: number;
    largeCargo: number;
    espionageProbe: number;
};
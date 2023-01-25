export type ApiExpeditionResultBase = {
    serverId: number;
    language: string;
    messageId: number;

    date: string;
    type: ApiExpeditionResultType;
    depletionLevel?: ApiExpeditionResultDepletionLevel;
};

export type ApiExpeditionResult = ApiExpeditionResultBase & {
    size?: ApiExpeditionResultSize;
    resource?: ApiExpeditionResultResource;
    amount?: number;
    fleet?: ApiExpeditionResultFleet;
    itemHash?: string;
};

export enum ApiExpeditionResultType {
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

export enum ApiExpeditionResultDepletionLevel {
    none = 'none',
    low = 'low',
    medium = 'medium',
    high = 'high',
}

export enum ApiExpeditionResultSize {
    small = 'small',
    medium = 'medium',
    large = 'large',
}

export enum ApiExpeditionResultResource {
    metal = 'metal',
    crystal = 'crystal',
    deuterium = 'deuterium',
}

export type ApiExpeditionResultFleet = {
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

export type ApiResultResponse = {
    serverId: number;
    language: string;
    messageId: number;
};
export type ApiBatchResultResponse = {
    ok: ApiResultResponse[];
    invalid: ApiResultResponse[];
};
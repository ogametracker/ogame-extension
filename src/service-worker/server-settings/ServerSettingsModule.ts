import { MessageOgameMeta } from "../../shared/messages/Message";
import { _logDebug } from "@/shared/utils/_log";
import { XMLParser } from "fast-xml-parser";
import { getServerDatabase } from "@/shared/db/access";
import { broadcastMessage } from "@/shared/communication/broadcastMessage";
import { NotifyServerSettingsUpdateMessage } from "@/shared/messages/tracking/server-settings";
import { MessageType } from "@/shared/messages/MessageType";
import { serviceWorkerUuid } from "@/shared/uuid";
import { parseFloatSafe } from "@/shared/utils/parseNumbers";
import { _throw } from "@/shared/utils/_throw";
import { DbServerSettings } from "@/shared/db/schema/server";

declare namespace OgameApi {
    interface ServerSettingsXml {
        serverData: ServerData;
    }

    interface ServerData {
        name?: string;
        number: string;
        language: string;
        timezone: string;
        timezoneOffset: string;
        domain: string;
        version: string;
        speed: string;
        speedFleetPeaceful: string;
        speedFleetWar: string;
        speedFleetHolding: string;
        galaxies: string;
        systems: string;
        acs: string;
        rapidFire: string;
        defToTF: string;
        debrisFactor: string;
        debrisFactorDef: string;
        repairFactor: string;
        newbieProtectionLimit: string;
        newbieProtectionHigh: string;
        topScore: string;
        bonusFields: string;
        donutGalaxy: string;
        donutSystem: string;
        wfEnabled: string;
        wfMinimumRessLost: string;
        wfMinimumLossPercentage: string;
        wfBasicPercentageRepairable: string;
        globalDeuteriumSaveFactor: string;
        bashlimit: string;
        probeCargo: string;
        researchDurationDivisor: string;
        darkMatterNewAcount: string;
        cargoHyperspaceTechMultiplier: string;
        marketplaceEnabled: string;
        marketplaceBasicTradeRatioMetal: string;
        marketplaceBasicTradeRatioCrystal: string;
        marketplaceBasicTradeRatioDeuterium: string;
        marketplacePriceRangeLower: string;
        marketplacePriceRangeUpper: string;
        marketplaceTaxNormalUser: string;
        marketplaceTaxAdmiral: string;
        marketplaceTaxCancelOffer: string;
        marketplaceTaxNotSold: string;
        marketplaceOfferTimeout: string;
        characterClassesEnabled: string;
        minerBonusResourceProduction: string;
        minerBonusFasterTradingShips: string;
        minerBonusIncreasedCargoCapacityForTradingShips: string;
        minerBonusAdditionalFleetSlots: string;
        minerBonusAdditionalMarketSlots: string;
        minerBonusAdditionalCrawler: string;
        minerBonusMaxCrawler: string;
        minerBonusEnergy: string;
        minerBonusOverloadCrawler: string;
        resourceBuggyProductionBoost: string;
        resourceBuggyMaxProductionBoost: string;
        resourceBuggyEnergyConsumptionPerUnit: string;
        warriorBonusFasterCombatShips: string;
        warriorBonusFasterRecyclers: string;
        warriorBonusFuelConsumption: string;
        warriorBonusRecyclerFuelConsumption: string;
        warriorBonusRecyclerCargoCapacity: string;
        warriorBonusAdditionalFleetSlots: string;
        warriorBonusAdditionalMoonFields: string;
        warriorBonusFleetHalfSpeed: string;
        warriorBonusAttackerWreckfield: string;
        combatDebrisFieldLimit: string;
        explorerBonusIncreasedResearchSpeed: string;
        explorerBonusIncreasedExpeditionOutcome: string;
        explorerBonusLargerPlanets: string;
        explorerUnitItemsPerDay: string;
        explorerBonusPhalanxRange: string;
        explorerBonusPlunderInactive: string;
        explorerBonusExpeditionEnemyReduction: string;
        explorerBonusAdditionalExpeditionSlots: string;
        resourceProductionIncreaseCrystalDefault: string;
        resourceProductionIncreaseCrystalPos1: string;
        resourceProductionIncreaseCrystalPos2: string;
        resourceProductionIncreaseCrystalPos3: string;
        exodusRatioMetal: string;
        exodusRatioCrystal: string;
        exodusRatioDeuterium: string;
        
        //remove ? when lifeform on all servers
        lifeformSettings?: Record<string, any>;
    }
}

type ServerSettingsMapping<
    TKeyFrom extends keyof OgameApi.ServerData = keyof OgameApi.ServerData,
    TKeyTo extends keyof DbServerSettings = keyof DbServerSettings
    > = {
        fromKey: TKeyFrom;
        toKey: TKeyTo;
    } & (
        | { type: StringConstructor | NumberConstructor | BooleanConstructor }
        | { conversion: (value: OgameApi.ServerData[TKeyFrom], serverData: OgameApi.ServerData) => DbServerSettings[TKeyTo] }
    );

const $keyTypes: Record<keyof OgameApi.ServerData, ServerSettingsMapping> = {
    name: {
        fromKey: 'name',
        toKey: 'name',
        conversion: (name, serverData) => (name as string | undefined) ?? `${serverData.language.toUpperCase()} ${serverData.number}`,
    },
    number: {
        fromKey: 'number',
        toKey: 'number',
        type: String,
    },
    language: {
        fromKey: 'language',
        toKey: 'language',
        type: String,
    },
    timezone: {
        fromKey: 'timezone',
        toKey: 'timezone',
        type: String,
    },
    timezoneOffset: {
        fromKey: 'timezoneOffset',
        toKey: 'timezoneOffset',
        type: String,
    },
    domain: {
        fromKey: 'domain',
        toKey: 'domain',
        type: String,
    },
    version: {
        fromKey: 'version',
        toKey: 'version',
        type: String,
    },

    speed: {
        fromKey: 'speed',
        toKey: 'speed',
        type: Number,
    },
    speedFleetPeaceful: {
        fromKey: 'speedFleetPeaceful',
        toKey: 'speedFleetPeaceful',
        type: Number,
    },
    speedFleetWar: {
        fromKey: 'speedFleetWar',
        toKey: 'speedFleetWar',
        type: Number,
    },
    speedFleetHolding: {
        fromKey: 'speedFleetHolding',
        toKey: 'speedFleetHolding',
        type: Number,
    },
    galaxies: {
        fromKey: 'galaxies',
        toKey: 'galaxies',
        type: Number,
    },
    systems: {
        fromKey: 'systems',
        toKey: 'systems',
        type: Number,
    },
    acs: {
        fromKey: 'acs',
        toKey: 'acs',
        type: Boolean,
    },
    rapidFire: {
        fromKey: 'rapidFire',
        toKey: 'rapidFire',
        type: Boolean,
    },
    defToTF: {
        fromKey: 'defToTF',
        toKey: 'defToTF',
        type: Boolean,
    },
    debrisFactor: {
        fromKey: 'debrisFactor',
        toKey: 'debrisFactor',
        type: Number,
    },
    debrisFactorDef: {
        fromKey: 'debrisFactorDef',
        toKey: 'debrisFactorDef',
        type: Number,
    },
    repairFactor: {
        fromKey: 'repairFactor',
        toKey: 'repairFactor',
        type: Number,
    },
    newbieProtectionLimit: {
        fromKey: 'newbieProtectionLimit',
        toKey: 'newbieProtectionLimit',
        type: Number,
    },
    newbieProtectionHigh: {
        fromKey: 'newbieProtectionHigh',
        toKey: 'newbieProtectionHigh',
        type: Number,
    },
    topScore: {
        fromKey: 'topScore',
        toKey: 'topScore',
        type: Number,
    },
    bonusFields: {
        fromKey: 'bonusFields',
        toKey: 'bonusFields',
        type: Number,
    },
    donutGalaxy: {
        fromKey: 'donutGalaxy',
        toKey: 'donutGalaxy',
        type: Boolean,
    },
    donutSystem: {
        fromKey: 'donutSystem',
        toKey: 'donutSystem',
        type: Boolean,
    },
    wfEnabled: {
        fromKey: 'wfEnabled',
        toKey: 'wfEnabled',
        type: Boolean,
    },
    wfMinimumRessLost: {
        fromKey: 'wfMinimumRessLost',
        toKey: 'wfMinimumRessLost',
        type: Number,
    },
    wfMinimumLossPercentage: {
        fromKey: 'wfMinimumLossPercentage',
        toKey: 'wfMinimumLossPercentage',
        type: Number,
    },
    wfBasicPercentageRepairable: {
        fromKey: 'wfBasicPercentageRepairable',
        toKey: 'wfBasicPercentageRepairable',
        type: Number,
    },
    globalDeuteriumSaveFactor: {
        fromKey: 'globalDeuteriumSaveFactor',
        toKey: 'globalDeuteriumSaveFactor',
        type: Number,
    },
    bashlimit: {
        fromKey: 'bashlimit',
        toKey: 'bashlimit',
        type: Number,
    },
    probeCargo: {
        fromKey: 'probeCargo',
        toKey: 'probeCargo',
        type: Number,
    },
    researchDurationDivisor: {
        fromKey: 'researchDurationDivisor',
        toKey: 'researchDurationDivisor',
        type: Number,
    },
    darkMatterNewAcount: {
        fromKey: 'darkMatterNewAcount',
        toKey: 'darkMatterNewAcount',
        type: Number,
    },
    cargoHyperspaceTechMultiplier: {
        fromKey: 'cargoHyperspaceTechMultiplier',
        toKey: 'cargoHyperspaceTechMultiplier',
        type: Number,
    },

    marketplaceEnabled: {
        fromKey: 'marketplaceEnabled',
        toKey: 'marketplaceEnabled',
        type: Boolean,
    },
    marketplaceBasicTradeRatioMetal: {
        fromKey: 'marketplaceBasicTradeRatioMetal',
        toKey: 'marketplaceBasicTradeRatioMetal',
        type: Number,
    },
    marketplaceBasicTradeRatioCrystal: {
        fromKey: 'marketplaceBasicTradeRatioCrystal',
        toKey: 'marketplaceBasicTradeRatioCrystal',
        type: Number,
    },
    marketplaceBasicTradeRatioDeuterium: {
        fromKey: 'marketplaceBasicTradeRatioDeuterium',
        toKey: 'marketplaceBasicTradeRatioDeuterium',
        type: Number,
    },
    marketplacePriceRangeLower: {
        fromKey: 'marketplacePriceRangeLower',
        toKey: 'marketplacePriceRangeLower',
        type: Number,
    },
    marketplacePriceRangeUpper: {
        fromKey: 'marketplacePriceRangeUpper',
        toKey: 'marketplacePriceRangeUpper',
        type: Number,
    },
    marketplaceTaxNormalUser: {
        fromKey: 'marketplaceTaxNormalUser',
        toKey: 'marketplaceTaxNormalUser',
        type: Number,
    },
    marketplaceTaxAdmiral: {
        fromKey: 'marketplaceTaxAdmiral',
        toKey: 'marketplaceTaxAdmiral',
        type: Number,
    },
    marketplaceTaxCancelOffer: {
        fromKey: 'marketplaceTaxCancelOffer',
        toKey: 'marketplaceTaxCancelOffer',
        type: Number,
    },
    marketplaceTaxNotSold: {
        fromKey: 'marketplaceTaxNotSold',
        toKey: 'marketplaceTaxNotSold',
        type: Number,
    },
    marketplaceOfferTimeout: {
        fromKey: 'marketplaceOfferTimeout',
        toKey: 'marketplaceOfferTimeout',
        type: Number,
    },

    characterClassesEnabled: {
        fromKey: 'characterClassesEnabled',
        toKey: 'characterClassesEnabled',
        type: Boolean,
    },
    minerBonusResourceProduction: {
        fromKey: 'minerBonusResourceProduction',
        toKey: 'minerBonusResourceProduction',
        type: Number,
    },
    minerBonusFasterTradingShips: {
        fromKey: 'minerBonusFasterTradingShips',
        toKey: 'minerBonusFasterTradingShips',
        type: Number,
    },
    minerBonusIncreasedCargoCapacityForTradingShips: {
        fromKey: 'minerBonusIncreasedCargoCapacityForTradingShips',
        toKey: 'minerBonusIncreasedCargoCapacityForTradingShips',
        type: Number,
    },
    minerBonusAdditionalFleetSlots: {
        fromKey: 'minerBonusAdditionalFleetSlots',
        toKey: 'minerBonusAdditionalFleetSlots',
        type: Number,
    },
    minerBonusAdditionalMarketSlots: {
        fromKey: 'minerBonusAdditionalMarketSlots',
        toKey: 'minerBonusAdditionalMarketSlots',
        type: Number,
    },
    minerBonusAdditionalCrawler: {
        fromKey: 'minerBonusAdditionalCrawler',
        toKey: 'minerBonusAdditionalCrawler',
        type: Number,
    },
    minerBonusMaxCrawler: {
        fromKey: 'minerBonusMaxCrawler',
        toKey: 'minerBonusMaxCrawler',
        type: Number,
    },
    minerBonusEnergy: {
        fromKey: 'minerBonusEnergy',
        toKey: 'minerBonusEnergy',
        type: Number,
    },
    minerBonusOverloadCrawler: {
        fromKey: 'minerBonusOverloadCrawler',
        toKey: 'minerBonusOverloadCrawler',
        type: Boolean,
    },
    resourceBuggyProductionBoost: {
        fromKey: 'resourceBuggyProductionBoost',
        toKey: 'resourceBuggyProductionBoost',
        type: Number,
    },
    resourceBuggyMaxProductionBoost: {
        fromKey: 'resourceBuggyMaxProductionBoost',
        toKey: 'resourceBuggyMaxProductionBoost',
        type: Number,
    },
    resourceBuggyEnergyConsumptionPerUnit: {
        fromKey: 'resourceBuggyEnergyConsumptionPerUnit',
        toKey: 'resourceBuggyEnergyConsumptionPerUnit',
        type: Number,
    },
    warriorBonusFasterCombatShips: {
        fromKey: 'warriorBonusFasterCombatShips',
        toKey: 'warriorBonusFasterCombatShips',
        type: Number,
    },
    warriorBonusFasterRecyclers: {
        fromKey: 'warriorBonusFasterRecyclers',
        toKey: 'warriorBonusFasterRecyclers',
        type: Number,
    },
    warriorBonusFuelConsumption: {
        fromKey: 'warriorBonusFuelConsumption',
        toKey: 'warriorBonusFuelConsumption',
        type: Number,
    },
    warriorBonusRecyclerFuelConsumption: {
        fromKey: 'warriorBonusRecyclerFuelConsumption',
        toKey: 'warriorBonusRecyclerFuelConsumption',
        type: Number,
    },
    warriorBonusRecyclerCargoCapacity: {
        fromKey: 'warriorBonusRecyclerCargoCapacity',
        toKey: 'warriorBonusRecyclerCargoCapacity',
        type: Number,
    },
    warriorBonusAdditionalFleetSlots: {
        fromKey: 'warriorBonusAdditionalFleetSlots',
        toKey: 'warriorBonusAdditionalFleetSlots',
        type: Number,
    },
    warriorBonusAdditionalMoonFields: {
        fromKey: 'warriorBonusAdditionalMoonFields',
        toKey: 'warriorBonusAdditionalMoonFields',
        type: Number,
    },
    warriorBonusFleetHalfSpeed: {
        fromKey: 'warriorBonusFleetHalfSpeed',
        toKey: 'warriorBonusFleetHalfSpeed',
        type: Boolean,
    },
    warriorBonusAttackerWreckfield: {
        fromKey: 'warriorBonusAttackerWreckfield',
        toKey: 'warriorBonusAttackerWreckfield',
        type: Boolean,
    },
    combatDebrisFieldLimit: {
        fromKey: 'combatDebrisFieldLimit',
        toKey: 'combatDebrisFieldLimit',
        type: Number,
    },
    explorerBonusIncreasedResearchSpeed: {
        fromKey: 'explorerBonusIncreasedResearchSpeed',
        toKey: 'explorerBonusIncreasedResearchSpeed',
        type: Number,
    },
    explorerBonusIncreasedExpeditionOutcome: {
        fromKey: 'explorerBonusIncreasedExpeditionOutcome',
        toKey: 'explorerBonusIncreasedExpeditionOutcome',
        type: Number,
    },
    explorerBonusLargerPlanets: {
        fromKey: 'explorerBonusLargerPlanets',
        toKey: 'explorerBonusLargerPlanets',
        type: Number,
    },
    explorerUnitItemsPerDay: {
        fromKey: 'explorerUnitItemsPerDay',
        toKey: 'explorerUnitItemsPerDay',
        type: Number,
    },
    explorerBonusPhalanxRange: {
        fromKey: 'explorerBonusPhalanxRange',
        toKey: 'explorerBonusPhalanxRange',
        type: Number,
    },
    explorerBonusPlunderInactive: {
        fromKey: 'explorerBonusPlunderInactive',
        toKey: 'explorerBonusPlunderInactive',
        type: Boolean,
    },
    explorerBonusExpeditionEnemyReduction: {
        fromKey: 'explorerBonusExpeditionEnemyReduction',
        toKey: 'explorerBonusExpeditionEnemyReduction',
        type: Number,
    },
    explorerBonusAdditionalExpeditionSlots: {
        fromKey: 'explorerBonusAdditionalExpeditionSlots',
        toKey: 'explorerBonusAdditionalExpeditionSlots',
        type: Number,
    },
    resourceProductionIncreaseCrystalDefault: {
        fromKey: 'resourceProductionIncreaseCrystalDefault',
        toKey: 'resourceProductionIncreaseCrystalDefault',
        type: Number,
    },
    resourceProductionIncreaseCrystalPos1: {
        fromKey: 'resourceProductionIncreaseCrystalPos1',
        toKey: 'resourceProductionIncreaseCrystalPos1',
        type: Number,
    },
    resourceProductionIncreaseCrystalPos2: {
        fromKey: 'resourceProductionIncreaseCrystalPos2',
        toKey: 'resourceProductionIncreaseCrystalPos2',
        type: Number,
    },
    resourceProductionIncreaseCrystalPos3: {
        fromKey: 'resourceProductionIncreaseCrystalPos3',
        toKey: 'resourceProductionIncreaseCrystalPos3',
        type: Number,
    },

    exodusRatioMetal: {
        fromKey: 'exodusRatioMetal',
        toKey: 'exodusRatioMetal',
        type: Number,
    },
    exodusRatioCrystal: {
        fromKey: 'exodusRatioCrystal',
        toKey: 'exodusRatioCrystal',
        type: Number,
    },
    exodusRatioDeuterium: {
        fromKey: 'exodusRatioDeuterium',
        toKey: 'exodusRatioDeuterium',
        type: Number,
    },

    lifeformSettings: {
        fromKey: 'lifeformSettings',
        toKey: 'lifeformsEnabled',
        conversion: (value) => value != null,
    },
};

export class ServerSettingsModule {
    private readonly interval = 1000 * 60 * 60 * 12; // 12h

    private readonly meta: MessageOgameMeta;
    private readonly parser = new XMLParser({
        attributeNamePrefix: '',
        ignoreAttributes: false,
        parseAttributeValue: false,
    });

    public constructor(meta: MessageOgameMeta) {
        this.meta = meta;

        void this.init()
    }

    private async init() {
        try {
            _logDebug(`initializing server settings updates for universe ${this.meta.serverId} ${this.meta.language.toUpperCase()}`);
            const db = await getServerDatabase(this.meta);
            const lastUpdate = (await db.get('serverSettings', '_lastUpdate')) as number;
            const timeLeft = Math.max(0, this.interval - (Date.now() - lastUpdate));

            setTimeout(async () => {
                await this.update();
            }, timeLeft);
        } catch (error) {
            setTimeout(async () => {
                await this.update();
            }, 1000 * 60 * 5); // try again after 5min
        }
    }

    public async update() {
        await this.updateServerSettings();
        await this.init();
    }

    private async updateServerSettings(): Promise<void> {
        // load and parse server settings
        const { serverData } = await this.getXml<OgameApi.ServerSettingsXml & { 'xmlns:xsi': string, 'xsi:noNamespaceSchemaLocation': string, timestamp: string, serverId: string }>('serverData.xml');
        const playerScores = await this.getXml<{ 
            highscore: {
                player: {
                    id: string; 
                    position: string;
                    score: string;
                }[];
            };
        }>('highscore.xml?category=1&type=0');
        const topScore = Math.max(
            parseFloat(playerScores.highscore.player[0].score),
            parseFloat(serverData.topScore),
        );

        // update settings in db
        const db = await getServerDatabase(this.meta);
        const tx = db.transaction('serverSettings', 'readwrite');
        const store = tx.objectStore('serverSettings');

        for (const key of Object.keys($keyTypes) as (keyof OgameApi.ServerData)[]) {
            const mapping = $keyTypes[key];
            const serverDataValue = serverData[key];

            let value: DbServerSettings[keyof DbServerSettings];
            if ('type' in mapping) {
                if (mapping.type == String) {
                    if(typeof serverDataValue !== 'string' && typeof serverDataValue !== 'number') {
                        _throw(`Expected string or number, got object of type '${typeof serverDataValue}' for key '${key}'`);
                    }
                    value = serverDataValue.toString();
                }
                else if (mapping.type == Number) {
                    if(typeof serverDataValue !== 'string' && typeof serverDataValue !== 'number') {
                        _throw(`Expected string or number, got object of type '${typeof serverDataValue}' for key '${key}'`);
                    }
                    value = parseFloatSafe(serverDataValue);
                }
                else if (mapping.type == Boolean) {
                    if(typeof serverDataValue !== 'string' && typeof serverDataValue !== 'number') {
                        _throw(`Expected string or number, got object of type '${typeof serverDataValue}' for key '${key}'`);
                    }
                    value = serverDataValue == '1';
                }
                else {
                    _throw('invalid type', mapping.type);
                }
            } 
            else {
                value = mapping.conversion(serverDataValue, serverData);
            }

            await store.put(value, mapping.toKey);
        }
        await store.put(Date.now(), '_lastUpdate');
        // put top score manually as highscore-API may be more up-to-date
        await store.put(topScore, 'topScore');
        await tx.done;

        // notify settings update
        const message: NotifyServerSettingsUpdateMessage = {
            type: MessageType.NotifyServerSettingsUpdate,
            ogameMeta: this.meta,
            senderUuid: serviceWorkerUuid,
        }
        await broadcastMessage(message);
    }

    private get apiUrlBase() {
        return `https://s${this.meta.serverId}-${this.meta.language}.ogame.gameforge.com/api`;
    }

    private async getXml<T = any>(apiFile: string): Promise<T> {
        const url = `${this.apiUrlBase}/${apiFile}`;
        const response = await fetch(url);
        const xml = await response.text();

        return this.parser.parse(xml);
    }
}
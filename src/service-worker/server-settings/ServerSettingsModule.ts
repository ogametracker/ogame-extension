import { MessageOgameMeta } from "../../shared/messages/Message";
import { _logDebug } from "@/shared/utils/_log";
import { XMLParser } from "fast-xml-parser";
import { getServerDatabase } from "@/shared/db/access";
import { broadcastMessage } from "@/shared/communication/broadcastMessage";
import { NotifyServerSettingsUpdateMessage } from "@/shared/messages/tracking/server-settings";
import { MessageType } from "@/shared/messages/MessageType";
import { serviceWorkerUuid } from "@/shared/uuid";
import { DbServerSettings } from "@/shared/db/schema/server";
import { parseFloatSafe } from "@/shared/utils/parseNumbers";
import { _throw } from "@/shared/utils/_throw";

declare namespace OgameApi {
    interface ServerSettingsXml {
        serverData: ServerData;
    }

    interface ServerData {
        name: string;
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
    }
}

const $keyTypes: Record<keyof OgameApi.ServerData, StringConstructor | NumberConstructor | BooleanConstructor> = {
    name: String,
    number: String,
    language: String,
    timezone: String,
    timezoneOffset: String,
    domain: String,
    version: String,

    speed: Number,
    speedFleetPeaceful: Number,
    speedFleetWar: Number,
    speedFleetHolding: Number,
    galaxies: Number,
    systems: Number,
    acs: Boolean,
    rapidFire: Boolean,
    defToTF: Boolean,
    debrisFactor: Number,
    debrisFactorDef: Number,
    repairFactor: Number,
    newbieProtectionLimit: Number,
    newbieProtectionHigh: Number,
    topScore: Number,
    bonusFields: Number,
    donutGalaxy: Boolean,
    donutSystem: Boolean,
    wfEnabled: Boolean,
    wfMinimumRessLost: Number,
    wfMinimumLossPercentage: Number,
    wfBasicPercentageRepairable: Number,
    globalDeuteriumSaveFactor: Number,
    bashlimit: Number,
    probeCargo: Number,
    researchDurationDivisor: Number,
    darkMatterNewAcount: Number,
    cargoHyperspaceTechMultiplier: Number,

    marketplaceEnabled: Boolean,
    marketplaceBasicTradeRatioMetal: Number,
    marketplaceBasicTradeRatioCrystal: Number,
    marketplaceBasicTradeRatioDeuterium: Number,
    marketplacePriceRangeLower: Number,
    marketplacePriceRangeUpper: Number,
    marketplaceTaxNormalUser: Number,
    marketplaceTaxAdmiral: Number,
    marketplaceTaxCancelOffer: Number,
    marketplaceTaxNotSold: Number,
    marketplaceOfferTimeout: Number,

    characterClassesEnabled: Boolean,
    minerBonusResourceProduction: Number,
    minerBonusFasterTradingShips: Number,
    minerBonusIncreasedCargoCapacityForTradingShips: Number,
    minerBonusAdditionalFleetSlots: Number,
    minerBonusAdditionalMarketSlots: Number,
    minerBonusAdditionalCrawler: Number,
    minerBonusMaxCrawler: Number,
    minerBonusEnergy: Number,
    minerBonusOverloadCrawler: Boolean,
    resourceBuggyProductionBoost: Number,
    resourceBuggyMaxProductionBoost: Number,
    resourceBuggyEnergyConsumptionPerUnit: Number,
    warriorBonusFasterCombatShips: Number,
    warriorBonusFasterRecyclers: Number,
    warriorBonusFuelConsumption: Number,
    warriorBonusRecyclerFuelConsumption: Number,
    warriorBonusRecyclerCargoCapacity: Number,
    warriorBonusAdditionalFleetSlots: Number,
    warriorBonusAdditionalMoonFields: Number,
    warriorBonusFleetHalfSpeed: Boolean,
    warriorBonusAttackerWreckfield: Boolean,
    combatDebrisFieldLimit: Number,
    explorerBonusIncreasedResearchSpeed: Number,
    explorerBonusIncreasedExpeditionOutcome: Number,
    explorerBonusLargerPlanets: Number,
    explorerUnitItemsPerDay: Number,
    explorerBonusPhalanxRange: Number,
    explorerBonusPlunderInactive: Boolean,
    explorerBonusExpeditionEnemyReduction: Number,
    explorerBonusAdditionalExpeditionSlots: Number,
    resourceProductionIncreaseCrystalDefault: Number,
    resourceProductionIncreaseCrystalPos1: Number,
    resourceProductionIncreaseCrystalPos2: Number,
    resourceProductionIncreaseCrystalPos3: Number,

    exodusRatioMetal: Number,
    exodusRatioCrystal: Number,
    exodusRatioDeuterium: Number,
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
                await this.updateServerSettings();
                await this.init();
            }, timeLeft);
        } catch (error) {
            setTimeout(async () => {
                await this.updateServerSettings();
                await this.init();
            }, 1000 * 60 * 5); // try again after 5min
        }
    }

    private async updateServerSettings(): Promise<void> {
        // load and parse server settings
        const { serverData } = await this.getXml<OgameApi.ServerSettingsXml & { 'xmlns:xsi': string, 'xsi:noNamespaceSchemaLocation': string, timestamp: string, serverId: string }>('serverData.xml');

        // update settings in db
        const db = await getServerDatabase(this.meta);
        const tx = db.transaction('serverSettings', 'readwrite');
        const store = tx.objectStore('serverSettings');

        for (const key of Object.keys($keyTypes) as (keyof OgameApi.ServerData)[]) {
            const type = $keyTypes[key];
            let value: string | number | boolean;
            if(type == String) {
                value = serverData[key];
            } 
            else if(type == Number) {
                value = parseFloatSafe(serverData[key]);
            } 
            else if(type == Boolean) {
                value = serverData[key] == '1';
            }
            else {
                _throw('invalid type', type);
            }

            await store.put(value, key);
        }
        await store.put(Date.now(), '_lastUpdate');
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
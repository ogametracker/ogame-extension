import { MessageOgameMeta } from '../../shared/messages/Message';
import { _throw } from '../../shared/utils/_throw';
import { PersistentDataManager } from '../PersistentData';
import { parseFloatSafe, parseIntSafe } from '../../shared/utils/parseNumbers';
import { XMLParser } from 'fast-xml-parser';
import { _logDebug } from '../../shared/utils/_log';
import { ServerSettings } from '@/shared/models/server-settings/ServerSettings';

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

export class ServerSettingsManager extends PersistentDataManager<ServerSettings> {

    private readonly intervalInMs = 1000 * 60 * 60; //1h
    private readonly language: string;
    private readonly serverId: number;
    private readonly parser = new XMLParser({
        attributeNamePrefix: '',
        ignoreAttributes: false,
        parseAttributeValue: false,
    });

    private readonly listeners: (() => void)[] = [];
    private static timeout: number | undefined = undefined;

    constructor(key: string, meta: MessageOgameMeta) {
        super(key, 'server-settings');

        this.language = meta.language;
        this.serverId = meta.serverId;

        void this.initTracking();
    }

    public addBroadcastNotifyListener(listener: () => void) {
        this.listeners.push(listener);
    }

    protected getDefaultItem(): ServerSettings {
        return {
            lastUpdate: 0,
            speed: {
                economy: 1,
                research: 1,
                fleet: {
                    peaceful: 1,
                    war: 1,
                    holding: 1,
                },
            },
            universe: {
                galaxies: {
                    count: 1,
                    isDonut: true,
                },
                systems: {
                    count: 499,
                    isDonut: true,
                },
            },
            darkMatterBonus: 8_000,
            planetBonusFields: 0,
            combats: {
                debrisFieldFactors: {
                    defense: 0,
                    ships: 0.3,
                },
                defenseRepairFactor: 0.7,
                isAllianceCombatSystemEnabled: true,
                isRapidfireEnabled: true,
                wreckfields: {
                    isEnabled: true,
                    minLostPercentage: 5,
                    minLostResources: 150_000,
                    repairableBasePercentage: 45,
                },
            },
            fleet: {
                deuteriumConsumptionFactor: 1,
                hyperspaceCargoPercentageFactor: 5,
                isProbeCargoEnabled: false,
            },
            marketplace: {
                isEnabled: false,
                offerTimeoutInDays: 3,
                priceRanges: {
                    upper: 0.2,
                    lower: 0.2,
                },
                taxes: {
                    default: 0.2,
                    admiral: 0.1,
                    canceledOffers: 0.2,
                    unsoldOffers: 0.2,
                },
                tradeRatios: {
                    metal: 2.5,
                    crystal: 1.5,
                    deuterium: 1,
                },
            },
            resourceProduction: {
                productionFactorBonus: {
                    crystal: {
                        default: 0,
                        pos1: 0.4,
                        pos2: 0.3,
                        pos3: 0.2,
                    },
                },
            },
            playerClasses: {
                areEnabled: true,
                crawlers: {
                    energyComsumptionPerUnit: 50,
                    maxProductionFactor: 0.5,
                    productionBoostFactorPerUnit: 0.0002,
                },
                reapers: {
                    combatDebrisFieldMiningFactor: 0.25,
                },
                collector: {
                    bonusFleetSlots: 0,
                    bonusMarketplaceSlots: 2,
                    energyProductionFactorBonus: 0.1,
                    productionFactorBonus: 0.25,
                    tradingShips: {
                        speedFactorBonus: 1,
                        cargoCapacityFactorBonus: 0.25,
                    },
                    crawlers: {
                        geologistActiveCrawlerFactorBonus: 0.1,
                        isOverloadEnabled: true,
                        productionFactorBonus: 0.5,
                    },
                },
                discoverer: {
                    bonusExpeditionSlots: 2,
                    researchSpeedFactor: 0.25,
                    phalanxRangeFactorBonus: 0.2,
                    planetSizeFactorBonus: 0.1,
                    hasBonusPlunderForInactivePlayers: true,
                    expeditions: {
                        outcomeFactorBonus: 0.5,
                        enemyFactorReduction: 0.5,
                        maxItemsPerDay: 1,
                    },
                },
                general: {
                    bonusFleetSlots: 2,
                    bonusMoonFields: 5,
                    hasMorePreciseFleetSpeed: true,
                    hasAttackerWreckfield: true,
                    combatShipSpeedFactorBonus: 1,
                    deuteriumConsumptionFactorReduction: 0.25,
                    recyclers: {
                        cargoCapacityFactorBonus: 0.2,
                        deuteriumConsumptionFactorReduction: 0,
                        speedFactorBonus: 1,
                    },
                },
            },
        };
    }


    private async initTracking(timeout?: number) {
        const data = await this.getData();
        const now = Date.now();

        timeout ??= Math.max(0, data.lastUpdate + this.intervalInMs - now);
        _logDebug(`next universe history tracking in ${timeout} ms (${new Date(Date.now() + timeout)}) for universe ${this.serverId} ${this.language.toUpperCase()}`);

        if (ServerSettingsManager.timeout != null) {
            clearTimeout(ServerSettingsManager.timeout);
            ServerSettingsManager.timeout = undefined;
        }
        ServerSettingsManager.timeout = globalThis.setTimeout(async () => await this.trackUniverseUpdates(), timeout, null);
    }

    private async trackUniverseUpdates() {
        try {
            _logDebug(`tracking server settings for universe ${this.serverId} ${this.language.toUpperCase()}`);
            const serverSettings = await this.getServerSettings();
            this.broadcastServerSettingsUpdate();
            await this.updateData(serverSettings);

            await this.initTracking();
        } catch (error) {
            await this.initTracking(1000 * 60 * 5); // try in 5min again on error
        }
    }

    private broadcastServerSettingsUpdate() {
        this.listeners.forEach(listener => listener());
    }

    private async getServerSettings(): Promise<ServerSettings> {
        const { serverData } = await this.getXml<OgameApi.ServerSettingsXml>('serverData.xml');

        return {
            lastUpdate: Date.now(),
            speed: {
                economy: parseIntSafe(serverData.speed, 10),
                research: parseIntSafe(serverData.researchDurationDivisor, 10),
                fleet: {
                    peaceful: parseIntSafe(serverData.speedFleetPeaceful, 10),
                    war: parseIntSafe(serverData.speedFleetWar, 10),
                    holding: parseIntSafe(serverData.speedFleetHolding, 10),
                },
            },
            universe: {
                galaxies: {
                    count: parseIntSafe(serverData.galaxies, 10),
                    isDonut: serverData.donutGalaxy == '1',
                },
                systems: {
                    count: parseIntSafe(serverData.systems, 10),
                    isDonut: serverData.donutSystem == '1',
                },
            },
            darkMatterBonus: parseIntSafe(serverData.darkMatterNewAcount, 10),
            planetBonusFields: parseIntSafe(serverData.bonusFields, 10),
            combats: {
                debrisFieldFactors: {
                    defense: parseFloatSafe(serverData.debrisFactorDef),
                    ships: parseFloatSafe(serverData.debrisFactor),
                },
                defenseRepairFactor: parseFloatSafe(serverData.repairFactor),
                isAllianceCombatSystemEnabled: serverData.acs == '1',
                isRapidfireEnabled: serverData.rapidFire == '1',
                wreckfields: {
                    isEnabled: serverData.wfEnabled == '1',
                    minLostPercentage: parseIntSafe(serverData.wfMinimumLossPercentage, 10),
                    minLostResources: parseIntSafe(serverData.wfMinimumRessLost, 10),
                    repairableBasePercentage: parseIntSafe(serverData.wfBasicPercentageRepairable, 10),
                },
            },
            fleet: {
                deuteriumConsumptionFactor: parseFloatSafe(serverData.globalDeuteriumSaveFactor),
                hyperspaceCargoPercentageFactor: parseIntSafe(serverData.cargoHyperspaceTechMultiplier, 10),
                isProbeCargoEnabled: serverData.probeCargo == '1',
            },
            marketplace: {
                isEnabled: serverData.marketplaceEnabled == '1',
                offerTimeoutInDays: parseIntSafe(serverData.marketplaceOfferTimeout, 10),
                priceRanges: {
                    upper: parseFloatSafe(serverData.marketplacePriceRangeUpper),
                    lower: parseFloatSafe(serverData.marketplacePriceRangeLower),
                },
                taxes: {
                    default: parseFloatSafe(serverData.marketplaceTaxNormalUser),
                    admiral: parseFloatSafe(serverData.marketplaceTaxAdmiral),
                    canceledOffers: parseFloatSafe(serverData.marketplaceTaxCancelOffer),
                    unsoldOffers: parseFloatSafe(serverData.marketplaceTaxNotSold),
                },
                tradeRatios: {
                    metal: parseFloatSafe(serverData.marketplaceBasicTradeRatioMetal),
                    crystal: parseFloatSafe(serverData.marketplaceBasicTradeRatioCrystal),
                    deuterium: parseFloatSafe(serverData.marketplaceBasicTradeRatioDeuterium),
                },
            },
            resourceProduction: {
                productionFactorBonus: {
                    crystal: {
                        default: parseFloatSafe(serverData.resourceProductionIncreaseCrystalDefault),
                        pos1: parseFloatSafe(serverData.resourceProductionIncreaseCrystalPos1),
                        pos2: parseFloatSafe(serverData.resourceProductionIncreaseCrystalPos2),
                        pos3: parseFloatSafe(serverData.resourceProductionIncreaseCrystalPos3),
                    },
                },
            },
            playerClasses: {
                areEnabled: serverData.characterClassesEnabled == '1',
                crawlers: {
                    energyComsumptionPerUnit: parseIntSafe(serverData.resourceBuggyEnergyConsumptionPerUnit, 10),
                    maxProductionFactor: parseFloatSafe(serverData.resourceBuggyMaxProductionBoost),
                    productionBoostFactorPerUnit: parseFloatSafe(serverData.resourceBuggyProductionBoost),
                },
                reapers: {
                    combatDebrisFieldMiningFactor: parseFloatSafe(serverData.combatDebrisFieldLimit),
                },
                collector: {
                    bonusFleetSlots: parseIntSafe(serverData.minerBonusAdditionalFleetSlots, 10),
                    bonusMarketplaceSlots: parseIntSafe(serverData.minerBonusAdditionalMarketSlots, 10),
                    energyProductionFactorBonus: parseFloatSafe(serverData.minerBonusEnergy),
                    productionFactorBonus: parseFloatSafe(serverData.minerBonusResourceProduction),
                    tradingShips: {
                        speedFactorBonus: parseFloatSafe(serverData.minerBonusFasterTradingShips),
                        cargoCapacityFactorBonus: parseFloatSafe(serverData.minerBonusIncreasedCargoCapacityForTradingShips),
                    },
                    crawlers: {
                        geologistActiveCrawlerFactorBonus: parseFloatSafe(serverData.minerBonusMaxCrawler),
                        isOverloadEnabled: serverData.minerBonusOverloadCrawler == '1',
                        productionFactorBonus: parseFloatSafe(serverData.minerBonusAdditionalCrawler),
                    },
                },
                discoverer: {
                    bonusExpeditionSlots: parseIntSafe(serverData.explorerBonusAdditionalExpeditionSlots, 10),
                    researchSpeedFactor: parseFloatSafe(serverData.explorerBonusIncreasedResearchSpeed),
                    phalanxRangeFactorBonus: parseFloatSafe(serverData.explorerBonusPhalanxRange),
                    planetSizeFactorBonus: parseFloatSafe(serverData.explorerBonusLargerPlanets),
                    hasBonusPlunderForInactivePlayers: serverData.explorerBonusPlunderInactive == '1',
                    expeditions: {
                        outcomeFactorBonus: parseFloatSafe(serverData.explorerBonusIncreasedExpeditionOutcome),
                        enemyFactorReduction: parseFloatSafe(serverData.explorerBonusExpeditionEnemyReduction),
                        maxItemsPerDay: parseIntSafe(serverData.explorerUnitItemsPerDay, 10),
                    },
                },
                general: {
                    bonusFleetSlots: parseIntSafe(serverData.warriorBonusAdditionalFleetSlots, 10),
                    bonusMoonFields: parseIntSafe(serverData.warriorBonusAdditionalMoonFields, 10),
                    hasMorePreciseFleetSpeed: serverData.warriorBonusFleetHalfSpeed == '1',
                    hasAttackerWreckfield: serverData.warriorBonusAttackerWreckfield == '1',
                    combatShipSpeedFactorBonus: parseFloatSafe(serverData.warriorBonusFasterCombatShips),
                    deuteriumConsumptionFactorReduction: parseFloatSafe(serverData.warriorBonusFuelConsumption),
                    recyclers: {
                        cargoCapacityFactorBonus: parseFloatSafe(serverData.warriorBonusRecyclerCargoCapacity),
                        deuteriumConsumptionFactorReduction: parseFloatSafe(serverData.warriorBonusRecyclerFuelConsumption),
                        speedFactorBonus: parseFloatSafe(serverData.warriorBonusFasterRecyclers),
                    },
                },
            },
        };
    }

    private get apiUrlBase() {
        return `https://s${this.serverId}-${this.language}.ogame.gameforge.com/api`;
    }

    private async getXml<T = any>(apiFile: string): Promise<T> {
        const url = `${this.apiUrlBase}/${apiFile}`;
        const response = await fetch(url);
        const xml = await response.text();

        return this.parser.parse(xml);
    }
}
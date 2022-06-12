import { MessageType } from '@/shared/messages/MessageType';
import { Message } from '@/shared/messages/Message';
import { GlobalOgameMetaData } from './global';
import { Component, Vue } from 'vue-property-decorator';
import { ogameMetasEqual } from '@/shared/ogame-web/ogameMetasEqual';
import { ServerSettings } from '@/shared/models/server-settings/ServerSettings';
import { getServerDatabase } from '@/shared/db/access';
import { DbServerSettings } from '@/shared/db/schema';

@Component
class ServerSettingsDataModuleClass extends Vue {
    public serverSettings: ServerSettings | null = null;

    private async created() {
        this.initCommunication();
        await this.loadData();
    }

    private initCommunication() {
        chrome.runtime.onMessage.addListener(async message => await this.onMessage(message));
    }
    
    private mapServerSettings(serverData: DbServerSettings): ServerSettings {
        return {
            lastUpdate: Date.now(),
            speed: {
                economy: serverData.speed,
                research: serverData.researchDurationDivisor,
                fleet: {
                    peaceful: serverData.speedFleetPeaceful,
                    war: serverData.speedFleetWar,
                    holding: serverData.speedFleetHolding,
                },
            },
            universe: {
                galaxies: {
                    count: serverData.galaxies,
                    isDonut: serverData.donutGalaxy == 1,
                },
                systems: {
                    count: serverData.systems,
                    isDonut: serverData.donutSystem == 1,
                },
            },
            darkMatterBonus: serverData.darkMatterNewAcount,
            planetBonusFields: serverData.bonusFields,
            combats: {
                debrisFieldFactors: {
                    defense: serverData.debrisFactorDef,
                    ships: serverData.debrisFactor,
                },
                defenseRepairFactor: serverData.repairFactor,
                isAllianceCombatSystemEnabled: serverData.acs == 1,
                isRapidfireEnabled: serverData.rapidFire == 1,
                wreckfields: {
                    isEnabled: serverData.wfEnabled == 1,
                    minLostPercentage: serverData.wfMinimumLossPercentage,
                    minLostResources: serverData.wfMinimumRessLost,
                    repairableBasePercentage: serverData.wfBasicPercentageRepairable,
                },
            },
            fleet: {
                deuteriumConsumptionFactor: serverData.globalDeuteriumSaveFactor,
                hyperspaceCargoPercentageFactor: serverData.cargoHyperspaceTechMultiplier,
                isProbeCargoEnabled: serverData.probeCargo == 1,
            },
            marketplace: {
                isEnabled: serverData.marketplaceEnabled == 1,
                offerTimeoutInDays: serverData.marketplaceOfferTimeout,
                priceRanges: {
                    upper: serverData.marketplacePriceRangeUpper,
                    lower: serverData.marketplacePriceRangeLower,
                },
                taxes: {
                    default: serverData.marketplaceTaxNormalUser,
                    admiral: serverData.marketplaceTaxAdmiral,
                    canceledOffers: serverData.marketplaceTaxCancelOffer,
                    unsoldOffers: serverData.marketplaceTaxNotSold,
                },
                tradeRatios: {
                    metal: serverData.marketplaceBasicTradeRatioMetal,
                    crystal: serverData.marketplaceBasicTradeRatioCrystal,
                    deuterium: serverData.marketplaceBasicTradeRatioDeuterium,
                },
            },
            resourceProduction: {
                productionFactorBonus: {
                    crystal: {
                        default: serverData.resourceProductionIncreaseCrystalDefault,
                        pos1: serverData.resourceProductionIncreaseCrystalPos1,
                        pos2: serverData.resourceProductionIncreaseCrystalPos2,
                        pos3: serverData.resourceProductionIncreaseCrystalPos3,
                    },
                },
            },
            playerClasses: {
                areEnabled: serverData.characterClassesEnabled == 1,
                crawlers: {
                    energyComsumptionPerUnit: serverData.resourceBuggyEnergyConsumptionPerUnit,
                    maxProductionFactor: serverData.resourceBuggyMaxProductionBoost,
                    productionBoostFactorPerUnit: serverData.resourceBuggyProductionBoost,
                },
                reapers: {
                    combatDebrisFieldMiningFactor: serverData.combatDebrisFieldLimit,
                },
                collector: {
                    bonusFleetSlots: serverData.minerBonusAdditionalFleetSlots,
                    bonusMarketplaceSlots: serverData.minerBonusAdditionalMarketSlots,
                    energyProductionFactorBonus: serverData.minerBonusEnergy,
                    productionFactorBonus: serverData.minerBonusResourceProduction,
                    tradingShips: {
                        speedFactorBonus: serverData.minerBonusFasterTradingShips,
                        cargoCapacityFactorBonus: serverData.minerBonusIncreasedCargoCapacityForTradingShips,
                    },
                    crawlers: {
                        geologistActiveCrawlerFactorBonus: serverData.minerBonusMaxCrawler,
                        isOverloadEnabled: serverData.minerBonusOverloadCrawler == 1,
                        productionFactorBonus: serverData.minerBonusAdditionalCrawler,
                    },
                },
                discoverer: {
                    bonusExpeditionSlots: serverData.explorerBonusAdditionalExpeditionSlots,
                    researchSpeedFactor: serverData.explorerBonusIncreasedResearchSpeed,
                    phalanxRangeFactorBonus: serverData.explorerBonusPhalanxRange,
                    planetSizeFactorBonus: serverData.explorerBonusLargerPlanets,
                    hasBonusPlunderForInactivePlayers: serverData.explorerBonusPlunderInactive == 1,
                    expeditions: {
                        outcomeFactorBonus: serverData.explorerBonusIncreasedExpeditionOutcome,
                        enemyFactorReduction: serverData.explorerBonusExpeditionEnemyReduction,
                        maxItemsPerDay: serverData.explorerUnitItemsPerDay,
                    },
                },
                general: {
                    bonusFleetSlots: serverData.warriorBonusAdditionalFleetSlots,
                    bonusMoonFields: serverData.warriorBonusAdditionalMoonFields,
                    hasMorePreciseFleetSpeed: serverData.warriorBonusFleetHalfSpeed == 1,
                    hasAttackerWreckfield: serverData.warriorBonusAttackerWreckfield == 1,
                    combatShipSpeedFactorBonus: serverData.warriorBonusFasterCombatShips,
                    deuteriumConsumptionFactorReduction: serverData.warriorBonusFuelConsumption,
                    recyclers: {
                        cargoCapacityFactorBonus: serverData.warriorBonusRecyclerCargoCapacity,
                        deuteriumConsumptionFactorReduction: serverData.warriorBonusRecyclerFuelConsumption,
                        speedFactorBonus: serverData.warriorBonusFasterRecyclers,
                    },
                },
            },
        };
    }

    private async loadData() {
        const db = await getServerDatabase(GlobalOgameMetaData);
        const tx = db.transaction('serverSettings', 'readonly');
        const store = tx.objectStore('serverSettings');

        let serverSettings = {} as DbServerSettings;
        const allKeys = await store.getAllKeys();
        for(const key of allKeys) {
            const value = await store.get(key);
            serverSettings = {
                ...serverSettings,
                [key]: value,
            };
        }

        this.serverSettings = this.mapServerSettings(serverSettings);
    }

    private async onMessage(msg: Message) {
        const { type, ogameMeta } = msg;
        if (!ogameMetasEqual(ogameMeta, GlobalOgameMetaData, false)) {
            return;
        }

        switch (type) {
            case MessageType.NotifyServerSettingsUpdate: {
                await this.loadData();
                break;
            }
        }
    }
}

export const ServerSettingsDataModule = new ServerSettingsDataModuleClass();
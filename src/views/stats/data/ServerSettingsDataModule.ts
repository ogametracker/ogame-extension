import { MessageType } from '@/shared/messages/MessageType';
import { Message } from '@/shared/messages/Message';
import { GlobalOgameMetaData } from './global';
import { Component, Vue } from 'vue-property-decorator';
import { ogameMetasEqual } from '@/shared/ogame-web/ogameMetasEqual';
import { ServerSettings } from '@/shared/models/server-settings/ServerSettings';
import { getServerDatabase } from '@/shared/db/access';
import { DbServerSettings } from '@/shared/db/schema/server';

@Component
class ServerSettingsDataModuleClass extends Vue {
    public serverSettings: ServerSettings = this.mapServerSettings();

    private _ready!: Promise<void>;
    private _resolveReady!: () => void;

    public get lastUpdate(): Date | null {
        const lastUpdate = this.serverSettings?.lastUpdate;
        if (lastUpdate == null) {
            return null;
        }
        return new Date(lastUpdate);
    }

    public get ready(): Promise<void> {
        return this._ready;
    }

    private async created() {
        this._ready = new Promise<void>(resolve => this._resolveReady = resolve);

        this.initCommunication();
        await this.loadData();
    }

    private initCommunication() {
        chrome.runtime.onMessage.addListener(async message => await this.onMessage(message));
    }

    private mapServerSettings(serverData?: DbServerSettings): ServerSettings {
        return {
            lastUpdate: serverData?._lastUpdate ?? 0,
            version: serverData?.version ?? '10.1.28',
            topScore: serverData?.topScore ?? 0,
            speed: {
                economy: serverData?.speed ?? 1,
                research: serverData?.researchDurationDivisor ?? 1,
                fleet: {
                    peaceful: serverData?.speedFleetPeaceful ?? 1,
                    war: serverData?.speedFleetWar ?? 1,
                    holding: serverData?.speedFleetHolding ?? 1,
                },
            },
            universe: {
                galaxies: {
                    count: serverData?.galaxies ?? 5,
                    isDonut: serverData?.donutGalaxy ?? true,
                },
                systems: {
                    count: serverData?.systems ?? 499,
                    isDonut: serverData?.donutSystem ?? true,
                },
            },
            darkMatterBonus: serverData?.darkMatterNewAcount ?? 0,
            planetBonusFields: serverData?.bonusFields ?? 0,
            combats: {
                debrisFieldFactors: {
                    defense: serverData?.debrisFactorDef ?? 0,
                    ships: serverData?.debrisFactor ?? 0,
                },
                defenseRepairFactor: serverData?.repairFactor ?? 0.7,
                isAllianceCombatSystemEnabled: serverData?.acs ?? true,
                isRapidfireEnabled: serverData?.rapidFire?? true,
                wreckfields: {
                    isEnabled: serverData?.wfEnabled?? true,
                    minLostPercentage: serverData?.wfMinimumLossPercentage ?? 5,
                    minLostResources: serverData?.wfMinimumRessLost ?? 150_000,
                    repairableBasePercentage: serverData?.wfBasicPercentageRepairable ?? 45,
                },
            },
            fleet: {
                deuteriumConsumptionFactor: serverData?.globalDeuteriumSaveFactor ?? 1,
                hyperspaceCargoPercentageFactor: serverData?.cargoHyperspaceTechMultiplier ?? 5,
                espionageProbeCargo: serverData?.probeCargo ?? 0,
            },
            marketplace: {
                isEnabled: serverData?.marketplaceEnabled ?? false,
                offerTimeoutInDays: serverData?.marketplaceOfferTimeout ?? 3,
                priceRanges: {
                    upper: serverData?.marketplacePriceRangeUpper ?? 0.2,
                    lower: serverData?.marketplacePriceRangeLower ?? 0.2,
                },
                taxes: {
                    default: serverData?.marketplaceTaxNormalUser ?? 0.2,
                    admiral: serverData?.marketplaceTaxAdmiral ?? 0.1,
                    canceledOffers: serverData?.marketplaceTaxCancelOffer ?? 0.2,
                    unsoldOffers: serverData?.marketplaceTaxNotSold ?? 0.2,
                },
                tradeRatios: {
                    metal: serverData?.marketplaceBasicTradeRatioMetal ?? 2.5,
                    crystal: serverData?.marketplaceBasicTradeRatioCrystal ?? 1.5,
                    deuterium: serverData?.marketplaceBasicTradeRatioDeuterium ?? 1,
                },
            },
            resourceProduction: {
                productionFactorBonus: {
                    crystal: {
                        default: serverData?.resourceProductionIncreaseCrystalDefault ?? 0,
                        pos1: serverData?.resourceProductionIncreaseCrystalPos1 ?? 0.4,
                        pos2: serverData?.resourceProductionIncreaseCrystalPos2 ?? 0.3,
                        pos3: serverData?.resourceProductionIncreaseCrystalPos3 ?? 0.2,
                    },
                },
            },
            playerClasses: {
                areEnabled: serverData?.characterClassesEnabled == 1,
                crawlers: {
                    energyComsumptionPerUnit: serverData?.resourceBuggyEnergyConsumptionPerUnit ?? 50,
                    maxProductionFactor: serverData?.resourceBuggyMaxProductionBoost ?? 0.5,
                    productionBoostFactorPerUnit: serverData?.resourceBuggyProductionBoost ?? 0.0002,
                },
                reapers: {
                    combatDebrisFieldMiningFactor: serverData?.combatDebrisFieldLimit ?? 0.25,
                },
                collector: {
                    bonusFleetSlots: serverData?.minerBonusAdditionalFleetSlots ?? 0,
                    bonusMarketplaceSlots: serverData?.minerBonusAdditionalMarketSlots ?? 2,
                    energyProductionFactorBonus: serverData?.minerBonusEnergy ?? 0.1,
                    productionFactorBonus: serverData?.minerBonusResourceProduction ?? 0.25,
                    tradingShips: {
                        speedFactorBonus: serverData?.minerBonusFasterTradingShips ?? 1,
                        cargoCapacityFactorBonus: serverData?.minerBonusIncreasedCargoCapacityForTradingShips ?? 0.25,
                    },
                    crawlers: {
                        geologistActiveCrawlerFactorBonus: serverData?.minerBonusMaxCrawler ?? 0.1,
                        isOverloadEnabled: serverData?.minerBonusOverloadCrawler ?? true,
                        productionFactorBonus: serverData?.minerBonusAdditionalCrawler ?? 0.5,
                    },
                },
                discoverer: {
                    bonusExpeditionSlots: serverData?.explorerBonusAdditionalExpeditionSlots ?? 2,
                    researchSpeedFactor: serverData?.explorerBonusIncreasedResearchSpeed ?? 0.25,
                    phalanxRangeFactorBonus: serverData?.explorerBonusPhalanxRange ?? 0.2,
                    planetSizeFactorBonus: serverData?.explorerBonusLargerPlanets ?? 0.1,
                    hasBonusPlunderForInactivePlayers: serverData?.explorerBonusPlunderInactive?? true,
                    expeditions: {
                        outcomeFactorBonus: serverData?.explorerBonusIncreasedExpeditionOutcome ?? 0.5,
                        enemyFactorReduction: serverData?.explorerBonusExpeditionEnemyReduction ?? 0.5,
                        maxItemsPerDay: serverData?.explorerUnitItemsPerDay ?? 1,
                    },
                },
                general: {
                    bonusFleetSlots: serverData?.warriorBonusAdditionalFleetSlots ?? 2,
                    bonusMoonFields: serverData?.warriorBonusAdditionalMoonFields ?? 5,
                    hasMorePreciseFleetSpeed: serverData?.warriorBonusFleetHalfSpeed ?? true,
                    hasAttackerWreckfield: serverData?.warriorBonusAttackerWreckfield ?? true,
                    combatShipSpeedFactorBonus: serverData?.warriorBonusFasterCombatShips ?? 1,
                    deuteriumConsumptionFactorReduction: serverData?.warriorBonusFuelConsumption ?? 0.25,
                    recyclers: {
                        cargoCapacityFactorBonus: serverData?.warriorBonusRecyclerCargoCapacity ?? 0.2,
                        deuteriumConsumptionFactorReduction: serverData?.warriorBonusRecyclerFuelConsumption ?? 0,
                        speedFactorBonus: serverData?.warriorBonusFasterRecyclers ?? 1,
                    },
                },
            },

            lifeforms: {
                enabled: serverData?.lifeformsEnabled ?? false,
            },
        };
    }

    private async loadData() {
        const db = await getServerDatabase(GlobalOgameMetaData);
        const tx = db.transaction('serverSettings', 'readonly');
        const store = tx.objectStore('serverSettings');

        let serverSettings = {} as DbServerSettings;
        const allKeys = await store.getAllKeys();
        for (const key of allKeys) {
            const value = await store.get(key);
            serverSettings = {
                ...serverSettings,
                [key]: value,
            };
        }

        this.serverSettings = this.mapServerSettings(serverSettings);

        this._resolveReady();
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

    public async clear(): Promise<void> {
        const db = await getServerDatabase(GlobalOgameMetaData);
        await db.clear('serverSettings');
    }
}

export const ServerSettingsDataModule = new ServerSettingsDataModuleClass();
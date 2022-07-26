import { CrawlerProductionPercentage } from "@/shared/models/empire/CrawlerProductionPercentage";
import { AllianceClass } from "@/shared/models/ogame/classes/AllianceClass";
import { PlayerClass } from "@/shared/models/ogame/classes/PlayerClass";
import { CommandStaffProductionBonus, GeologistProductionBonus, PlasmaTechnologyProductionBonus } from "@/shared/models/ogame/resource-production/constants";
import { getCrawlerBoost } from "@/shared/models/ogame/resource-production/getCrawlerBoost";
import { ResourceType } from "@/shared/models/ogame/resources/ResourceType";
import { parseIntSafe } from "@/shared/utils/parseNumbers";

export class EmpireProductionBreakdown {
    #planetIds: number[];

    #resource: ResourceType;

    plasmaTechnologyLevel: number;
    playerClass: PlayerClass;
    allianceClass: AllianceClass;
    geologist: boolean;
    commandStaff: boolean;

    baseProduction: Record<number, number>;
    mineProduction: Record<number, number>;

    crawlers: Record<number, {
        available: number;
        totalMineLevel: number;
        percentage: CrawlerProductionPercentage;
    }>;

    itemBonusProductionFactor: Record<number, number>;
    lifeformBuildingBonusProductionFactor: Record<number, number>;
    lifeformTechnologyBonusProductionFactor: Record<number, number>;
    lifeformTechnologyCrawlerProductionBonusFactor: Record<number, number>;
    collectorClassBonusFactor: Record<number, number>;

    lifeformTechnologyBoost: Record<number, number>;
    lifeformExperienceBoost: Record<number, number>;

    serverSettings: {
        collectorProductionFactor: number;
        geologistActiveCrawlerFactorBonus: number;
        collectorCrawlerProductionFactorBonus: number;
        crawlerProductionFactorPerUnit: number;
        crawlerMaxProductionFactor: number;
    };

    public constructor(
        resource: ResourceType,

        plasmaTechnologyLevel: number,
        playerClass: PlayerClass,
        allianceClass: AllianceClass,
        geologist: boolean,
        commandStaff: boolean,

        serverSettings: {
            collectorProductionFactor: number;
            geologistActiveCrawlerFactorBonus: number;
            collectorCrawlerProductionFactorBonus: number;
            crawlerProductionFactorPerUnit: number;
            crawlerMaxProductionFactor: number;
        },

        baseProduction: Record<number, number>,
        mineProduction: Record<number, number>,
        crawlers: Record<number, {
            available: number;
            totalMineLevel: number;
            percentage: CrawlerProductionPercentage;
        }>,

        itemBonusProductionFactor: Record<number, number>,
        lifeformBuildingBonusProductionFactor: Record<number, number>,
        lifeformTechnologyBonusProductionFactor: Record<number, number>,
        lifeformTechnologyCrawlerProductionBonusFactor: Record<number, number>,
        collectorClassBonusFactor: Record<number, number>,

        lifeformTechnologyBoost: Record<number, number>,
        lifeformExperienceBoost: Record<number, number>,
    ) {
        this.#resource = resource;
        this.plasmaTechnologyLevel = plasmaTechnologyLevel;
        this.playerClass = playerClass;
        this.allianceClass = allianceClass;
        this.geologist = geologist;
        this.commandStaff = commandStaff;

        this.serverSettings = serverSettings;

        this.baseProduction = baseProduction;
        this.mineProduction = mineProduction;
        this.crawlers = crawlers;

        this.#planetIds = Object.keys(itemBonusProductionFactor).map(id => parseIntSafe(id));
        this.itemBonusProductionFactor = itemBonusProductionFactor;
        this.lifeformBuildingBonusProductionFactor = lifeformBuildingBonusProductionFactor;
        this.lifeformTechnologyBonusProductionFactor = lifeformTechnologyBonusProductionFactor;
        this.lifeformTechnologyCrawlerProductionBonusFactor = lifeformTechnologyCrawlerProductionBonusFactor;
        this.collectorClassBonusFactor = collectorClassBonusFactor;

        this.lifeformExperienceBoost = lifeformExperienceBoost;
        this.lifeformTechnologyBoost = lifeformTechnologyBoost;
    }

    public get total() {
        return this.#planetIds.reduce((total, planetId) => {
            const mineProduction = this.mineProduction[planetId];

            const playerClassFactor = (this.playerClass == PlayerClass.collector ? 1 : 0) * this.collectorClassBonusFactor[planetId];
            const allianceClassFactor = this.allianceClass == AllianceClass.trader ? 1 : 0;
            const geologistFactor = this.geologist ? GeologistProductionBonus : 0;
            const commandStaffFactor = this.commandStaff ? CommandStaffProductionBonus : 0;
            const lifeformTechnologyProductionFactor = this.lifeformTechnologyBonusProductionFactor[planetId] // lifeform technology bonus on the planet
                * (1 + this.lifeformTechnologyBoost[planetId]) // consider bonus through bonus buildings
                * (1 + this.lifeformExperienceBoost[planetId]); // consider additional bonus through lifeform level

            const crawlerConfig = this.crawlers[planetId];
            const crawlerProductionFactor = getCrawlerBoost({
                hasGeologist: this.geologist,
                availableCrawlers: crawlerConfig.available,
                levelMetalMine: crawlerConfig.totalMineLevel,
                levelCrystalMine: 0,
                levelDeuteriumSynthesizer: 0,
                crawlerProductionSetting: crawlerConfig.percentage,
                collectorClassBonus: this.collectorClassBonusFactor[planetId],
                playerClass: this.playerClass,
                serverSettings: {
                    collectorCrawlerProductionFactorBonus: this.serverSettings.collectorCrawlerProductionFactorBonus,
                    crawlerMaxProductionFactor: this.serverSettings.crawlerMaxProductionFactor,
                    crawlerProductionFactorPerUnit: this.serverSettings.crawlerProductionFactorPerUnit,
                    geologistActiveCrawlerFactorBonus: this.serverSettings.geologistActiveCrawlerFactorBonus,
                },
            });

            const planetProduction =
                this.baseProduction[planetId] // base production
                + mineProduction // mine production
                + (mineProduction * this.plasmaTechnologyLevel * PlasmaTechnologyProductionBonus[this.#resource]) // plasma technology bonus production
                + (mineProduction * crawlerProductionFactor) // crawler bonus production
                + (mineProduction * this.serverSettings.collectorProductionFactor * playerClassFactor) // player class bonus production
                + (mineProduction * allianceClassFactor) // alliance class bonus production
                + (mineProduction * geologistFactor) // geologist bonus production
                + (mineProduction * commandStaffFactor) // command staff bonus production
                + (mineProduction * this.itemBonusProductionFactor[planetId]) // item bonus production
                + (mineProduction * this.lifeformBuildingBonusProductionFactor[planetId]) // lifeform buildings bonus production
                + (mineProduction * lifeformTechnologyProductionFactor) // lifeform technology bonus production
            ;

            return total + planetProduction;
        }, 0);
    }


    public clone(): EmpireProductionBreakdown {
        const crawlerConfigClone = { ...this.crawlers };
        this.#planetIds.forEach(planetId => crawlerConfigClone[planetId] = { ...crawlerConfigClone[planetId] });

        return new EmpireProductionBreakdown(
            this.#resource,

            this.plasmaTechnologyLevel,
            this.playerClass,
            this.allianceClass,
            this.geologist,
            this.commandStaff,

            this.serverSettings,

            { ...this.baseProduction },
            { ...this.mineProduction },
            crawlerConfigClone,

            { ...this.itemBonusProductionFactor },
            { ...this.lifeformBuildingBonusProductionFactor },
            { ...this.lifeformTechnologyBonusProductionFactor },
            { ...this.lifeformTechnologyCrawlerProductionBonusFactor },
            { ...this.collectorClassBonusFactor },

            { ...this.lifeformTechnologyBoost },
            { ...this.lifeformExperienceBoost },
        );
    }
}
import { parseIntSafe } from "@/shared/utils/parseNumbers";
import { CrawlerProductionPercentage } from "../../empire/CrawlerProductionPercentage";
import { LocalPlayerData } from "../../empire/LocalPlayerData";
import { PlanetData } from "../../empire/PlanetData";
import { ServerSettings } from "../../server-settings/ServerSettings";
import { AllianceClass } from "../classes/AllianceClass";
import { PlayerClass } from "../classes/PlayerClass";
import { ResourceType } from "../resources/ResourceType";
import { AllianceClassTraderProductionBonus, CommandStaffProductionBonus, GeologistProductionBonus, PlasmaTechnologyProductionBonus } from "./constants";
import { getCrawlerBoost } from "./getCrawlerBoost";


interface GlobalProductionBonuses {
    collectorClassBonusFactor: number;
    lifeformTechnologyProductionBonusFactor: number;
    lifeformTechnologyCrawlerProductionBonusFactor: number;
}

export interface PlanetProductionBreakdown {
    baseProduction: number;
    mineProduction: number;
    plasmaTechnologyProduction: number;
    crawlerProduction: number;
    playerClassProduction: number;
    allianceClassProduction: number;
    geologistProduction: number;
    commandStaffProduction: number;
    itemProduction: number;
    lifeformBuildingsProduction: number;
    lifeformTechnologiesProduction: number;

    total: number;
}

export interface EmpireProductionPlanetState {
    baseProduction: number;
    mineProduction: number;
    fusionReactorConsumption: number;
    crawlers: {
        available: number;
        totalMineLevel: number;
        percentage: CrawlerProductionPercentage;
    };

    itemBonusProductionFactor: number;
    lifeformBuildingBonusProductionFactor: number;
    lifeformTechnologyBonusProductionFactor: number;
    lifeformTechnologyCrawlerProductionBonusFactor: number;
    collectorClassBonusFactor: number;

    lifeformTechnologyBoost: number;
    lifeformExperienceBoost: number;
}

export class EmpireProductionBreakdown {
    #planetIds: number[];

    #resource: ResourceType;

    plasmaTechnologyLevel: number;
    playerClass: PlayerClass;
    allianceClass: AllianceClass;
    geologist: boolean;
    commandStaff: boolean;

    planets: Record<number, EmpireProductionPlanetState>;

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

        planets: Record<number, EmpireProductionPlanetState>,
    ) {
        this.#resource = resource;
        this.plasmaTechnologyLevel = plasmaTechnologyLevel;
        this.playerClass = playerClass;
        this.allianceClass = allianceClass;
        this.geologist = geologist;
        this.commandStaff = commandStaff;

        this.serverSettings = serverSettings;

        this.planets = planets;
        this.#planetIds = Object.keys(planets).map(id => parseIntSafe(id));
    }

    getLifeformBonusFactors(): GlobalProductionBonuses {
        let collectorClassBonusFactor = 0;
        let lifeformTechnologyProductionBonusFactor = 0;
        let lifeformTechnologyCrawlerProductionBonusFactor = 0;

        this.#planetIds.forEach(planetId => {
            const planet = this.planets[planetId];
            const techBonusFactor = (1 + planet.lifeformTechnologyBoost) * (1 + planet.lifeformExperienceBoost);

            collectorClassBonusFactor += planet.collectorClassBonusFactor * techBonusFactor;
            lifeformTechnologyProductionBonusFactor += planet.lifeformTechnologyBonusProductionFactor * techBonusFactor;
            lifeformTechnologyCrawlerProductionBonusFactor += planet.lifeformTechnologyCrawlerProductionBonusFactor * techBonusFactor;
        });

        return {
            collectorClassBonusFactor,
            lifeformTechnologyProductionBonusFactor,
            lifeformTechnologyCrawlerProductionBonusFactor,
        };
    }

    public addPlanet(planetId: number, planetState: EmpireProductionPlanetState) {
        this.#planetIds.push(planetId);
        this.planets[planetId] = planetState;
    }

    public getProductionBreakdown(planetId: number) {
        return this.#getPlanetProductionBreakdown(planetId, this.getLifeformBonusFactors());
    }

    #getPlanetProductionBreakdown(planetId: number, globalBonuses: GlobalProductionBonuses) {
        const {
            collectorClassBonusFactor,
            lifeformTechnologyProductionBonusFactor,
            lifeformTechnologyCrawlerProductionBonusFactor
        } = globalBonuses;

        const mineProduction = this.planets[planetId].mineProduction;

        const playerClassFactor = (this.playerClass == PlayerClass.collector ? 1 : 0)
            * this.serverSettings.collectorProductionFactor
            * (1 + collectorClassBonusFactor);
        const allianceClassFactor = (this.allianceClass == AllianceClass.trader ? 1 : 0) * AllianceClassTraderProductionBonus;
        const geologistFactor = this.geologist ? GeologistProductionBonus : 0;
        const commandStaffFactor = this.commandStaff ? CommandStaffProductionBonus : 0;

        const crawlerConfig = this.planets[planetId].crawlers;
        const crawlerProductionFactor = getCrawlerBoost({
            hasGeologist: this.geologist,
            availableCrawlers: crawlerConfig.available,
            levelMetalMine: crawlerConfig.totalMineLevel,
            levelCrystalMine: 0,
            levelDeuteriumSynthesizer: 0,
            crawlerProductionSetting: crawlerConfig.percentage,
            lifeformTechnologies: {
                collectorClassBonus: collectorClassBonusFactor,
                crawlerProductionBonus: lifeformTechnologyCrawlerProductionBonusFactor,
            },
            playerClass: this.playerClass,
            serverSettings: {
                collectorCrawlerProductionFactorBonus: this.serverSettings.collectorCrawlerProductionFactorBonus,
                crawlerMaxProductionFactor: this.serverSettings.crawlerMaxProductionFactor,
                crawlerProductionFactorPerUnit: this.serverSettings.crawlerProductionFactorPerUnit,
                geologistActiveCrawlerFactorBonus: this.serverSettings.geologistActiveCrawlerFactorBonus,
            },
        });

        const baseProduction = this.planets[planetId].baseProduction; // base production
        const plasmaTechnologyProduction = (mineProduction * this.plasmaTechnologyLevel * PlasmaTechnologyProductionBonus[this.#resource]); // plasma technology bonus production
        const crawlerProduction = mineProduction * crawlerProductionFactor; // crawler bonus production
        const playerClassProduction = mineProduction * playerClassFactor; // player class bonus production
        const allianceClassProduction = mineProduction * allianceClassFactor; // alliance class bonus production
        const geologistProduction = mineProduction * geologistFactor; // geologist bonus production
        const commandStaffProduction = mineProduction * commandStaffFactor; // command staff bonus production
        const itemProduction = mineProduction * this.planets[planetId].itemBonusProductionFactor; // item bonus production
        const lifeformBuildingsProduction = mineProduction * this.planets[planetId].lifeformBuildingBonusProductionFactor; // lifeform buildings bonus production
        const lifeformTechnologiesProduction = mineProduction * lifeformTechnologyProductionBonusFactor; // lifeform technology bonus production

        const total =
            baseProduction
            + mineProduction
            + plasmaTechnologyProduction
            + crawlerProduction
            + playerClassProduction
            + allianceClassProduction
            + geologistProduction
            + commandStaffProduction
            + itemProduction
            + lifeformBuildingsProduction
            + lifeformTechnologiesProduction
            ;

        return {
            baseProduction,
            mineProduction,
            plasmaTechnologyProduction,
            crawlerProduction,
            playerClassProduction,
            allianceClassProduction,
            geologistProduction,
            commandStaffProduction,
            itemProduction,
            lifeformBuildingsProduction,
            lifeformTechnologiesProduction,

            total,
        };
    }

    public getTotal(includeConsumption = false) {
        const globalBonuses = this.getLifeformBonusFactors();

        return this.#planetIds.reduce((total, planetId) => {
            const consumption = includeConsumption ? this.planets[planetId].fusionReactorConsumption : 0;
            return total + this.#getPlanetProductionBreakdown(planetId, globalBonuses).total - consumption;
        }, 0);
    }

    public getAverage(includeConsumption = false) {
        return this.getTotal(includeConsumption) / this.#planetIds.length;
    }


    public clone(): EmpireProductionBreakdown {
        const planetStatesClone: Record<number, EmpireProductionPlanetState> = {};
        this.#planetIds.forEach(planetId => {
            planetStatesClone[planetId] = {
                ...this.planets[planetId],
                crawlers: {
                    ...this.planets[planetId].crawlers,
                },
            };
        });

        return new EmpireProductionBreakdown(
            this.#resource,

            this.plasmaTechnologyLevel,
            this.playerClass,
            this.allianceClass,
            this.geologist,
            this.commandStaff,

            this.serverSettings,

            planetStatesClone,
        );
    }
}
import { PlanetActiveItems } from "../../empire/PlanetActiveItems";
import { PlayerOfficers } from "../../empire/PlayerOfficers";
import { AllianceClass } from "../classes/AllianceClass";
import { PlayerClass } from "../classes/PlayerClass";
import { Cost } from "../common/Cost";
import { ItemHash } from "../items/ItemHash";
import { getLifeformBuildingProductionBonuses } from "../lifeforms/buildings/getLifeformBuildingProductionBonuses";
import { getLifeformCollectorClassBonus } from "../lifeforms/buildings/getLifeformCollectorClassBonus";
import { getLifeformTechnologyProductionBonuses } from "../lifeforms/buildings/getLifeformTechnologyProductionBonuses";
import { ResearchType } from "../research/ResearchType";
import { ShipType } from "../ships/ShipType";
import { BuildingType } from "./BuildingType";
import { getMaxActiveCrawlers } from "./getMaxActiveCrawlers";
import { ProductionBuilding, ProductionBuildingDependencies } from "./ProductionBuilding";

//TODO: refactor, production should only return mine production
class MetalMineClass extends ProductionBuilding {

    public getProduction(level: number, dependencies: ProductionBuildingDependencies): Cost {
        const boost = this.getProductionBoost(dependencies.planet.coordinates.position);
        const collectorClassBonus = 1 + getLifeformCollectorClassBonus(dependencies.player);

        const baseProduction = 30 * dependencies.serverSettings.speed.economy * (1 + boost);
        const mineProduction = Math.trunc(baseProduction * level * 1.1 ** level * dependencies.planet.productionSettings[BuildingType.metalMine] / 100);
        const geologistProduction = Math.round(mineProduction * 0.1 * (dependencies.player.officers.geologist ? 1 : 0));
        const plasmaTechProduction = Math.floor(mineProduction * 0.01 * dependencies.player.research[ResearchType.plasmaTechnology]);
        const collectorProduction = Math.round(
            mineProduction
            * dependencies.serverSettings.playerClasses.collector.productionFactorBonus
            * (dependencies.player.playerClass == PlayerClass.collector ? 1 : 0)
            * collectorClassBonus);
        const commandStaffProduction = Math.round(mineProduction * 0.02 * (this.hasCommandStaff(dependencies.player.officers) ? 1 : 0));
        const traderProduction = Math.round(mineProduction * 0.05 * (dependencies.player.allianceClass == AllianceClass.trader ? 1 : 0));
        const itemProduction = Math.floor(mineProduction * this.getItemBoost(dependencies.planet.activeItems));

        const lifeformBuildingProduction = Math.floor(
            getLifeformBuildingProductionBonuses(dependencies.planet)
                .map(bonus => mineProduction * bonus.metal)
                .reduce((acc, cur) => acc + cur, 0)
        );
        const lifeformTechProduction = Math.floor(
            mineProduction
            * getLifeformTechnologyProductionBonuses(dependencies.player).reduce((acc, cur) => acc + cur.metal, 0)
        );

        const maxCrawlers = getMaxActiveCrawlers(
            level,
            dependencies.planet.buildings[BuildingType.crystalMine],
            dependencies.planet.buildings[BuildingType.deuteriumSynthesizer],
            dependencies.player.playerClass,
            dependencies.player.officers.geologist,
            dependencies.serverSettings,
            collectorClassBonus,
        );
        const crawlerCount = Math.min(maxCrawlers, dependencies.planet.ships[ShipType.crawler]);
        const crawlerProductivity = dependencies.player.playerClass == PlayerClass.collector
            ? (1 + dependencies.serverSettings.playerClasses.collector.crawlers.productionFactorBonus) * collectorClassBonus
            : 1;
        const crawlerBoost = Math.min(
            dependencies.serverSettings.playerClasses.crawlers.maxProductionFactor,
            dependencies.serverSettings.playerClasses.crawlers.productionBoostFactorPerUnit * crawlerCount * crawlerProductivity * dependencies.planet.productionSettings[ShipType.crawler] / 100);
        const crawlerProduction = Math.round(mineProduction * crawlerBoost);

        const production = Math.trunc(
            baseProduction
            + mineProduction
            + geologistProduction
            + plasmaTechProduction
            + collectorProduction
            + commandStaffProduction
            + traderProduction
            + itemProduction
            + crawlerProduction
            + lifeformBuildingProduction
            + lifeformTechProduction
        );

        return {
            metal: production,
            crystal: 0,
            deuterium: 0,
            energy: 0,
        };
    }

    private getItemBoost(activeItems: PlanetActiveItems) {
        const now = Date.now();

        const items10 = [ItemHash.metalBooster_bronze_1day, ItemHash.metalBooster_bronze_7days];
        const items20 = [ItemHash.metalBooster_silver_7days, ItemHash.metalBooster_silver_30days, ItemHash.metalBooster_silver_90days];
        const items30 = [ItemHash.metalBooster_gold_7days, ItemHash.metalBooster_gold_30days, ItemHash.metalBooster_gold_90days];
        const items40 = [ItemHash.metalBooster_platinum_7days, ItemHash.metalBooster_platinum_30days, ItemHash.metalBooster_platinum_90days];

        if (items10.some(hash => activeItems[hash] == 'permanent' || (activeItems[hash] ?? -1) > now)) {
            return 0.1;
        }
        if (items20.some(hash => activeItems[hash] == 'permanent' || (activeItems[hash] ?? -1) > now)) {
            return 0.2;
        }
        if (items30.some(hash => activeItems[hash] == 'permanent' || (activeItems[hash] ?? -1) > now)) {
            return 0.3;
        }
        if (items40.some(hash => activeItems[hash] == 'permanent' || (activeItems[hash] ?? -1) > now)) {
            return 0.4;
        }

        return 0;
    }

    private hasCommandStaff(officers: PlayerOfficers) {
        return officers.admiral
            && officers.commander
            && officers.engineer
            && officers.geologist
            && officers.technocrat;
    }

    private getProductionBoost(position: number) {
        switch (position) {
            case 8:
                return 0.35;

            case 7:
            case 9:
                return 0.23;

            case 6:
            case 10:
                return 0.17;
        }

        return 0;
    }

    public getConsumption(level: number, dependencies: ProductionBuildingDependencies): Cost {
        return {
            metal: 0,
            crystal: 0,
            deuterium: 0,
            energy: Math.ceil(10 * level * 1.1 ** level),
        };
    }

    public getCost(level: number): Cost {
        return {
            metal: Math.round(40 * 1.5 ** level),
            crystal: Math.round(10 * 1.5 ** level),
            deuterium: 0,
            energy: 0,
        };
    }

}
export const MetalMine = new MetalMineClass();
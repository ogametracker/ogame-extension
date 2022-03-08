import { PlanetActiveItems } from "../../empire/PlanetActiveItems";
import { PlayerOfficers } from "../../empire/PlayerOfficers";
import { AllianceClass } from "../classes/AllianceClass";
import { PlayerClass } from "../classes/PlayerClass";
import { Cost } from "../common/Cost";
import { ItemHash } from "../items/ItemHash";
import { ResearchType } from "../research/ResearchType";
import { ShipType } from "../ships/ShipType";
import { BuildingType } from "./BuildingType";
import { getMaxActiveCrawlers } from "./getMaxActiveCrawlers";
import { ProductionBuilding, ProductionBuildingDependencies } from "./ProductionBuilding";

class DeuteriumSynthesizerClass extends ProductionBuilding {

    public getProduction(level: number, dependencies: ProductionBuildingDependencies): Cost {
        const mineProduction = Math.trunc(10 * level * 1.1 ** level * dependencies.economySpeed
            * (1.44 - 0.004 * dependencies.planet.maxTemperature)
            * dependencies.planet.productionSettings[BuildingType.deuteriumSynthesizer] / 100
        );
        const geologistProduction = Math.round(mineProduction * 0.1 * (dependencies.player.officers.geologist ? 1 : 0));
        const plasmaTechProduction = Math.round(mineProduction * 0.0033 * dependencies.player.research[ResearchType.plasmaTechnology]);
        const collectorProduction = Math.round(mineProduction * 0.25 * (dependencies.player.playerClass == PlayerClass.collector ? 1 : 0));
        const commandStaffProduction = Math.round(mineProduction * 0.02 * (this.hasCommandStaff(dependencies.player.officers) ? 1 : 0));
        const traderProduction = Math.round(mineProduction * 0.05 * (dependencies.player.allianceClass == AllianceClass.trader ? 1 : 0));
        const itemProduction = Math.round(mineProduction * this.getItemBoost(dependencies.planet.activeItems));

        const maxCrawlers = getMaxActiveCrawlers(
            dependencies.planet.buildings.production[BuildingType.metalMine],
            dependencies.planet.buildings.production[BuildingType.crystalMine],
            level,
            dependencies.player.playerClass,
            dependencies.player.officers.geologist
        );
        const crawlerCount = Math.min(maxCrawlers, dependencies.planet.ships[ShipType.crawler]);
        const crawlerProductivity = dependencies.player.playerClass == PlayerClass.collector ? 1.5 : 1;
        const crawlerBoost = Math.min(0.5, 0.0002 * crawlerCount * crawlerProductivity * dependencies.planet.productionSettings[ShipType.crawler] / 100);
        const crawlerProduction = Math.round(mineProduction * crawlerBoost);

        const production = mineProduction
            + geologistProduction
            + plasmaTechProduction
            + collectorProduction
            + commandStaffProduction
            + traderProduction
            + itemProduction
            + crawlerProduction;

        return {
            metal: 0,
            crystal: 0,
            deuterium: production,
            energy: 0,
        };
    }

    private getItemBoost(activeItems: PlanetActiveItems) {
        const now = Date.now();

        const items10 = [ItemHash.deuteriumBooster_bronze_1day, ItemHash.deuteriumBooster_bronze_7days];
        const items20 = [ItemHash.deuteriumBooster_silver_7days, ItemHash.deuteriumBooster_silver_30days, ItemHash.deuteriumBooster_silver_90days];
        const items30 = [ItemHash.deuteriumBooster_gold_7days, ItemHash.deuteriumBooster_gold_30days, ItemHash.deuteriumBooster_gold_90days];
        const items40 = [ItemHash.deuteriumBooster_platinum_7days, ItemHash.deuteriumBooster_platinum_30days, ItemHash.deuteriumBooster_platinum_90days];

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

    public getConsumption(level: number, dependencies: ProductionBuildingDependencies): Cost {
        return {
            metal: 0,
            crystal: 0,
            deuterium: 0,
            energy: Math.ceil(20 * level * 1.1 ** level),
        };
    }

    public getCost(level: number): Cost {
        return {
            metal: Math.round(150 * 1.5 ** level),
            crystal: Math.round(50 * 1.5 ** level),
            deuterium: 0,
            energy: 0,
        };
    }

}
export const DeuteriumSynthesizer = new DeuteriumSynthesizerClass();
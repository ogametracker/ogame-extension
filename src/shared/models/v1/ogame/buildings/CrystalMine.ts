import { PlayerOfficers } from "../../empire/PlayerOfficers";
import { AllianceClass } from "../classes/AllianceClass";
import { PlayerClass } from "../classes/PlayerClass";
import { Cost } from "../common/Cost";
import { ItemHash } from "../items/ItemHash";
import { ResearchType } from "../research/ResearchType";
import { ShipType } from "../ships/ShipType";
import { BuildingType } from "./BuildingType";
import { ProductionBuilding, ProductionBuildingDependencies } from "./ProductionBuilding";

class CrystalMineClass extends ProductionBuilding {

    public getProduction(level: number, dependencies: ProductionBuildingDependencies): Cost {
        const boost = this.getProductionBoost(dependencies.planet.coordinates.position);

        const baseProduction = Math.trunc(15 * dependencies.economySpeed * (1 + boost));
        const mineProduction = Math.trunc(20 * dependencies.economySpeed * (1 + boost) * level * 1.1 ** level * dependencies.planet.productionSettings[BuildingType.crystalMine] / 100);
        const geologistProduction = Math.round(mineProduction * 0.1 * (dependencies.player.officers.geologist ? 1 : 0));
        const plasmaTechProduction = Math.round(mineProduction * 0.0066 * dependencies.player.research[ResearchType.plasmaTechnology]);
        const collectorProduction = Math.round(mineProduction * 0.25 * (dependencies.player.playerClass == PlayerClass.collector ? 1 : 0));
        const commandStaffProduction = Math.round(mineProduction * 0.02 * (this.hasCommandStaff(dependencies.player.officers) ? 1 : 0));
        const traderProduction = Math.round(mineProduction * 0.05 * (dependencies.player.allianceClass == AllianceClass.trader ? 1 : 0));
        const itemProduction = Math.round(mineProduction * this.getItemBoost(dependencies.planet.activeItems));

        const maxCrawlerFactor = dependencies.player.officers.geologist && dependencies.player.playerClass == PlayerClass.collector
            ? 1.1
            : 1;
        const maxCrawlers = Math.round(
            (
                dependencies.planet.buildings.production[BuildingType.metalMine]
                + level
                + dependencies.planet.buildings.production[BuildingType.deuteriumSynthesizer]
            ) * 8
            * maxCrawlerFactor
        );
        const crawlerCount = Math.min(maxCrawlers, dependencies.planet.ships[ShipType.crawler]);
        const crawlerProductivity = dependencies.player.playerClass == PlayerClass.collector ? 1.5 : 1;
        const crawlerBoost = Math.min(0.5, 0.0002 * crawlerCount * crawlerProductivity * dependencies.planet.productionSettings[ShipType.crawler] / 100);
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
        );

        return {
            metal: 0,
            crystal: production,
            deuterium: 0,
            energy: 0,
        };
    }

    private getItemBoost(activeItems: Partial<Record<ItemHash, number | undefined>>) {
        const now = Date.now();

        const items10 = [ItemHash.crystalBooster_bronze_1day, ItemHash.crystalBooster_bronze_7days];
        const items20 = [ItemHash.crystalBooster_silver_7days, ItemHash.crystalBooster_silver_30days, ItemHash.crystalBooster_silver_90days];
        const items30 = [ItemHash.crystalBooster_gold_7days, ItemHash.crystalBooster_gold_30days, ItemHash.crystalBooster_gold_90days];
        const items40 = [ItemHash.crystalBooster_platinum_7days, ItemHash.crystalBooster_platinum_30days, ItemHash.crystalBooster_platinum_90days];

        if (items10.some(hash => (activeItems[hash] ?? -1) > now)) {
            return 0.1;
        }
        if (items20.some(hash => (activeItems[hash] ?? -1) > now)) {
            return 0.2;
        }
        if (items30.some(hash => (activeItems[hash] ?? -1) > now)) {
            return 0.3;
        }
        if (items40.some(hash => (activeItems[hash] ?? -1) > now)) {
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
            case 1:
                return 0.4;

            case 2:
                return 0.3;

            case 3:
                return 0.2;
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
            metal: Math.round(30 * 1.6 ** level),
            crystal: Math.round(15 * 1.6 ** level),
            deuterium: 0,
            energy: 0,
        };
    }

}
export const CrystalMine = new CrystalMineClass();
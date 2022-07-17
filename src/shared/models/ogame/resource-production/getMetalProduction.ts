import { PlanetActiveItems } from "../../empire/PlanetActiveItems";
import { getMaxActiveCrawlers } from "../buildings/getMaxActiveCrawlers";
import { MetalMine } from "../buildings/MetalMine";
import { PlayerClass } from "../classes/PlayerClass";
import { ItemHash } from "../items/ItemHash";
import { getLifeformBuildingProductionBonuses } from "../lifeforms/buildings/getLifeformBuildingProductionBonuses";
import { getLifeformCollectorClassBonus } from "../lifeforms/buildings/getLifeformCollectorClassBonus";
import { getLifeformTechnologyProductionBonuses } from "../lifeforms/buildings/getLifeformTechnologyProductionBonuses";
import { hasCommandStaff } from "../premium/hasCommandStaff";
import { ResearchType } from "../research/ResearchType";
import { ProductionBreakdown } from "./types";

function getMetalItemBoost(activeItems: PlanetActiveItems) {
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

function getMetalProductionBoost(position: number) {
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

export function getMetalProduction(): ProductionBreakdown {
    const boost = getMetalProductionBoost(dependencies.planet.coordinates.position);
    const collectorClassBonus = 1 + getLifeformCollectorClassBonus(dependencies.player);

    const baseProduction = 30 * dependencies.serverSettings.speed.economy * (1 + boost);
    const mineProduction = MetalMine.getProduction(level, null);
    const geologistProduction = Math.round(mineProduction * 0.1 * (dependencies.player.officers.geologist ? 1 : 0));
    const plasmaTechProduction = mineProduction * 0.01 * dependencies.player.research[ResearchType.plasmaTechnology];
    const collectorProduction = mineProduction
        * dependencies.serverSettings.playerClasses.collector.productionFactorBonus
        * (dependencies.player.playerClass == PlayerClass.collector ? 1 : 0)
        * collectorClassBonus;
    const commandStaffProduction = Math.round(mineProduction * 0.02 * (hasCommandStaff(dependencies.player.officers) ? 1 : 0));
    const traderProduction = Math.round(mineProduction * 0.05 * (dependencies.player.allianceClass == AllianceClass.trader ? 1 : 0));
    const itemProduction = mineProduction * getMetalItemBoost(dependencies.planet.activeItems);

    const lifeformBuildingProduction = getLifeformBuildingProductionBonuses(dependencies.planet)
        .map(bonus => mineProduction * bonus.metal)
        .reduce((acc, cur) => acc + cur, 0);
    const lifeformTechProduction = mineProduction
        * getLifeformTechnologyProductionBonuses(dependencies.player).reduce((acc, cur) => acc + cur.metal, 0);

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

    const production = baseProduction
        + mineProduction
        + geologistProduction
        + plasmaTechProduction
        + collectorProduction
        + commandStaffProduction
        + traderProduction
        + itemProduction
        + crawlerProduction
        + lifeformBuildingProduction
        + lifeformTechProduction;

    return {
        base: baseProduction,
        mine: mineProduction.crystal,
        plasmaTechnology: plasmaTechProduction,
        geologist: geologistProduction,
        commandStaff: commandStaffProduction,
        allianceClass: collectorProduction,
        playerClass: traderProduction,
        crawlers: crawlerProduction,
        item: itemProduction,
        lifeformBuildings: lifeformBuildingProduction,
        lifeformTechnologies: lifeformTechProduction,
        total: 0
    };
    
}
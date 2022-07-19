import { PlanetActiveItems } from "../../empire/PlanetActiveItems";
import { BuildingType } from "../buildings/BuildingType";
import { AllianceClass } from "../classes/AllianceClass";
import { PlayerClass } from "../classes/PlayerClass";
import { ItemHash } from "../items/ItemHash";
import { getLifeformBuildingProductionBonuses } from "../lifeforms/buildings/getLifeformBuildingProductionBonuses";
import { getLifeformCollectorClassBonus } from "../lifeforms/buildings/getLifeformCollectorClassBonus";
import { getLifeformTechnologyProductionBonuses } from "../lifeforms/buildings/getLifeformTechnologyProductionBonuses";
import { hasCommandStaff } from "../premium/hasCommandStaff";
import { ResearchType } from "../research/ResearchType";
import { createProductionBreakdown } from "./createProductionBreakdown";
import { ProductionBreakdown, ProductionDependencies } from "./types";
import { getCrawlerBoost } from "./getCrawlerBoost";
import { ServerSettings } from "../../server-settings/ServerSettings";
import { CrystalMine } from "../buildings/CrystalMine";
import { getProductionBuildingDependencies } from "./getProductionBuildingDependencies";

function getCrystalItemBoost(activeItems: PlanetActiveItems) {
    const now = Date.now();

    const items10 = [ItemHash.crystalBooster_bronze_1day, ItemHash.crystalBooster_bronze_7days];
    const items20 = [ItemHash.crystalBooster_silver_7days, ItemHash.crystalBooster_silver_30days, ItemHash.crystalBooster_silver_90days];
    const items30 = [ItemHash.crystalBooster_gold_7days, ItemHash.crystalBooster_gold_30days, ItemHash.crystalBooster_gold_90days];
    const items40 = [ItemHash.crystalBooster_platinum_7days, ItemHash.crystalBooster_platinum_30days, ItemHash.crystalBooster_platinum_90days];

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

function getCrystalProductionBoost(position: number, serverSettings: ServerSettings) {
    switch (position) {
        case 1:
            return serverSettings.resourceProduction.productionFactorBonus.crystal.pos1;

        case 2:
            return serverSettings.resourceProduction.productionFactorBonus.crystal.pos2;

        case 3:
            return serverSettings.resourceProduction.productionFactorBonus.crystal.pos3;
    }

    return serverSettings.resourceProduction.productionFactorBonus.crystal.default;
}

export function getCrystalProduction(dependencies: ProductionDependencies): ProductionBreakdown {
    const boost = getCrystalProductionBoost(dependencies.planet.coordinates.position, dependencies.serverSettings);

    const baseProduction = 15 * dependencies.serverSettings.speed.economy * (1 + boost);

    const mineLevel = dependencies.planet.buildings[BuildingType.crystalMine];
    const mineProduction = CrystalMine.getProduction(mineLevel, getProductionBuildingDependencies(dependencies));

    const geologistFactor = dependencies.player.officers.geologist ? 1 : 0;
    const geologistBonus = 0.1; //10%
    const geologistProduction = geologistFactor * mineProduction * geologistBonus;

    const plasmaTechBonusPerLevel = 0.0066; //0.66%
    const plasmaTechProduction = mineProduction * plasmaTechBonusPerLevel * dependencies.player.research[ResearchType.plasmaTechnology];

    const collectorClassFactor = 1 + getLifeformCollectorClassBonus(dependencies.player);
    const collectorFactor = dependencies.player.playerClass == PlayerClass.collector ? 1 : 0;
    const playerClassProduction = collectorFactor
        * mineProduction
        * dependencies.serverSettings.playerClasses.collector.productionFactorBonus
        * collectorClassFactor;

    const commandStaffFactor = hasCommandStaff(dependencies.player.officers) ? 1 : 0;
    const commandStaffBonus = 0.02; //2%
    const commandStaffProduction = commandStaffFactor * mineProduction * commandStaffBonus;

    const traderBonus = 0.05; //5%
    const allianceClassFactor = dependencies.player.allianceClass == AllianceClass.trader ? 1 : 0;
    const allianceClassProduction = allianceClassFactor * mineProduction * traderBonus;

    const itemProduction = mineProduction * getCrystalItemBoost(dependencies.planet.activeItems);

    const lifeformBuildingProduction = getLifeformBuildingProductionBonuses(dependencies.planet)
        .map(bonus => mineProduction * bonus.crystal)
        .reduce((acc, cur) => acc + cur, 0);

    const lifeformTechProduction = mineProduction
        * getLifeformTechnologyProductionBonuses(dependencies.player).reduce((acc, cur) => acc + cur.crystal, 0);

    const crawlerBoost = getCrawlerBoost(dependencies, collectorClassFactor);
    const crawlerProduction = mineProduction * crawlerBoost;

    return createProductionBreakdown({
        base: baseProduction,
        mine: mineProduction,
        plasmaTechnology: plasmaTechProduction,
        geologist: geologistProduction,
        commandStaff: commandStaffProduction,
        allianceClass: allianceClassProduction,
        playerClass: playerClassProduction,
        crawlers: crawlerProduction,
        item: itemProduction,
        lifeformBuildings: lifeformBuildingProduction,
        lifeformTechnologies: lifeformTechProduction,
    });

}
import Building from "@/models/Building";
import { ItemHash } from "@/models/items";
import Research from "@/models/Research";
import Ship from "@/models/Ship";
import { AllianceClass, PlayerClass, PlayerOfficers } from "@/store/modules/LocalPlayerModule";
import Cost from "../Cost";
import ProductionBuilding, { ProductionInject } from "./ProductionBuilding";

class DeuteriumSynthesizer extends ProductionBuilding {

    public getProduction(level: number, data: ProductionInject): Cost {
        const mineProduction = Math.trunc(10 * level * 1.1 ** level * data.ecoSpeed
            * (1.44 - 0.004 * data.currentPlanet.maxTemperature) 
            * data.currentPlanet.productionSettings[Building.deuteriumSynthesizer] / 100
        );
        const geologistProduction = Math.round(mineProduction * 0.1 * (data.player.officers.geologist ? 1 : 0));
        const plasmaTechProduction = Math.round(mineProduction * 0.0033 * data.player.research[Research.plasmaTechnology]);
        const collectorProduction = Math.round(mineProduction * 0.25 * (data.player.playerClass == PlayerClass.collector ? 1 : 0));
        const commandStaffProduction = Math.round(mineProduction * 0.02 * (this.hasCommandStaff(data.player.officers) ? 1 : 0));
        const traderProduction = Math.round(mineProduction * 0.05 * (data.player.allianceClass == AllianceClass.trader ? 1 : 0));
        const itemProduction = Math.round(mineProduction * this.getItemBoost(data.currentPlanet.activeItems));

        const maxCrawlers = Math.round(
            (
                data.currentPlanet.buildings.production[Building.metalMine]
                + data.currentPlanet.buildings.production[Building.crystalMine]
                + data.currentPlanet.buildings.production[Building.deuteriumSynthesizer]
            ) * 8
            * (data.player.officers.geologist ? 1.1 : 1)
        );
        const crawlerCount = Math.min(maxCrawlers, data.currentPlanet.ships[Ship.crawler]);
        const crawlerProductivity = data.player.playerClass == PlayerClass.collector ? 1.5 : 1;
        const crawlerBoost = Math.min(0.5, 0.0002 * crawlerCount * crawlerProductivity * data.currentPlanet.productionSettings[Ship.crawler] / 100);
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

    private getItemBoost(activeItems: Partial<Record<ItemHash, number | undefined>>) {
        const now = Date.now();

        const items10 = [ItemHash.deuteriumBooster_bronze_1day, ItemHash.deuteriumBooster_bronze_7days];
        const items20 = [ItemHash.deuteriumBooster_silver_7days, ItemHash.deuteriumBooster_silver_30days, ItemHash.deuteriumBooster_silver_90days];
        const items30 = [ItemHash.deuteriumBooster_gold_7days, ItemHash.deuteriumBooster_gold_30days, ItemHash.deuteriumBooster_gold_90days];
        const items40 = [ItemHash.deuteriumBooster_platinum_7days, ItemHash.deuteriumBooster_platinum_30days, ItemHash.deuteriumBooster_platinum_90days];

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

    public getConsumption(level: number, data: ProductionInject): Cost {
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

export default new DeuteriumSynthesizer();
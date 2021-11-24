import Building from "@/models/Building";
import { ItemHash } from "@/models/items";
import Research from "@/models/Research";
import Ship from "@/models/Ship";
import { AllianceClass, PlayerClass, PlayerOfficers } from "@/store/modules/LocalPlayerModule";
import Cost from "../Cost";
import ProductionBuilding, { ProductionInject } from "./ProductionBuilding";

class FusionReactor extends ProductionBuilding {

    public getProduction(level: number, data: ProductionInject): Cost {
        const plantProduction = Math.trunc(
            30 * level 
            * (1.05 + 0.01 * data.player.research[Research.energyTechnology]) ** level 
            * data.ecoSpeed
        );
        const engineerProduction = Math.round(plantProduction * 0.1 * (data.player.officers.engineer ? 1 : 0));
        const collectorProduction = Math.round(plantProduction * 0.1 * (data.player.playerClass == PlayerClass.collector ? 1 : 0));
        const commandStaffProduction = Math.round(plantProduction * 0.02 * (this.hasCommandStaff(data.player.officers) ? 1 : 0));
        const traderProduction = Math.round(plantProduction * 0.05 * (data.player.allianceClass == AllianceClass.trader ? 1 : 0));
        const itemProduction = Math.round(plantProduction * this.getItemBoost(data.currentPlanet.activeItems));

        const production = plantProduction
            + engineerProduction
            + collectorProduction
            + commandStaffProduction
            + traderProduction
            + itemProduction;

        return {
            metal: 0,
            crystal: 0,
            deuterium: production,
            energy: 0,
        };
    }

    private getItemBoost(activeItems: Partial<Record<ItemHash, number | undefined>>) {
        const now = Date.now();

        const items10 = [ItemHash.energyBooster_bronze_7days];
        const items20 = [ItemHash.energyBooster_silver_7days, ItemHash.energyBooster_silver_30days, ItemHash.energyBooster_silver_90days];
        const items30 = [ItemHash.energyBooster_gold_7days, ItemHash.energyBooster_gold_30days, ItemHash.energyBooster_gold_90days];
        const items40 = [ItemHash.energyBooster_platinum_7days, ItemHash.energyBooster_platinum_30days, ItemHash.energyBooster_platinum_90days];

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
            deuterium: Math.floor(10 * level * 1.1 ** level * data.ecoSpeed),
            energy: 0,
        };
    }

    public getCost(level: number): Cost {
        return {
            metal: Math.round(500 * 1.8 ** level),
            crystal: Math.round(200 * 1.8 ** level),
            deuterium: Math.round(100 * 1.8 ** level),
            energy: 0,
        };
    }
}

export default new FusionReactor();
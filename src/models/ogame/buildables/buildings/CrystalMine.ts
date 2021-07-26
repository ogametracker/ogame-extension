import Building from "@/models/Building";
import { ItemHash } from "@/models/items";
import Research from "@/models/Research";
import Ship from "@/models/Ship";
import { AllianceClass, PlayerClass, PlayerOfficers } from "@/store/modules/LocalPlayerModule";
import Cost from "../Cost";
import ProductionBuilding, { ProductionInject } from "./ProductionBuilding";

class CrystalMine extends ProductionBuilding {

    public getProduction(level: number, data: ProductionInject): Cost {
        const boost = this.getProductionBoost(data.currentPlanet.coordinates.position);

        const baseProduction = Math.trunc(15 * data.ecoSpeed * (1 + boost));
        const mineProduction = Math.trunc(20 * data.ecoSpeed * (1 + boost) * level * 1.1 ** level * (data.currentPlanet.productionSettings?.[Building.crystalMine] ?? 100) / 100);
        const geologistProduction = Math.round(mineProduction * 0.1 * (data.player.officers.geologist ? 1 : 0));
        const plasmaTechProduction = Math.round(mineProduction * 0.0066 * (data.player.research?.[Research.plasmaTechnology] ?? 0));
        const collectorProduction = Math.round(mineProduction * 0.25 * (data.player.playerClass == PlayerClass.collector ? 1 : 0));
        const commandStaffProduction = Math.round(mineProduction * 0.02 * (this.hasCommandStaff(data.player.officers) ? 1 : 0));
        const traderProduction = Math.round(mineProduction * 0.05 * (data.player.allianceClass == AllianceClass.trader ? 1 : 0));
        const itemProduction = Math.round(mineProduction * this.getItemBoost(data.currentPlanet.activeItems));

        const maxCrawlers = Math.round(
            (
                (data.currentPlanet.buildings?.production?.[Building.metalMine] ?? 0)
                + (data.currentPlanet.buildings?.production?.[Building.crystalMine] ?? 0)
                + (data.currentPlanet.buildings?.production?.[Building.deuteriumSynthesizer] ?? 0)
            ) * 8
            * (data.player.officers.geologist ? 1.1 : 1)
        );
        const crawlerCount = Math.min(maxCrawlers, data.currentPlanet.ships?.[Ship.crawler] ?? 0);
        const crawlerProductivity = data.player.playerClass == PlayerClass.collector ? 1.5 : 1;
        const crawlerBoost = Math.min(0.5, 0.0002 * crawlerCount * crawlerProductivity * (data.currentPlanet.productionSettings?.[Ship.crawler] ?? 100) / 100);
        const crawlerProduction = Math.round(mineProduction * crawlerBoost);

        const production = baseProduction
            + mineProduction
            + geologistProduction
            + plasmaTechProduction
            + collectorProduction
            + commandStaffProduction
            + traderProduction
            + itemProduction
            + crawlerProduction;

        return {
            metal: 0,
            crystal: production,
            deuterium: 0,
            energy: 0,
        };
    }

    private getItemBoost(activeItems?: Partial<Record<ItemHash, number | undefined>>) {
        if (activeItems == null) {
            return 0;
        }

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

    public getConsumption(level: number, data: ProductionInject): Cost {
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

export default new CrystalMine();
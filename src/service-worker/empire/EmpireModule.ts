import { _log, _logError } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import { MessageOgameMeta } from "../../shared/messages/Message";
import { PlayerOfficers } from "../../shared/models/empire/PlayerOfficers";
import { AllianceClass } from "../../shared/models/ogame/classes/AllianceClass";
import { BuildingType, MoonBuildingType, PlanetBuildingType } from "../../shared/models/ogame/buildings/BuildingType";
import { BasicPlanetData, PlanetDataWrapper, PlanetDefenseCounts } from "../../shared/messages/tracking/empire";
import { parseIntSafe } from "../../shared/utils/parseNumbers";
import { ShipType } from "../../shared/models/ogame/ships/ShipType";
import { PlayerClass } from "../../shared/models/ogame/classes/PlayerClass";
import { ResearchType } from "../../shared/models/ogame/research/ResearchType";
import { ProductionSettings } from "../../shared/models/empire/ProductionSettings";
import { PlanetActiveItems } from "../../shared/models/empire/PlanetActiveItems";
import { getPlayerDatabase } from "../../shared/db/access";
import { DbDefenseAmounts, DbMoonBuildingLevels, DbPlanetBuildingLevels, DbPlanetLifeformBuildingLevels, DbPlanetLifeformTechnologyLevels, DbPlayerResearchLevels, DbShipAmounts } from "@/shared/db/schema/player";
import { LifeformBuildingType, LifeformBuildingTypes } from "@/shared/models/ogame/lifeforms/LifeformBuildingType";
import { LifeformTechnologyType, LifeformTechnologyTypes } from "@/shared/models/ogame/lifeforms/LifeformTechnologyType";
import { LifeformType } from "@/shared/models/ogame/lifeforms/LifeformType";
import { createRecord } from "@/shared/utils/createRecord";

export class EmpireModule {
    public async updateOfficers(meta: MessageOgameMeta, data: PlayerOfficers): Promise<void> {
        const db = await getPlayerDatabase(meta);
        await db.put('empire', data, 'officers');
    }

    public async updateAlliance(meta: MessageOgameMeta, data: AllianceClass) {
        const db = await getPlayerDatabase(meta);
        await db.put('empire', data, 'allianceClass');
    }

    public async updateActiveItems(meta: MessageOgameMeta, data: PlanetDataWrapper<PlanetActiveItems>) {
        const db = await getPlayerDatabase(meta);
        const key: (`moon.${number}.activeItems` | `planet.${number}.activeItems`) = `${data.isMoon ? 'moon' : 'planet'}.${data.planetId}.activeItems`;
        await db.put('empire', data.data, key);
    }

    public async updateBuildingLevels(meta: MessageOgameMeta, data: PlanetDataWrapper<Partial<Record<BuildingType, number>>>) {
        const db = await getPlayerDatabase(meta);
        const tx = db.transaction('empire', 'readwrite');
        const store = tx.objectStore('empire');

        if (data.isMoon) {
            const key: `moon.${number}.buildings` = `moon.${data.planetId}.buildings`;
            const storedLevels = (await store.get(key)) as DbMoonBuildingLevels | undefined;
            const newLevels = { ...storedLevels };
            Object.keys(data.data)
                .map(key => parseIntSafe(key, 10) as MoonBuildingType)
                .forEach(key => newLevels[key] = data.data[key] ?? newLevels[key] ?? 0);

            await db.put('empire', newLevels as DbMoonBuildingLevels, key);
        }
        else {
            const key: `planet.${number}.buildings` = `planet.${data.planetId}.buildings`;
            const storedLevels = (await store.get(key)) as DbPlanetBuildingLevels | undefined;
            const newLevels = { ...storedLevels };
            Object.keys(data.data)
                .map(key => parseIntSafe(key, 10) as PlanetBuildingType)
                .forEach(key => newLevels[key] = data.data[key] ?? newLevels[key] ?? 0);

            await db.put('empire', newLevels as DbPlanetBuildingLevels, key);
        }
        
        await tx.done;
    }

    public async updateBasicPlanets(meta: MessageOgameMeta, data: BasicPlanetData[]) {
        const db = await getPlayerDatabase(meta);
        const tx = db.transaction('empire', 'readwrite');
        const store = tx.objectStore('empire');

        // save order
        const order = data.map(p => p.id);
        await store.put(order, 'planetOrder');

        // save basic data
        for (const planetOrMoon of data) {
            if (planetOrMoon.isMoon) {
                await store.put(planetOrMoon, `moon.${planetOrMoon.id}`);
            }
            else {
                await store.put(planetOrMoon, `planet.${planetOrMoon.id}`);
            }
        }

        // remove moons and planets which don't exist anymore
        const allKeys = await store.getAllKeys();
        const removeKeys = allKeys
            .filter(key => key.startsWith('moon.') || key.startsWith('planet.'))
            .filter(key => {
                const match = key.match(/^(planet|moon)\.(?<id>\d+)(\.|$)/);
                const idString = match?.groups?.id ?? _throw('no match');
                const id = parseIntSafe(idString, 10);

                return !data.some(d => d.id == id);
            });
        for (const removeKey of removeKeys) {
            await store.delete(removeKey);
        }


        await tx.done;
    }

    public async updatePlanetDefenses(meta: MessageOgameMeta, data: PlanetDataWrapper<PlanetDefenseCounts>) {
        const db = await getPlayerDatabase(meta);
        const key: (`planet.${number}.defenses` | `moon.${number}.defenses`) = `${data.isMoon ? 'moon' : 'planet'}.${data.planetId}.defenses`;
        const amounts: DbDefenseAmounts = data.data;
        await db.put('empire', amounts, key);
    }

    public async updatePlanetShips(meta: MessageOgameMeta, data: PlanetDataWrapper<Partial<Record<ShipType, number>>>) {
        const db = await getPlayerDatabase(meta);
        const tx = db.transaction('empire', 'readwrite');
        const store = tx.objectStore('empire');

        const key: (`planet.${number}.ships` | `moon.${number}.ships`) = `${data.isMoon ? 'moon' : 'planet'}.${data.planetId}.ships`;

        const storedAmounts = (await store.get(key)) as DbShipAmounts | undefined;
        const newAmounts = { ...storedAmounts };
        Object.keys(data.data)
            .map(key => parseIntSafe(key, 10) as ShipType)
            .forEach(key => newAmounts[key] = data.data[key] ?? newAmounts[key] ?? 0);

        await store.put(newAmounts as DbShipAmounts, key);
        await tx.done;
    }

    public async updatePlayerClass(meta: MessageOgameMeta, data: PlayerClass) {
        const db = await getPlayerDatabase(meta);
        await db.put('empire', data, 'playerClass');
    }

    public async updateResearchLevels(meta: MessageOgameMeta, researchLevels: Partial<Record<ResearchType, number>>) {
        const db = await getPlayerDatabase(meta);
        const tx = db.transaction('empire', 'readwrite');
        const store = tx.objectStore('empire');

        const storedLevels = (await store.get('research')) as DbPlayerResearchLevels | undefined;
        const newLevels = { ...storedLevels };
        Object.keys(researchLevels)
            .map(key => parseIntSafe(key, 10) as ResearchType)
            .forEach(key => newLevels[key] = researchLevels[key] ?? newLevels[key] ?? 0);

        await store.put(newLevels as DbPlayerResearchLevels, 'research');
        await tx.done;
    }

    public async updateProductionSettings(meta: MessageOgameMeta, data: PlanetDataWrapper<ProductionSettings>) {
        if(data.isMoon) {
            return;
        }

        const db = await getPlayerDatabase(meta);
        const key: `planet.${number}.productionSettings` = `planet.${data.planetId}.productionSettings`;
        await db.put('empire', data.data, key);
    }

    
    public async updateSelectedLifeform(meta: MessageOgameMeta, data: PlanetDataWrapper<LifeformType>) {
        if(data.isMoon) {
            return;
        }

        const db = await getPlayerDatabase(meta);
        await db.put('empire', data.data, `planet.${data.planetId}.lifeform`);
    }

    public async updatePlanetLifeformBuildings(meta: MessageOgameMeta, data: PlanetDataWrapper<Partial<Record<LifeformBuildingType, number>>>) {
        if(data.isMoon) {
            return;
        }

        const db = await getPlayerDatabase(meta);
        const tx = db.transaction('empire', 'readwrite');
        const store = tx.objectStore('empire');

        const key: `planet.${number}.lifeformBuildings` = `planet.${data.planetId}.lifeformBuildings`;
        const storedLevels = (await store.get(key)) as DbPlanetLifeformBuildingLevels | undefined;
        const newLevels: DbPlanetLifeformBuildingLevels = { 
            ...createRecord(LifeformBuildingTypes, 0),
            ...storedLevels,
         };
        Object.keys(data.data)
            .map(key => parseIntSafe(key, 10) as LifeformBuildingType)
            .forEach(key => newLevels[key] = data.data[key] ?? newLevels[key] ?? 0);

        await db.put('empire', newLevels, key);
        
        await tx.done;
    }

    public async updatePlanetActiveLifeformTechnologies(meta: MessageOgameMeta, data: PlanetDataWrapper<Partial<Record<LifeformTechnologyType, number>>>) {
        if(data.isMoon) {
            return;
        }

        await this.updatePlanetLifeformTechnologies(meta, data);
        
        const db = await getPlayerDatabase(meta);
        const activeTechs: LifeformTechnologyType[] = Object.keys(data.data).map(tech => parseIntSafe(tech, 10) as LifeformTechnologyType);
        await db.put('empire', activeTechs, `planet.${data.planetId}.activeLifeformTechnologies`);
    }

    public async updatePlanetLifeformTechnologies(meta: MessageOgameMeta, data: PlanetDataWrapper<Partial<Record<LifeformTechnologyType, number>>>) {
        if(data.isMoon) {
            return;
        }

        const db = await getPlayerDatabase(meta);
        const tx = db.transaction('empire', 'readwrite');
        const store = tx.objectStore('empire');

        const key: `planet.${number}.lifeformTechnologies` = `planet.${data.planetId}.lifeformTechnologies`;
        const storedLevels = (await store.get(key)) as DbPlanetLifeformTechnologyLevels | undefined;
        const newLevels: DbPlanetLifeformTechnologyLevels = { 
            ...createRecord(LifeformTechnologyTypes, 0),
            ...storedLevels,
         };
        Object.keys(data.data)
            .map(key => parseIntSafe(key, 10) as LifeformTechnologyType)
            .forEach(key => newLevels[key] = data.data[key] ?? newLevels[key] ?? 0);

        await db.put('empire', newLevels, key);
        
        await tx.done;
    }
}


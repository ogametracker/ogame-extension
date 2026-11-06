import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { createReadiness, listenForMessages } from './lifecycle';
import type { LocalPlayerData } from '@ogame-tracker/shared/models/empire/LocalPlayerData';
import { MessageType } from '@ogame-tracker/shared/messages/MessageType';
import type { Message } from '@ogame-tracker/shared/messages/Message';
import { GlobalOgameMetaData } from './global';
import { ogameMetasEqual } from '@ogame-tracker/shared/ogame-web/ogameMetasEqual';
import { getPlayerDatabase } from '@ogame-tracker/shared/db/access';
import { AllianceClass } from '@ogame-tracker/shared/models/ogame/classes/AllianceClass';
import { PlayerClass } from '@ogame-tracker/shared/models/ogame/classes/PlayerClass';
import type { PlayerOfficers } from '@ogame-tracker/shared/models/empire/PlayerOfficers';
import type { ResearchLevels } from '@ogame-tracker/shared/models/empire/ResearchLevels';
import { ResearchTypes } from '@ogame-tracker/shared/models/ogame/research/ResearchTypes';
import type { PlanetData } from '@ogame-tracker/shared/models/empire/PlanetData';
import type { MoonData } from '@ogame-tracker/shared/models/empire/MoonData';
import type {
    DbActiveItems,
    DbBasicMoonData,
    DbBasicPlanetData,
    DbDefenseAmounts,
    DbFleets,
    DbMissileAmounts,
    DbMoonBuildingLevels,
    DbPlanetBuildingLevels,
    DbPlanetLifeformBuildingLevels,
    DbPlanetLifeformTechnologyLevels,
    DbPlanetProductionSettings,
    DbPlayerLifeformExperience,
    DbShipAmounts,
} from '@ogame-tracker/shared/db/schema/player';
import { _throw } from '@ogame-tracker/shared/utils/_throw';
import { BuildingType } from '@ogame-tracker/shared/models/ogame/buildings/BuildingType';
import { MoonBuildingTypes, PlanetBuildingTypes } from '@ogame-tracker/shared/models/ogame/buildings/BuildingTypes';
import { ShipType } from '@ogame-tracker/shared/models/ogame/ships/ShipType';
import { ShipTypes } from '@ogame-tracker/shared/models/ogame/ships/ShipTypes';
import { DefenseType } from '@ogame-tracker/shared/models/ogame/defenses/DefenseType';
import { DefenseTypes } from '@ogame-tracker/shared/models/ogame/defenses/DefenseTypes';
import type { ProductionSettings } from '@ogame-tracker/shared/models/empire/ProductionSettings';
import { Lock } from 'semaphore-async-await';
import { delay } from '@ogame-tracker/shared/utils/delay';
import { createRecord } from '@ogame-tracker/shared/utils/createRecord';
import { LifeformBuildingTypes } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBuildingType';
import {
    LifeformTechnologyType,
    LifeformTechnologyTypes,
} from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformTechnologyType';
import { LifeformType, ValidLifeformTypes } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import { useLifeformDiscoveryStore } from './LifeformDiscoveryDataModule';
import { MissileTypes } from '@ogame-tracker/shared/models/ogame/missiles/MissileTypes';

export const useEmpireStore = defineStore('empire', () => {
    const { ready, resolveReady, rejectReady } = createReadiness();

    const empire = ref<LocalPlayerData>(null!);

    let loading = 0;

    const lock = new Lock();

    const lifeformExperience = computed(() => {
        const missionProgress = useLifeformDiscoveryStore().lifeforms;

        return createRecord(ValidLifeformTypes, lf =>
            Math.max(empire.value.lifeformExperience[lf], missionProgress[lf].gainedExperience),
        );
    });

    async function initialize() {
        initCommunication();
        await loadData();
    }

    function initCommunication() {
        listenForMessages(onMessage);
    }

    async function loadData() {
        loading++;
        if (loading > 1) {
            return;
        }

        await lock.acquire();
        await delay(200); // delay a bit because OGame empire view will cause many updates

        const db = await getPlayerDatabase(GlobalOgameMetaData);
        const tx = db.transaction('empire', 'readonly');
        const store = tx.objectStore('empire');

        const allianceClass = ((await store.get('allianceClass')) as AllianceClass | undefined) ?? AllianceClass.none;
        const playerClass = ((await store.get('playerClass')) as PlayerClass | undefined) ?? PlayerClass.none;
        const officers = ((await store.get('officers')) as PlayerOfficers | undefined) ?? {
            admiral: false,
            commander: false,
            engineer: false,
            geologist: false,
            technocrat: false,
        };
        const research =
            ((await store.get('research')) as ResearchLevels | undefined) ?? createRecord(ResearchTypes, 0);
        const planetOrder = ((await store.get('planetOrder')) as number[] | undefined) ?? [];
        const lifeformExperience =
            ((await store.get('lifeformExperience')) as DbPlayerLifeformExperience | undefined) ??
            createRecord(ValidLifeformTypes, 0);

        const planets: Record<number, PlanetData | MoonData> = {};
        const allKeys = await store.getAllKeys();
        for (const id of planetOrder) {
            const isMoon = allKeys.includes(`moon.${id}`);
            if (!isMoon && !allKeys.includes(`planet.${id}`)) {
                throw new Error('something went wrong here, id for planet found but no planet data known');
            }

            if (isMoon) {
                const basicInfo =
                    ((await store.get(`moon.${id}`)) as DbBasicMoonData) ?? _throw('no basic moon data found');
                const buildings =
                    ((await store.get(`moon.${id}.buildings`)) as DbMoonBuildingLevels | undefined) ??
                    createRecord(MoonBuildingTypes, 0);
                const ships =
                    ((await store.get(`moon.${id}.ships`)) as DbShipAmounts | undefined) ?? createRecord(ShipTypes, 0);
                const defense: DbDefenseAmounts = ((await store.get(`moon.${id}.defenses`)) as
                    | DbDefenseAmounts
                    | undefined) ?? {
                    ...createRecord(DefenseTypes, 0),
                    [DefenseType.smallShieldDome]: false,
                    [DefenseType.largeShieldDome]: false,
                };
                const activeItems = ((await store.get(`moon.${id}.activeItems`)) as DbActiveItems | undefined) ?? {};

                const moonData: MoonData = {
                    isMoon: true,
                    ...basicInfo,
                    buildings,
                    ships,
                    defense,
                    activeItems,
                };
                planets[id] = moonData;
            } else {
                const basicInfo =
                    ((await store.get(`planet.${id}`)) as DbBasicPlanetData) ?? _throw('no basic planet data found');
                const buildings =
                    ((await store.get(`planet.${id}.buildings`)) as DbPlanetBuildingLevels | undefined) ??
                    createRecord(PlanetBuildingTypes, 0);
                const ships =
                    ((await store.get(`planet.${id}.ships`)) as DbShipAmounts | undefined) ??
                    createRecord(ShipTypes, 0);
                const defense: DbDefenseAmounts = ((await store.get(`planet.${id}.defenses`)) as
                    | DbDefenseAmounts
                    | undefined) ?? {
                    ...createRecord(DefenseTypes, 0),
                    [DefenseType.smallShieldDome]: false,
                    [DefenseType.largeShieldDome]: false,
                };
                const missiles =
                    ((await store.get(`planet.${id}.missiles`)) as DbMissileAmounts | undefined) ??
                    createRecord(MissileTypes, 0);
                const activeItems = ((await store.get(`planet.${id}.activeItems`)) as DbActiveItems | undefined) ?? {};
                const productionSettings = (((await store.get(`planet.${id}.productionSettings`)) as
                    | DbPlanetProductionSettings
                    | undefined) ?? {
                    [BuildingType.metalMine]: 100,
                    [BuildingType.crystalMine]: 100,
                    [BuildingType.deuteriumSynthesizer]: 100,
                    [BuildingType.solarPlant]: 100,
                    [BuildingType.fusionReactor]: 100,
                    [ShipType.solarSatellite]: 100,
                    [ShipType.crawler]: playerClass == PlayerClass.collector ? 150 : 100,
                }) as ProductionSettings;

                const activeLifeform =
                    ((await store.get(`planet.${id}.lifeform`)) as LifeformType | undefined) ?? LifeformType.none;
                const lifeformBuildings =
                    ((await store.get(`planet.${id}.lifeformBuildings`)) as
                        | DbPlanetLifeformBuildingLevels
                        | undefined) ?? createRecord(LifeformBuildingTypes, 0);
                const lifeformTechnologies =
                    ((await store.get(`planet.${id}.lifeformTechnologies`)) as
                        | DbPlanetLifeformTechnologyLevels
                        | undefined) ?? createRecord(LifeformTechnologyTypes, 0);
                const activeLifeformTechnologies =
                    ((await store.get(`planet.${id}.activeLifeformTechnologies`)) as
                        | LifeformTechnologyType[]
                        | undefined) ?? [];

                const planetData: PlanetData = {
                    isMoon: false,
                    ...basicInfo,
                    buildings,
                    ships,
                    defense,
                    missiles,
                    activeItems,
                    productionSettings,

                    activeLifeform,
                    lifeformBuildings,
                    lifeformTechnologies,
                    activeLifeformTechnologies,
                };
                planets[id] = planetData;
            }
        }

        const fleets = ((await store.get('fleets')) as DbFleets | undefined) ?? [];
        empire.value = {
            allianceClass,
            playerClass,
            officers,
            research,
            planetOrder,
            planets,
            lifeformExperience,
            fleets,
        };

        resolveReady();
        loading = 0;
        lock.release();
    }

    async function onMessage(msg: Message) {
        const { type, ogameMeta } = msg;
        if (!ogameMetasEqual(ogameMeta, GlobalOgameMetaData)) {
            return;
        }

        switch (type) {
            case MessageType.NotifyEmpireDataUpdate: {
                await loadData();
                break;
            }
        }
    }

    async function clear(): Promise<void> {
        const db = await getPlayerDatabase(GlobalOgameMetaData);
        await db.clear('empire');
    }

    void initialize().catch(rejectReady);

    return {
        ready,
        empire,
        lifeformExperience,
        clear,
    };
});

import { LocalPlayerData } from '@/shared/models/empire/LocalPlayerData';
import { MessageType } from '@/shared/messages/MessageType';
import { Message } from '@/shared/messages/Message';
import { GlobalOgameMetaData } from './global';
import { Component, Vue } from 'vue-property-decorator';
import { ogameMetasEqual } from '@/shared/ogame-web/ogameMetasEqual';
import { getPlayerDatabase } from "@/shared/db/access";
import { AllianceClass } from '@/shared/models/ogame/classes/AllianceClass';
import { PlayerClass } from '@/shared/models/ogame/classes/PlayerClass';
import { PlayerOfficers } from '@/shared/models/empire/PlayerOfficers';
import { ResearchLevels } from '@/shared/models/empire/ResearchLevels';
import { ResearchTypes } from '@/shared/models/ogame/research/ResearchTypes';
import { PlanetData } from '@/shared/models/empire/PlanetData';
import { MoonData } from '@/shared/models/empire/MoonData';
import { DbActiveItems, DbBasicMoonData, DbBasicPlanetData, DbDefenseAmounts, DbMoonBuildingLevels, DbPlanetBuildingLevels, DbPlanetLifeformBuildingLevels, DbPlanetLifeformTechnologyLevels, DbPlanetProductionSettings, DbPlayerLifeformExperience, DbShipAmounts } from '@/shared/db/schema/player';
import { _throw } from '@/shared/utils/_throw';
import { BuildingType } from '@/shared/models/ogame/buildings/BuildingType';
import { MoonBuildingTypes, PlanetBuildingTypes } from '@/shared/models/ogame/buildings/BuildingTypes';
import { ShipType, ShipTypes } from '@/shared/models/ogame/ships/ShipType';
import { DefenseType, DefenseTypes } from '@/shared/models/ogame/defenses/DefenseType';
import { ProductionSettings } from '@/shared/models/empire/ProductionSettings';
import { Lock } from 'semaphore-async-await';
import { delay } from '@/shared/utils/delay';
import { createRecord } from '@/shared/utils/createRecord';
import { LifeformBuildingTypes } from '@/shared/models/ogame/lifeforms/LifeformBuildingType';
import { LifeformTechnologyType, LifeformTechnologyTypes } from '@/shared/models/ogame/lifeforms/LifeformTechnologyType';
import { LifeformType, ValidLifeformTypes } from '@/shared/models/ogame/lifeforms/LifeformType';
import { LifeformDiscoveryDataModule } from './LifeformDiscoveryDataModule';

@Component
class EmpireDataModuleClass extends Vue {
    public empire: LocalPlayerData = null!;

    private _ready!: Promise<void>;
    private _resolveReady!: () => void;
    private loading = 0;
    private lock = new Lock();

    public get ready(): Promise<void> {
        return this._ready;
    }

    public get lifeformExperience() {
        const missionProgress = LifeformDiscoveryDataModule.lifeforms;
        
        return createRecord(
            ValidLifeformTypes,
            lf => Math.max(this.empire.lifeformExperience[lf], missionProgress[lf].gainedExperience),
        );
    }

    private async created() {
        this._ready = new Promise<void>(resolve => this._resolveReady = resolve);

        this.initCommunication();
        await this.loadData();
    }

    private initCommunication() {
        chrome.runtime.onMessage.addListener(async message => await this.onMessage(message));
    }

    private async loadData() {
        this.loading++;
        if (this.loading > 1) {
            return;
        }

        await this.lock.acquire();
        await delay(200); // delay a bit because OGame empire view will cause many updates

        const db = await getPlayerDatabase(GlobalOgameMetaData);
        const tx = db.transaction('empire', 'readonly');
        const store = tx.objectStore('empire');

        const allianceClass = (await store.get('allianceClass')) as AllianceClass | undefined ?? AllianceClass.none;
        const playerClass = (await store.get('playerClass')) as PlayerClass | undefined ?? PlayerClass.none;
        const officers = (await store.get('officers')) as PlayerOfficers | undefined ?? {
            admiral: false,
            commander: false,
            engineer: false,
            geologist: false,
            technocrat: false,
        };
        const research = (await store.get('research')) as ResearchLevels | undefined ?? createRecord(ResearchTypes, 0);
        const planetOrder = (await store.get('planetOrder')) as number[] | undefined ?? [];
        const lifeformExperience = (await store.get('lifeformExperience')) as DbPlayerLifeformExperience | undefined
            ?? createRecord(ValidLifeformTypes, 0);

        const planets: Record<number, PlanetData | MoonData> = {};
        const allKeys = await store.getAllKeys();
        for (const id of planetOrder) {
            const isMoon = allKeys.includes(`moon.${id}`);
            if (!isMoon && !allKeys.includes(`planet.${id}`)) {
                throw new Error('something went wrong here, id for planet found but no planet data known');
            }

            if (isMoon) {
                const basicInfo = (await store.get(`moon.${id}`)) as DbBasicMoonData ?? _throw('no basic moon data found');
                const buildings = (await store.get(`moon.${id}.buildings`)) as DbMoonBuildingLevels | undefined ?? createRecord(MoonBuildingTypes, 0);
                const ships = (await store.get(`moon.${id}.ships`)) as DbShipAmounts | undefined ?? createRecord(ShipTypes, 0);
                const defense: DbDefenseAmounts = (await store.get(`moon.${id}.defenses`)) as DbDefenseAmounts | undefined ?? {
                    ...createRecord(DefenseTypes, 0),
                    [DefenseType.smallShieldDome]: false,
                    [DefenseType.largeShieldDome]: false,
                };
                const activeItems = (await store.get(`moon.${id}.activeItems`) as DbActiveItems | undefined) ?? {};

                const moonData: MoonData = {
                    isMoon: true,
                    ...basicInfo,
                    buildings,
                    ships,
                    defense,
                    activeItems,
                };
                planets[id] = moonData;
            }
            else {
                const basicInfo = (await store.get(`planet.${id}`)) as DbBasicPlanetData ?? _throw('no basic planet data found');
                const buildings = (await store.get(`planet.${id}.buildings`)) as DbPlanetBuildingLevels | undefined ?? createRecord(PlanetBuildingTypes, 0);
                const ships = (await store.get(`planet.${id}.ships`)) as DbShipAmounts | undefined ?? createRecord(ShipTypes, 0);
                const defense: DbDefenseAmounts = (await store.get(`planet.${id}.defenses`)) as DbDefenseAmounts | undefined ?? {
                    ...createRecord(DefenseTypes, 0),
                    [DefenseType.smallShieldDome]: false,
                    [DefenseType.largeShieldDome]: false,
                };
                const activeItems = (await store.get(`planet.${id}.activeItems`) as DbActiveItems | undefined) ?? {};
                const productionSettings = ((await store.get(`planet.${id}.productionSettings`)) as DbPlanetProductionSettings | undefined ?? {
                    [BuildingType.metalMine]: 100,
                    [BuildingType.crystalMine]: 100,
                    [BuildingType.deuteriumSynthesizer]: 100,
                    [BuildingType.solarPlant]: 100,
                    [BuildingType.fusionReactor]: 100,
                    [ShipType.solarSatellite]: 100,
                    [ShipType.crawler]: playerClass == PlayerClass.collector ? 150 : 100,
                }) as ProductionSettings;


                const activeLifeform = (await store.get(`planet.${id}.lifeform`)) as LifeformType | undefined ?? LifeformType.none;
                const lifeformBuildings = (await store.get(`planet.${id}.lifeformBuildings`)) as DbPlanetLifeformBuildingLevels | undefined ?? createRecord(LifeformBuildingTypes, 0);
                const lifeformTechnologies = (await store.get(`planet.${id}.lifeformTechnologies`)) as DbPlanetLifeformTechnologyLevels | undefined ?? createRecord(LifeformTechnologyTypes, 0);
                const activeLifeformTechnologies = (await store.get(`planet.${id}.activeLifeformTechnologies`)) as LifeformTechnologyType[] | undefined ?? [];

                const planetData: PlanetData = {
                    isMoon: false,
                    ...basicInfo,
                    buildings,
                    ships,
                    defense,
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

        this.empire = {
            allianceClass,
            playerClass,
            officers,
            research,
            planetOrder,
            planets,
            lifeformExperience,
        };

        this._resolveReady();
        this.loading = 0;
        this.lock.release();
    }

    private async onMessage(msg: Message) {
        const { type, ogameMeta } = msg;
        if (!ogameMetasEqual(ogameMeta, GlobalOgameMetaData)) {
            return;
        }

        switch (type) {
            case MessageType.NotifyEmpireDataUpdate: {
                await this.loadData();
                break;
            }
        }
    }

    public async clear(): Promise<void> {
        const db = await getPlayerDatabase(GlobalOgameMetaData);
        await db.clear('empire');
    }
}

export const EmpireDataModule = new EmpireDataModuleClass();
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
import { ResearchType } from '@/shared/models/ogame/research/ResearchType';
import { PlanetData } from '@/shared/models/empire/PlanetData';
import { MoonData } from '@/shared/models/empire/MoonData';
import { DbActiveItems, DbBasicMoonData, DbBasicPlanetData, DbDefenseAmounts, DbMoonBuildingLevels, DbPlanetBuildingLevels, DbPlanetProductionSettings, DbShipAmounts } from '@/shared/db/schema/player';
import { _throw } from '@/shared/utils/_throw';
import { BuildingType } from '@/shared/models/ogame/buildings/BuildingType';
import { ShipType } from '@/shared/models/ogame/ships/ShipType';
import { DefenseType } from '@/shared/models/ogame/defenses/DefenseType';
import { ProductionSettings } from '@/shared/models/empire/ProductionSettings';

@Component
class EmpireDataModuleClass extends Vue {
    public empire: LocalPlayerData | null = null;

    private _ready!: Promise<void>;
    private _resolveReady!: () => void;

    public get ready(): Promise<void> {
        return this._ready;
    }

    private async created() {
        this._ready = new Promise<void>(resolve => this._resolveReady = resolve);

        this.initCommunication();
        await this.loadData();
    }

    private initCommunication() {
        console.log('connecting to background service');

        chrome.runtime.onMessage.addListener(async message => await this.onMessage(message));
    }

    private async loadData() {
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
        const research = (await store.get('research')) as ResearchLevels | undefined ?? {
            [ResearchType.espionageTechnology]: 0,
            [ResearchType.computerTechnology]: 0,
            [ResearchType.weaponsTechnology]: 0,
            [ResearchType.shieldingTechnology]: 0,
            [ResearchType.armorTechnology]: 0,
            [ResearchType.energyTechnology]: 0,
            [ResearchType.hyperspaceTechnology]: 0,
            [ResearchType.combustionDrive]: 0,
            [ResearchType.impulseDrive]: 0,
            [ResearchType.hyperspaceDrive]: 0,
            [ResearchType.laserTechnology]: 0,
            [ResearchType.ionTechnology]: 0,
            [ResearchType.plasmaTechnology]: 0,
            [ResearchType.intergalacticResearchNetwork]: 0,
            [ResearchType.astrophysics]: 0,
            [ResearchType.gravitonTechnology]: 0,
        };
        const planetOrder = (await store.get('planetOrder')) as number[] | undefined ?? [];

        const planets: Record<number, PlanetData | MoonData> = {};
        const allKeys = await store.getAllKeys();
        for (const id of planetOrder) {
            const isMoon = allKeys.includes(`moon.${id}`);
            if (!isMoon && !allKeys.includes(`planet.${id}`)) {
                throw new Error('something went wrong here, id for planet found but no planet data known');
            }

            if (isMoon) {
                const basicInfo = (await store.get(`moon.${id}`)) as DbBasicMoonData ?? _throw('no basic moon data found');
                const buildings = (await store.get(`moon.${id}.buildings`)) as DbMoonBuildingLevels | undefined ?? {
                    [BuildingType.metalStorage]: 0,
                    [BuildingType.crystalStorage]: 0,
                    [BuildingType.deuteriumTank]: 0,
                    [BuildingType.roboticsFactory]: 0,
                    [BuildingType.shipyard]: 0,
                    [BuildingType.lunarBase]: 0,
                    [BuildingType.sensorPhalanx]: 0,
                    [BuildingType.jumpGate]: 0,
                };
                const ships = (await store.get(`moon.${id}.ships`)) as DbShipAmounts | undefined ?? {
                    [ShipType.smallCargo]: 0,
                    [ShipType.largeCargo]: 0,
                    [ShipType.lightFighter]: 0,
                    [ShipType.heavyFighter]: 0,
                    [ShipType.cruiser]: 0,
                    [ShipType.battleship]: 0,
                    [ShipType.colonyShip]: 0,
                    [ShipType.recycler]: 0,
                    [ShipType.espionageProbe]: 0,
                    [ShipType.bomber]: 0,
                    [ShipType.solarSatellite]: 0,
                    [ShipType.destroyer]: 0,
                    [ShipType.deathStar]: 0,
                    [ShipType.battlecruiser]: 0,
                    [ShipType.crawler]: 0,
                    [ShipType.reaper]: 0,
                    [ShipType.pathfinder]: 0,
                };
                const defense: DbDefenseAmounts = (await store.get(`moon.${id}.defenses`)) as DbDefenseAmounts | undefined ?? {
                    [DefenseType.rocketLauncher]: 0,
                    [DefenseType.lightLaser]: 0,
                    [DefenseType.heavyLaser]: 0,
                    [DefenseType.gaussCannon]: 0,
                    [DefenseType.ionCannon]: 0,
                    [DefenseType.plasmaTurret]: 0,
                    [DefenseType.smallShieldDome]: false,
                    [DefenseType.largeShieldDome]: false,
                
                    [DefenseType.ballisticMissile]: 0,
                    [DefenseType.interplanetaryMissile]: 0,
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
                const buildings = (await store.get(`planet.${id}.buildings`)) as DbPlanetBuildingLevels | undefined ?? {
                    [BuildingType.metalMine]: 0,
                    [BuildingType.crystalMine]: 0,
                    [BuildingType.deuteriumSynthesizer]: 0,
                    [BuildingType.metalStorage]: 0,
                    [BuildingType.crystalStorage]: 0,
                    [BuildingType.deuteriumTank]: 0,
                    [BuildingType.solarPlant]: 0,
                    [BuildingType.fusionReactor]: 0,
                
                    [BuildingType.roboticsFactory]: 0,
                    [BuildingType.shipyard]: 0,
                    [BuildingType.researchLab]: 0,
                    [BuildingType.allianceDepot]: 0,
                    [BuildingType.missileSilo]: 0,
                    [BuildingType.naniteFactory]: 0,
                    [BuildingType.terraformer]: 0,
                    [BuildingType.spaceDock]: 0,
                };
                const ships = (await store.get(`planet.${id}.ships`)) as DbShipAmounts | undefined ?? {
                    [ShipType.smallCargo]: 0,
                    [ShipType.largeCargo]: 0,
                    [ShipType.lightFighter]: 0,
                    [ShipType.heavyFighter]: 0,
                    [ShipType.cruiser]: 0,
                    [ShipType.battleship]: 0,
                    [ShipType.colonyShip]: 0,
                    [ShipType.recycler]: 0,
                    [ShipType.espionageProbe]: 0,
                    [ShipType.bomber]: 0,
                    [ShipType.solarSatellite]: 0,
                    [ShipType.destroyer]: 0,
                    [ShipType.deathStar]: 0,
                    [ShipType.battlecruiser]: 0,
                    [ShipType.crawler]: 0,
                    [ShipType.reaper]: 0,
                    [ShipType.pathfinder]: 0,
                };
                const defense: DbDefenseAmounts = (await store.get(`planet.${id}.defenses`)) as DbDefenseAmounts | undefined ?? {
                    [DefenseType.rocketLauncher]: 0,
                    [DefenseType.lightLaser]: 0,
                    [DefenseType.heavyLaser]: 0,
                    [DefenseType.gaussCannon]: 0,
                    [DefenseType.ionCannon]: 0,
                    [DefenseType.plasmaTurret]: 0,
                    [DefenseType.smallShieldDome]: false,
                    [DefenseType.largeShieldDome]: false,
                
                    [DefenseType.ballisticMissile]: 0,
                    [DefenseType.interplanetaryMissile]: 0,
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

                const planetData: PlanetData = {
                    isMoon: false,
                    ...basicInfo,
                    buildings,
                    ships,
                    defense,
                    activeItems,
                    productionSettings,
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
        };

        this._resolveReady();
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
}

export const EmpireDataModule = new EmpireDataModuleClass();
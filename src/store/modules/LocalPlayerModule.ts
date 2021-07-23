import OgameMetaData from "@/models/ogame/OgameMetaData";
import asyncChromeStorage from "@/utils/asyncChromeStorage";
import Vue from "vue";
import Component from "vue-class-component";

export interface PlanetDataBase {
    id: number;

    defense?: DefenseCount;
}

export interface PlanetData extends PlanetDataBase {
    isMoon: false;
    buildings: PlanetBuildingLevels;
    ships?: PlanetShipCount;
}

export interface MoonData extends PlanetDataBase {
    isMoon: true;
    buildings: MoonBuildingLevels;
    ships?: MoonShipCount;
}


export interface PlanetBuildingLevels {
    production?: {
        metalMine: number;
        crystalMine: number;
        deuteriumSynthesizer: number;

        metalStorage: number;
        crystalStorage: number;
        deuteriumTank: number;

        solarPlant: number;
        fusionReactor: number;
    };

    facilities?: {
        roboticsFactory: number;
        shipyard: number;
        researchLab: number;
        allianceDepot: number;
        missileSilo: number;
        naniteFactory: number;
        terraformer: number;
        spaceDock: number;
    };
}

export interface MoonBuildingLevels {
    production?: {
        metalStorage: number;
        crystalStorage: number;
        deuteriumTank: number;
    };

    facilities?: {
        roboticsFactory: number;
        shipyard: number;

        lunarBase: number;
        sensorPhalanx: number;
        jumpGate: number;
    };
}

export interface ResearchLevels {
    energyTechnology: number;
    laserTechnology: number;
    ionTechnology: number;
    hyperspaceTechnology: number;
    plasmaTechnology: number;

    combustionDrive: number;
    impulseDrive: number;
    hyperspaceDrive: number;

    espionageTechnology: number;
    computerTechnology: number;
    astrophysics: number;
    intergalacticResearchNetwork: number;
    gravitonTechnology: number;

    weaponsTechnology: number;
    shieldingTechnology: number;
    armorTechnology: number;
}

export interface MoonShipCount {
    lightFighter: number;
    heavyFighter: number;
    cruiser: number;
    battleship: number;
    battlecruiser: number;
    bomber: number;
    destroyer: number;
    deathstar: number;
    reaper: number;
    pathfinder: number;

    smallCargo: number;
    largeCargo: number;
    colonyShip: number;
    recycler: number;
    espionageProbe: number;
    solarSatellite: number;
}

export interface PlanetShipCount extends MoonShipCount {
    crawler: number;
}

export interface DefenseCount {
    rocketLauncher: number;
    lightLaser: number;
    heavyLaser: number;
    gaussCannon: number;
    ionCannon: number;
    plasmaTurret: number;
    smallShieldDome: boolean;
    largeShieldDome: boolean;

    ballisticMissile: number;
    interplanetaryMissile: number;
}

export enum PlayerClass {
    collector = 'collector',
    discoverer = 'discoverer',
    general = 'general',
    none = 'none',
}

export enum AllianceClass {
    trader = 'trader',
    researcher = 'researcher',
    warrior = 'warrior',
    none = 'none',
}

export interface LocalPlayerData {
    planets: Record<number, PlanetData | MoonData>;
    research: ResearchLevels | null;
    playerClass: PlayerClass | null;
    allianceClass: PlayerClass | null;
}

@Component({})
class LocalPlayerModule extends Vue {
    private _data: LocalPlayerData = {
        planets: {},
        research: null,
        playerClass: null,
        allianceClass: null,
    };

    private async created() {
        const data = await asyncChromeStorage.get<LocalPlayerData>(this.storageKey);
        if(data != null) {
            this._data = data;
        }
    }

    private get storageKey(): string {
        return `${OgameMetaData.storageKeyPrefix}-local-player`;
    }

    public async save() {
        await asyncChromeStorage.set(this.storageKey, this._data);
    }
}

export default new LocalPlayerModule();
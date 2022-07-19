import { LocalPlayerData } from "../../empire/LocalPlayerData";
import { PlanetData } from "../../empire/PlanetData";
import { ServerSettings } from "../../server-settings/ServerSettings";
import { AllianceClass } from "../classes/AllianceClass";
import { PlayerClass } from "../classes/PlayerClass";
import { ResourceType } from "../resources/ResourceType";
import { AllianceClassTraderProductionBonus, CommandStaffProductionBonus, GeologistProductionBonus, PlasmaTechnologyProductionBonus } from "./constants";

export class ProductionBreakdown {
    #base: number;
    #mine: number;

    #resource: ResourceType;
    #plasmaTechnologyLevel: number;
    #playerClass: PlayerClass;
    #allianceClass: AllianceClass;
    #geologist: boolean;
    #commandStaff: boolean;

    #itemBonus: number;
    #crawlerBonus: number;
    #lifeformBuildingBonus: number;
    #lifeformTechnologyBonus: number;
    #collectorClassBonus: number;

    #serverSettings: {
        collectorProductionFactor: number;
    };

    public constructor(
        base: number,
        mine: number,

        resource: ResourceType,
        plasmaTechnologyLevel: number,
        playerClass: PlayerClass,
        allianceClass: AllianceClass,
        geologist: boolean,
        commandStaff: boolean,

        itemBonus: number,
        crawlerBonus: number,
        lifeformBuildingBonus: number,
        lifeformTechnologyBonus: number,

        collectorClassBonus: number,
        serverSettings: {
            collectorProductionFactor: number,
        },
    ) {
        this.#base = base;
        this.#mine = mine;

        this.#resource = resource;
        this.#plasmaTechnologyLevel = plasmaTechnologyLevel;
        this.#playerClass = playerClass;
        this.#allianceClass = allianceClass;
        this.#geologist = geologist;
        this.#commandStaff = commandStaff;

        this.#itemBonus = itemBonus;
        this.#crawlerBonus = crawlerBonus;
        this.#lifeformBuildingBonus = lifeformBuildingBonus;
        this.#lifeformTechnologyBonus = lifeformTechnologyBonus;
        this.#collectorClassBonus = collectorClassBonus;

        this.#serverSettings = serverSettings;
    }

    public get baseProduction() {
        return this.#base;
    }
    public get mineProduction() {
        return this.#mine;
    }
    public get plasmaTechnologyProduction() {
        return this.#mine * this.#plasmaTechnologyLevel * PlasmaTechnologyProductionBonus[this.#resource];
    }
    public get playerClassProduction() {
        const collectorClassFactor = 1 + this.#collectorClassBonus;
        const collectorFactor = this.#playerClass == PlayerClass.collector ? 1 : 0;
        return collectorFactor
            * this.#mine
            * this.#serverSettings.collectorProductionFactor
            * collectorClassFactor;
    }
    public get allianceClassProduction() {
        const allianceClassFactor = this.#allianceClass == AllianceClass.trader ? 1 : 0;
        return allianceClassFactor * this.#mine * AllianceClassTraderProductionBonus;
    }
    public get geologistProduction() {
        const geologistFactor = this.#geologist ? 1 : 0;
        return geologistFactor * this.#mine * GeologistProductionBonus;
    }
    public get commandStaffProduction() {
        const commandStaffFactor = this.#commandStaff ? 1 : 0;
        return commandStaffFactor * this.#mine * CommandStaffProductionBonus;
    }
    public get itemProduction() {
        return this.#mine * this.#itemBonus;
    }
    public get lifeformBuildingProduction() {
        return this.#mine * this.#lifeformBuildingBonus;
    }
    public get lifeformTechnologyProduction() {
        return this.#mine * this.#lifeformTechnologyBonus;
    }
    public get crawlerProduction() {
        return this.#mine * this.#crawlerBonus;
    }
    public get total() {
        return this.baseProduction
            + this.mineProduction
            + this.plasmaTechnologyProduction
            + this.playerClassProduction
            + this.allianceClassProduction
            + this.geologistProduction
            + this.commandStaffProduction
            + this.itemProduction
            + this.lifeformBuildingProduction
            + this.lifeformTechnologyProduction
            + this.crawlerProduction;
    }

    public set mineProduction(value: number) {
        this.#mine = value;
    }
    public set plasmaTechnologyLevel(value: number) {
        this.#plasmaTechnologyLevel = value;
    }
    public set crawlerBonus(value: number) {
        this.#crawlerBonus = value;
    }
    public set lifeformBuildingBonus(value: number) {
        this.#lifeformBuildingBonus = value;
    }
    public set lifeformTechnologyBonus(value: number) {
        this.#lifeformTechnologyBonus = value;
    }
    public set collectorClassBonus(value: number) {
        this.#collectorClassBonus = value;
    }

    public clone(): ProductionBreakdown {
        return new ProductionBreakdown(
            this.#base,
            this.#mine,

            this.#resource,
            this.#plasmaTechnologyLevel,
            this.#playerClass,
            this.#allianceClass,
            this.#geologist,
            this.#commandStaff,

            this.#itemBonus,
            this.#crawlerBonus,
            this.#lifeformBuildingBonus,
            this.#lifeformTechnologyBonus,

            this.#collectorClassBonus,
            { ...this.#serverSettings },
        );
    }
}

export interface ProductionDependencies {
    planet: PlanetData;
    player: LocalPlayerData;
    serverSettings: ServerSettings;
}
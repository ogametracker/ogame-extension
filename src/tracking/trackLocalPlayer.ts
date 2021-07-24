import Building from "@/models/Building";
import Coordinates, { parseCoordinates } from "@/models/Coordinates";
import PlanetType from "@/models/PlanetType";
import Research from "@/models/Research";
import Ship from "@/models/Ship";
import LocalPlayerModule, { AllianceClass, CrawlerProductionPercentage, LocalPlayerData, MoonBuildingLevels, MoonData, PlanetBuildingLevels, PlanetData, PlayerClass, ProductionPercentage } from "@/store/modules/LocalPlayerModule";
import { QueryParameters } from "@/utils/getQueryParameters";
import _throw from "@/utils/throw";

export async function startLocalPlayerTracking(queryParams: QueryParameters) {
    const data = await LocalPlayerModule.getData();

    if (queryParams.has('page', 'ingame')
        || queryParams.has('page', 'messages')
        || queryParams.has('page', 'chat')
        || queryParams.has('page', 'shop')
        || queryParams.has('page', 'highscore')
        || queryParams.has('page', 'rewards')
        || queryParams.has('page', 'premium')
    ) {
        await trackOwnedPlanets(data);
        await trackOfficers(data);
        await trackPlayerClass(data);
    }

    const currentPlanetId = parseInt((document.querySelector('meta[name="ogame-planet-id"]') as HTMLMetaElement | null)?.content ?? _throw('no planet id meta found'), 10);
    if (queryParams.has('page', 'ingame')) {
        const component = queryParams.get('component');

        switch (component) {
            case 'research': {
                await trackResearch(data);
                break;
            }

            case 'supplies': {
                await trackSupplies(data, currentPlanetId);
                break;
            }

            case 'facilities': {
                await trackFacilities(data, currentPlanetId);
                break;
            }

            case 'shipyard':
            case 'fleetdispatch': {
                await trackShips(data, currentPlanetId);
                break;
            }

            case 'defenses': {
                await trackDefenses(data, currentPlanetId);
                break;
            }

            case 'alliance': {
                await trackAllianceClass(data);
                break;
            }

            case 'overview': {
                await trackActiveItems(data, currentPlanetId);
                break;
            }
        }
    } else if(queryParams.has('page', 'resourceSettings')) {
        await trackProductionPercentages(data, currentPlanetId);
    }

    await LocalPlayerModule.save(data);
}

async function trackOwnedPlanets(playerData: LocalPlayerData) {
    const planetList = document.querySelector('#planetList') ?? _throw('no #planetList found');
    const planets = planetList.querySelectorAll('.smallplanet');

    for (const planet of planets) {
        // planet
        const planetData = getPlanetData(planet);
        const newPlanetData: PlanetData = {
            ...(playerData.planets[planetData.id] as PlanetData | null),
            id: planetData.id,
            coordinates: planetData.coordinates,
            name: planetData.name,
            isMoon: false,
        };
        playerData.planets[planetData.id] = newPlanetData;

        // moon
        const moonData = getMoonData(planet, planetData.coordinates);
        if (moonData != null) {
            const newMoonData: MoonData = {
                ...(playerData.planets[moonData.id] as MoonData | null),
                id: moonData.id,
                coordinates: moonData.coordinates,
                name: moonData.name,
                isMoon: true,
            };
            playerData.planets[moonData.id] = newMoonData;
        }
    }
}

function getPlanetData(planet: Element): PlanetData {
    const id = parseInt(planet.id.split('-')[1], 10);
    const name = planet.querySelector('.planet-name')?.textContent ?? _throw('no planet name found');
    const coords = parseCoordinates(planet.querySelector('.planet-koords')?.textContent ?? _throw('no planet coords found'));

    return {
        id: id,
        isMoon: false,
        coordinates: coords,
        name: name,
    };
}

function getMoonData(planet: Element, coords: Coordinates): MoonData | null {
    const moonlink = planet.querySelector('a.moonlink') as HTMLAnchorElement | null;
    if (moonlink == null) {
        return null;
    }

    const idRegex = /&cp=(?<id>\d+)/;
    const idMatch = moonlink.href.match(idRegex) ?? _throw('no id match');
    const id = parseInt(idMatch.groups!.id.split('-')[1], 10);

    const name = moonlink.querySelector('img')?.alt ?? _throw('no planet name found');

    return {
        id: id,
        isMoon: true,
        coordinates: {
            ...coords,
            type: PlanetType.moon,
        },
        name: name,
    };
}

async function trackOfficers(data: LocalPlayerData) {
    const officersDiv = document.querySelector('#officers') ?? _throw('no #officers elem found');

    const commander = officersDiv.querySelector('.commander')?.classList.contains('on') ?? _throw('no commander found');
    const admiral = officersDiv.querySelector('.admiral')?.classList.contains('on') ?? _throw('no admiral found');
    const engineer = officersDiv.querySelector('.engineer')?.classList.contains('on') ?? _throw('no engineer found');
    const geologist = officersDiv.querySelector('.geologist')?.classList.contains('on') ?? _throw('no geologist found');
    const technocrat = officersDiv.querySelector('.technocrat')?.classList.contains('on') ?? _throw('no technocrat found');

    data.officers = { commander, admiral, engineer, geologist, technocrat };
}

async function trackPlayerClass(data: LocalPlayerData) {
    const playerClassDiv = document.querySelector('#characterclass') ?? _throw('no #characterclass elem found');
    const classDiv = playerClassDiv.querySelector('div.characterclass') ?? _throw('no character class elem found');

    let playerClass = PlayerClass.none;
    if (classDiv.classList.contains('explorer')) {
        playerClass = PlayerClass.discoverer;
    } else if (classDiv.classList.contains('warrior')) {
        playerClass = PlayerClass.general;
    } else if (classDiv.classList.contains('miner')) {
        playerClass = PlayerClass.collector;
    }

    data.playerClass = playerClass;
}

async function trackResearch(data: LocalPlayerData) {
    const energyTechnology = document.querySelector(`[data-technology="${Research.energyTechnology}"] .level`)?.getAttribute('data-value') ?? _throw('no energyTechnology level found');
    const laserTechnology = document.querySelector(`[data-technology="${Research.laserTechnology}"] .level`)?.getAttribute('data-value') ?? _throw('no laserTechnology level found');
    const ionTechnology = document.querySelector(`[data-technology="${Research.ionTechnology}"] .level`)?.getAttribute('data-value') ?? _throw('no ionTechnology level found');
    const hyperspaceTechnology = document.querySelector(`[data-technology="${Research.hyperspaceTechnology}"] .level`)?.getAttribute('data-value') ?? _throw('no hyperspaceTechnology level found');
    const plasmaTechnology = document.querySelector(`[data-technology="${Research.plasmaTechnology}"] .level`)?.getAttribute('data-value') ?? _throw('no plasmaTechnology level found');

    const combustionDrive = document.querySelector(`[data-technology="${Research.combustionDrive}"] .level`)?.getAttribute('data-value') ?? _throw('no combustionDrive level found');
    const impulseDrive = document.querySelector(`[data-technology="${Research.impulseDrive}"] .level`)?.getAttribute('data-value') ?? _throw('no impulseDrive level found');
    const hyperspaceDrive = document.querySelector(`[data-technology="${Research.hyperspaceDrive}"] .level`)?.getAttribute('data-value') ?? _throw('no hyperspaceDrive level found');

    const espionageTechnology = document.querySelector(`[data-technology="${Research.espionageTechnology}"] .level`)?.getAttribute('data-value') ?? _throw('no espionageTechnology level found');
    const computerTechnology = document.querySelector(`[data-technology="${Research.computerTechnology}"] .level`)?.getAttribute('data-value') ?? _throw('no computerTechnology level found');
    const astrophysics = document.querySelector(`[data-technology="${Research.astrophysics}"] .level`)?.getAttribute('data-value') ?? _throw('no astrophysics level found');
    const intergalacticResearchNetwork = document.querySelector(`[data-technology="${Research.intergalacticResearchNetwork}"] .level`)?.getAttribute('data-value') ?? _throw('no intergalacticResearchNetwork level found');
    const gravitonTechnology = document.querySelector(`[data-technology="${Research.gravitonTechnology}"] .level`)?.getAttribute('data-value') ?? _throw('no gravitonTechnology level found');

    const weaponsTechnology = document.querySelector(`[data-technology="${Research.weaponsTechnology}"] .level`)?.getAttribute('data-value') ?? _throw('no weaponsTechnology level found');
    const shieldingTechnology = document.querySelector(`[data-technology="${Research.shieldingTechnology}"] .level`)?.getAttribute('data-value') ?? _throw('no shieldingTechnology level found');
    const armorTechnology = document.querySelector(`[data-technology="${Research.armorTechnology}"] .level`)?.getAttribute('data-value') ?? _throw('no armorTechnology level found');

    data.research = {
        [Research.energyTechnology]: parseInt(energyTechnology, 10),
        [Research.laserTechnology]: parseInt(laserTechnology, 10),
        [Research.ionTechnology]: parseInt(ionTechnology, 10),
        [Research.hyperspaceTechnology]: parseInt(hyperspaceTechnology, 10),
        [Research.plasmaTechnology]: parseInt(plasmaTechnology, 10),

        [Research.combustionDrive]: parseInt(combustionDrive, 10),
        [Research.impulseDrive]: parseInt(impulseDrive, 10),
        [Research.hyperspaceDrive]: parseInt(hyperspaceDrive, 10),

        [Research.espionageTechnology]: parseInt(espionageTechnology, 10),
        [Research.computerTechnology]: parseInt(computerTechnology, 10),
        [Research.astrophysics]: parseInt(astrophysics, 10),
        [Research.intergalacticResearchNetwork]: parseInt(intergalacticResearchNetwork, 10),
        [Research.gravitonTechnology]: parseInt(gravitonTechnology, 10),

        [Research.weaponsTechnology]: parseInt(weaponsTechnology, 10),
        [Research.shieldingTechnology]: parseInt(shieldingTechnology, 10),
        [Research.armorTechnology]: parseInt(armorTechnology, 10),
    };
}

async function trackSupplies(data: LocalPlayerData, planetId: number) {
    const planet = data.planets[planetId];

    if (!planet.isMoon) {
        updatePlanetSupplies(planet);
    } else {
        updateMoonSupplies(planet);
    }
}

function updatePlanetSupplies(planet: PlanetData) {
    const metalMine = document.querySelector(`[data-technology="${Building.metalMine}"] .level`)?.getAttribute('data-value') ?? _throw('no metalMine level found');
    const crystalMine = document.querySelector(`[data-technology="${Building.crystalMine}"] .level`)?.getAttribute('data-value') ?? _throw('no crystalMine level found');
    const deuteriumSynthesizer = document.querySelector(`[data-technology="${Building.deuteriumSynthesizer}"] .level`)?.getAttribute('data-value') ?? _throw('no deuteriumSynthesizer level found');

    const metalStorage = document.querySelector(`[data-technology="${Building.metalStorage}"] .level`)?.getAttribute('data-value') ?? _throw('no metalStorage level found');
    const crystalStorage = document.querySelector(`[data-technology="${Building.crystalStorage}"] .level`)?.getAttribute('data-value') ?? _throw('no crystalStorage level found');
    const deuteriumTank = document.querySelector(`[data-technology="${Building.deuteriumTank}"] .level`)?.getAttribute('data-value') ?? _throw('no deuteriumTank level found');

    const solarPlant = document.querySelector(`[data-technology="${Building.solarPlant}"] .level`)?.getAttribute('data-value') ?? _throw('no solarPlant level found');
    const fusionReactor = document.querySelector(`[data-technology="${Building.fusionReactor}"] .level`)?.getAttribute('data-value') ?? _throw('no fusionReactor level found');

    const buildings: PlanetBuildingLevels = {
        production: {
            [Building.metalMine]: parseInt(metalMine, 10),
            [Building.crystalMine]: parseInt(crystalMine, 10),
            [Building.deuteriumSynthesizer]: parseInt(deuteriumSynthesizer, 10),

            [Building.metalStorage]: parseInt(metalStorage, 10),
            [Building.crystalStorage]: parseInt(crystalStorage, 10),
            [Building.deuteriumTank]: parseInt(deuteriumTank, 10),

            [Building.solarPlant]: parseInt(solarPlant, 10),
            [Building.fusionReactor]: parseInt(fusionReactor, 10),
        },
        facilities: planet.buildings?.facilities,
    };
    planet.buildings = buildings;
}

function updateMoonSupplies(moon: MoonData) {
    const metalStorage = document.querySelector(`[data-technology="${Building.metalStorage}"] .level`)?.getAttribute('data-value') ?? _throw('no metalStorage level found');
    const crystalStorage = document.querySelector(`[data-technology="${Building.crystalStorage}"] .level`)?.getAttribute('data-value') ?? _throw('no crystalStorage level found');
    const deuteriumTank = document.querySelector(`[data-technology="${Building.deuteriumTank}"] .level`)?.getAttribute('data-value') ?? _throw('no deuteriumTank level found');

    const buildings: MoonBuildingLevels = {
        production: {
            [Building.metalStorage]: parseInt(metalStorage, 10),
            [Building.crystalStorage]: parseInt(crystalStorage, 10),
            [Building.deuteriumTank]: parseInt(deuteriumTank, 10),
        },
        facilities: moon.buildings?.facilities,
    };
    moon.buildings = buildings;
}

async function trackFacilities(data: LocalPlayerData, planetId: number) {
    const planet = data.planets[planetId];

    if (!planet.isMoon) {
        updatePlanetFacilities(planet);
    } else {
        updateMoonFacilities(planet);
    }

    await LocalPlayerModule.save(data);
}

function updatePlanetFacilities(planet: PlanetData) {
    const roboticsFactory = document.querySelector(`[data-technology="${Building.roboticsFactory}"] .level`)?.getAttribute('data-value') ?? _throw('no roboticsFactory level found');
    const shipyard = document.querySelector(`[data-technology="${Building.shipyard}"] .level`)?.getAttribute('data-value') ?? _throw('no shipyard level found');
    const researchLab = document.querySelector(`[data-technology="${Building.researchLab}"] .level`)?.getAttribute('data-value') ?? _throw('no researchLab level found');
    const allianceDepot = document.querySelector(`[data-technology="${Building.allianceDepot}"] .level`)?.getAttribute('data-value') ?? _throw('no allianceDepot level found');
    const missileSilo = document.querySelector(`[data-technology="${Building.missileSilo}"] .level`)?.getAttribute('data-value') ?? _throw('no missileSilo level found');
    const naniteFactory = document.querySelector(`[data-technology="${Building.naniteFactory}"] .level`)?.getAttribute('data-value') ?? _throw('no naniteFactory level found');

    const terraformer = document.querySelector(`[data-technology="${Building.terraformer}"] .level`)?.getAttribute('data-value') ?? _throw('no terraformer level found');
    const spaceDock = document.querySelector(`[data-technology="${Building.spaceDock}"] .level`)?.getAttribute('data-value') ?? _throw('no spaceDock level found');

    const buildings: PlanetBuildingLevels = {
        facilities: {
            [Building.roboticsFactory]: parseInt(roboticsFactory, 10),
            [Building.shipyard]: parseInt(shipyard, 10),
            [Building.researchLab]: parseInt(researchLab, 10),
            [Building.allianceDepot]: parseInt(allianceDepot, 10),
            [Building.missileSilo]: parseInt(missileSilo, 10),
            [Building.naniteFactory]: parseInt(naniteFactory, 10),

            [Building.terraformer]: parseInt(terraformer, 10),
            [Building.spaceDock]: parseInt(spaceDock, 10),
        },
        production: planet.buildings?.production,
    };
    planet.buildings = buildings;
}

function updateMoonFacilities(moon: MoonData) {
    const roboticsFactory = document.querySelector(`[data-technology="${Building.roboticsFactory}"] .level`)?.getAttribute('data-value') ?? _throw('no roboticsFactory level found');
    const shipyard = document.querySelector(`[data-technology="${Building.shipyard}"] .level`)?.getAttribute('data-value') ?? _throw('no shipyard level found');

    const lunarBase = document.querySelector(`[data-technology="${Building.lunarBase}"] .level`)?.getAttribute('data-value') ?? _throw('no lunarBase level found');
    const sensorPhalanx = document.querySelector(`[data-technology="${Building.sensorPhalanx}"] .level`)?.getAttribute('data-value') ?? _throw('no sensorPhalanx level found');
    const jumpGate = document.querySelector(`[data-technology="${Building.jumpGate}"] .level`)?.getAttribute('data-value') ?? _throw('no jumpGate level found');

    const buildings: MoonBuildingLevels = {
        facilities: {
            [Building.roboticsFactory]: parseInt(roboticsFactory, 10),
            [Building.shipyard]: parseInt(shipyard, 10),

            [Building.lunarBase]: parseInt(lunarBase, 10),
            [Building.sensorPhalanx]: parseInt(sensorPhalanx, 10),
            [Building.jumpGate]: parseInt(jumpGate, 10),
        },
        production: moon.buildings?.production,
    };
    moon.buildings = buildings;
}


async function trackShips(data: LocalPlayerData, planetId: number) {
    throw new Error("Function not implemented.");
}


async function trackDefenses(data: LocalPlayerData, planetId: number) {
    throw new Error("Function not implemented.");
}


async function trackAllianceClass(data: LocalPlayerData) {
    const allianceClassElem = document.querySelector('.allianceclass') ?? _throw('no alliance class found');

    let allianceClass = AllianceClass.none;
    if (allianceClassElem.classList.contains('trader')) {
        allianceClass = AllianceClass.trader;
    } else if (allianceClassElem.classList.contains('explorer')) {
        allianceClass = AllianceClass.researcher;
    } else if (allianceClassElem.classList.contains('warrior')) {
        allianceClass = AllianceClass.warrior;
    }

    data.allianceClass = allianceClass;
}

async function trackProductionPercentages(data: LocalPlayerData, planetId: number) {
    await trackAllianceClass(data);

    const planet = data.planets[planetId];
    if (planet.isMoon) {
        return;
    }

    const table = document.querySelector('table.listOfResourceSettingsPerPlanet') ?? _throw('no production settings table found');

    const metalMine = (table.querySelector('select[name="last1"]') as HTMLSelectElement | null)?.value ?? _throw('no metalMine settings found');
    const crystalMine = (table.querySelector('select[name="last2"]') as HTMLSelectElement | null)?.value ?? _throw('no crystalMine settings found');
    const deuteriumSynthesizer = (table.querySelector('select[name="last3"]') as HTMLSelectElement | null)?.value ?? _throw('no deuteriumSynthesizer settings found');

    const solarPlant = (table.querySelector('select[name="last4"]') as HTMLSelectElement | null)?.value ?? _throw('no solarPlant settings found');
    const fusionReactor = (table.querySelector('select[name="last12"]') as HTMLSelectElement | null)?.value ?? _throw('no fusionReactor settings found');

    const solarSatellites = (table.querySelector('select[name="last212"]') as HTMLSelectElement | null)?.value ?? _throw('no solarSatellites settings found');
    const crawlers = (table.querySelector('select[name="last217"]') as HTMLSelectElement | null)?.value ?? _throw('no crawlers settings found');

    planet.productionSettings = {
        [Building.metalMine]: parseInt(metalMine, 10) as ProductionPercentage,
        [Building.crystalMine]: parseInt(crystalMine, 10) as ProductionPercentage,
        [Building.deuteriumSynthesizer]: parseInt(deuteriumSynthesizer, 10) as ProductionPercentage,
        [Building.solarPlant]: parseInt(solarPlant, 10) as ProductionPercentage,
        [Building.fusionReactor]: parseInt(fusionReactor, 10) as ProductionPercentage,
        [Ship.solarSatellite]: parseInt(solarSatellites, 10) as ProductionPercentage,
        [Ship.crawler]: parseInt(crawlers, 10) as CrawlerProductionPercentage,
    };
}

async function trackActiveItems(data: LocalPlayerData, planetId: number) {
    const planet = data.planets[planetId];
    planet.activeItemHashes ??= {};

    const timestamp = parseInt((document.querySelector('meta[name="ogame-timestamp"]') as HTMLMetaElement | null)?.content ?? _throw('no timestamp meta found'), 10);

    const activeItemsUl = document.querySelector('ul.active_items') ?? _throw('no active items panel found');
    const activeItems = activeItemsUl.querySelectorAll('div[data-uuid]');
    for (const activeItem of activeItems) {
        const itemId = activeItem.getAttribute('data-uuid')!;
        const activeFor = parseInt(activeItem.querySelector('.js_duration')?.textContent ?? _throw('no activeUntil found'), 10);

        planet.activeItemHashes[itemId] = timestamp + activeFor;
    }
}

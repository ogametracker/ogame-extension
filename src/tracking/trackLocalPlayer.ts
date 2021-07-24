import Coordinates, { parseCoordinates } from "@/models/Coordinates";
import PlanetType from "@/models/PlanetType";
import Research from "@/models/Research";
import LocalPlayerModule, { MoonData, PlanetData, PlayerClass } from "@/store/modules/LocalPlayerModule";
import { QueryParameters } from "@/utils/getQueryParameters";
import _throw from "@/utils/throw";

export async function startLocalPlayerTracking(queryParams: QueryParameters) {
    if (queryParams.has('page', 'ingame')
        || queryParams.has('page', 'messages')
        || queryParams.has('page', 'chat')
        || queryParams.has('page', 'shop')
        || queryParams.has('page', 'highscore')
        || queryParams.has('page', 'rewards')
        || queryParams.has('page', 'premium')
    ) {
        await trackOwnedPlanets();
        await trackOfficers();
        await trackPlayerClass();
    }

    if (queryParams.has('page', 'ingame')) {
        const component = queryParams.get('component');
        switch (component) {
            case 'research': {
                await trackResearch();
                break;
            }

            case 'supplies': {
                await trackSupplies();
                break;
            }

            case 'facilities': {
                await trackFacilities();
                break;
            }

            case 'shipyard':
            case 'fleetdispatch': {
                await trackShips();
                break;
            }

            case 'defenses': {
                await trackDefenses();
                break;
            }

            case 'alliance': {
                await trackAllianceClass();
                break;
            }

            case 'resourceSettings': {
                await trackProductionPercentages();
                break;
            }
        }
    }
}

async function trackOwnedPlanets() {
    const planetList = document.querySelector('#planetList') ?? _throw('no #planetList found');
    const planets = planetList.querySelectorAll('.smallplanet');

    const playerData = await LocalPlayerModule.getData();

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

    await LocalPlayerModule.save(playerData);
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

async function trackOfficers() {
    const officersDiv = document.querySelector('#officers') ?? _throw('no #officers elem found');

    const commander = officersDiv.querySelector('.commander')?.classList.contains('on') ?? _throw('no commander found');
    const admiral = officersDiv.querySelector('.admiral')?.classList.contains('on') ?? _throw('no admiral found');
    const engineer = officersDiv.querySelector('.engineer')?.classList.contains('on') ?? _throw('no engineer found');
    const geologist = officersDiv.querySelector('.geologist')?.classList.contains('on') ?? _throw('no geologist found');
    const technocrat = officersDiv.querySelector('.technocrat')?.classList.contains('on') ?? _throw('no technocrat found');

    const data = await LocalPlayerModule.getData();
    data.officers = { commander, admiral, engineer, geologist, technocrat };
    await LocalPlayerModule.save(data);
}

async function trackPlayerClass() {
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

    const data = await LocalPlayerModule.getData();
    data.playerClass = playerClass;
    await LocalPlayerModule.save(data);
}

async function trackResearch() {
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

    const data = await LocalPlayerModule.getData();
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
    await LocalPlayerModule.save(data);
}

async function trackSupplies() {
    throw new Error("Function not implemented.");
}


async function trackFacilities() {
    throw new Error("Function not implemented.");
}


async function trackShips() {
    throw new Error("Function not implemented.");
}


async function trackDefenses() {
    throw new Error("Function not implemented.");
}


async function trackAllianceClass() {
    throw new Error("Function not implemented.");
}
function trackProductionPercentages() {
    throw new Error("Function not implemented.");
}


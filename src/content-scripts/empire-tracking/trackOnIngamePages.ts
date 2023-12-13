import { sendMessage } from "@/shared/communication/sendMessage";
import { getLanguage } from "@/shared/i18n/getLanguage";
import { MessageType } from "@/shared/messages/MessageType";
import { BasicPlanetData, BasicPlanetDataMoon, BasicPlanetDataPlanet, UpdateActiveOfficersMessage, UpdateFleetsMessage, UpdateOwnedPlanetsMessage, UpdatePlayerClassMessage } from "@/shared/messages/tracking/empire";
import { UpdateSelectedLifeformMessage } from "@/shared/messages/tracking/empire";
import { PlayerOfficers } from "@/shared/models/empire/PlayerOfficers";
import { PlayerClass } from "@/shared/models/ogame/classes/PlayerClass";
import { Coordinates } from "@/shared/models/ogame/common/Coordinates";
import { PlanetType } from "@/shared/models/ogame/common/PlanetType";
import { FleetMissionType } from "@/shared/models/ogame/fleets/FleetMissionType";
import { Fleet } from "@/shared/models/ogame/fleets/types";
import { ResourceType, ResourceTypes } from "@/shared/models/ogame/resources/ResourceType";
import { NonStationaryShipTypes } from "@/shared/models/ogame/ships/ShipTypes";
import { getOgameMeta } from "@/shared/ogame-web/getOgameMeta";
import { createRecord } from "@/shared/utils/createRecord";
import { parseCoordinates } from "@/shared/utils/parseCoordinates";
import { parseIntSafe } from "@/shared/utils/parseNumbers";
import { _throw } from "@/shared/utils/_throw";
import { empireTrackingUuid } from "@/shared/uuid";
import { getActiveLifeform } from "./getActiveLifeform";
import { observerCallbacks } from "./main";
import i18nShips from '@/shared/i18n/ogame/ships';
import i18nResources from '@/shared/i18n/ogame/resources';

export function trackOnIngamePages() {
    trackPlayerClass();
    trackOwnedPlanets();
    trackOfficers();

    trackSelectedLifeform();

    trackFleets();
}

//#region player class
function trackPlayerClass() {
    observerCallbacks.push({
        selector: '#characterclass',
        callback: element => {
            const classDiv = element.querySelector('div.characterclass') ?? _throw('no character class element found');

            let playerClass = PlayerClass.none;
            if (classDiv.classList.contains('explorer')) {
                playerClass = PlayerClass.discoverer;
            } else if (classDiv.classList.contains('warrior')) {
                playerClass = PlayerClass.general;
            } else if (classDiv.classList.contains('miner')) {
                playerClass = PlayerClass.collector;
            }

            const message: UpdatePlayerClassMessage = {
                ogameMeta: getOgameMeta(),
                type: MessageType.UpdatePlayerClass,
                data: playerClass,
                senderUuid: empireTrackingUuid,
            };
            sendMessage(message);
        },
    });
}
//#endregion

//#region owned planets/moons
function trackOwnedPlanets() {
    observerCallbacks.push({
        selector: '#planetList',
        callback: element => {
            const planetElems = element.querySelectorAll('.smallplanet');
            const ownedPlanets: BasicPlanetData[] = [];

            planetElems.forEach(planetElem => {
                const planet = getPlanetData(planetElem);
                ownedPlanets.push(planet);

                const moon = getMoonData(planetElem, planet.coordinates);
                if (moon != null) {
                    ownedPlanets.push(moon);
                }
            });

            const message: UpdateOwnedPlanetsMessage = {
                ogameMeta: getOgameMeta(),
                type: MessageType.UpdatePlanetData,
                data: ownedPlanets,
                senderUuid: empireTrackingUuid,
            };
            sendMessage(message);
        },
    });
}

const planetIdRegex = /&cp=(?<id>\d+)($|[^\d])/;
const maxTempRegex = /\d+\s*°C[^\d]*?(?<temp>-?\d+)\s*°C/;
const nameRegex = /^<b>(?<name>.+) \[\d+:\d+:\d+\]/;

function getPlanetData(planetElem: Element): BasicPlanetDataPlanet {
    const planetLink = (planetElem.querySelector(':scope > a.planetlink') as HTMLAnchorElement | null)?.href ?? _throw('no planetlink found');
    const idText = planetLink.match(planetIdRegex)?.groups?.id ?? _throw('no planet id found in url');
    const id = parseIntSafe(idText, 10);

    const coordsText = planetElem.querySelector(':scope > a.planetlink > .planet-koords')?.textContent ?? _throw('no planet coordinates found');
    const coordinates = parseCoordinates(coordsText);

    const titleText = planetElem.querySelector(':scope > a.planetlink')?.getAttribute('title') ?? _throw('no planet title found');
    const maxTempText = titleText.match(maxTempRegex)?.groups?.temp ?? _throw('no max temp found');
    const maxTemperature = parseIntSafe(maxTempText, 10);

    const name = titleText.match(nameRegex)?.groups?.name ?? _throw('no planet name found');

    return {
        isMoon: false,
        id,
        name,
        coordinates,
        maxTemperature,
    };
}

function getMoonData(planetElem: Element, coordinates: Coordinates): BasicPlanetDataMoon | null {
    const moonLinkElem = planetElem.querySelector(':scope > a.moonlink') as HTMLAnchorElement | null;
    if (moonLinkElem == null) {
        return null;
    }

    const idText = moonLinkElem.href.match(planetIdRegex)?.groups?.id ?? _throw('no moon id found in url');
    const id = parseIntSafe(idText, 10);

    const titleText = moonLinkElem.getAttribute('title') ?? _throw('no moon title found');
    const name = titleText.match(nameRegex)?.groups?.name ?? _throw('no moon name found');

    return {
        isMoon: true,
        id,
        name,
        coordinates: {
            ...coordinates,
            type: PlanetType.moon,
        },
    };
}
//#endregion

//#region officers
function trackOfficers() {
    observerCallbacks.push({
        selector: '#officers',
        callback: element => {
            const commander = element.querySelector('.commander')?.classList.contains('on') ?? _throw('no commander found');
            const admiral = element.querySelector('.admiral')?.classList.contains('on') ?? _throw('no admiral found');
            const engineer = element.querySelector('.engineer')?.classList.contains('on') ?? _throw('no engineer found');
            const geologist = element.querySelector('.geologist')?.classList.contains('on') ?? _throw('no geologist found');
            const technocrat = element.querySelector('.technocrat')?.classList.contains('on') ?? _throw('no technocrat found');

            const officers: PlayerOfficers = {
                commander,
                admiral,
                engineer,
                geologist,
                technocrat,
            };

            const message: UpdateActiveOfficersMessage = {
                ogameMeta: getOgameMeta(),
                type: MessageType.UpdateActiveOfficers,
                data: officers,
                senderUuid: empireTrackingUuid,
            };
            sendMessage(message);
        },
    });
}
//#endregion

//#region active lifeform
function trackSelectedLifeform() {
    observerCallbacks.push({
        selector: '#lifeform', // is only on page for planets
        callback: element => {
            const planetIdText = (document.querySelector('meta[name="ogame-planet-id"]') as HTMLMetaElement | null)?.content
                ?? _throw('no meta element found for ogame-planet-id');
            const planetId = parseIntSafe(planetIdText, 10);

            const lifeform = getActiveLifeform();

            const message: UpdateSelectedLifeformMessage = {
                ogameMeta: getOgameMeta(),
                type: MessageType.UpdateSelectedLifeform,
                data: {
                    isMoon: false,
                    planetId,
                    data: lifeform,
                },
                senderUuid: empireTrackingUuid,
            };
            sendMessage(message);
        },
    });
}
//#endregion

//#region fleets
function trackFleets() {
    const observer = new MutationObserver(() => {
        updateFleetTracking();
    });
    observer.observe(document.documentElement, { subtree: true, childList: true });
}

const $trackedFleets: Record<number, Fleet> = {};

function updateFleetTracking() {
    const eventTable = document.querySelector('#eventContent');
    if (eventTable == null) {
        return;
    }

    const meta = getOgameMeta();
    const language = getLanguage(meta.userLanguage);
    if(language == null) {
        return;
    }

    const shipNames = i18nShips[language];
    const resourceNames = i18nResources[language];

    const fleetRows = eventTable.querySelectorAll('.eventFleet');
    let trackedNewFleet = false;
    fleetRows.forEach(row => {
        const id = parseIntSafe(row.id.replace('eventRow-', ''));
        if ($trackedFleets[id] != null) {
            return;
        }

        const arrivalTime = parseIntSafe(row.getAttribute('data-arrival-time') ?? _throw('no arrival time found')) * 1_000;
        const isReturnFlight = row.getAttribute('data-return-flight') == 'true';
        const mission = parseIntSafe(row.getAttribute('data-mission-type') ?? _throw('no mission type found')) as FleetMissionType;

        const originCoordinatesText = row.querySelector('.coordsOrigin')?.textContent ?? _throw('no origin coordinates found');
        const originCoordinatesType = getCoordinateType(row.querySelector('.originFleet') ?? _throw('no origin icon found'));
        const originCoordinates = parseCoordinates(originCoordinatesText.trim(), originCoordinatesType);

        const destinationCoordinatesText = row.querySelector('.destCoords')?.textContent ?? _throw('no origin coordinates found');
        const destinationCoordinatesType = getCoordinateType(row.querySelector('.destFleet') ?? _throw('no dest icon found'));;
        const destinationCoordinates = parseCoordinates(destinationCoordinatesText.trim(), destinationCoordinatesType);

        const tooltipHtml = row.querySelector('[class*="icon_movement"] .tooltip')?.getAttribute('title') ?? _throw('no tooltip found');
        const tooltipTextElem = document.createElement('div');
        tooltipTextElem.innerHTML = tooltipHtml;
        const tooltipText = tooltipTextElem.textContent ?? '';

        const ships = createRecord(NonStationaryShipTypes, shipType => {
            const name = shipNames[shipType];
            const regex = new RegExp(`${name}:\\s*(?<count>[^\\s]+)`);
            const match = tooltipText.match(regex);

            if(match?.groups == null) {
                return 0;
            }

            if(match.groups.count == '?') {
                return 0;
            }
            const countText = match.groups.count.replace(/[^\d]/g, '');
            return parseIntSafe(countText);
        });
        const cargo = createRecord(ResourceTypes, resourceType => {
            const name = resourceNames[resourceType];
            const regex = new RegExp(`${name}:\\s*(?<amount>[^\\s]+)`);
            const match = tooltipText.match(regex);

            if(match?.groups == null) {
                return 0;
            }

            const amountText = match.groups.amount.replace(/[^\d]/g, '');
            return parseIntSafe(amountText);
        });

        const fleet: Fleet = {
            id,
            arrivalTime,
            isReturnFlight,
            mission,

            originCoordinates,
            destinationCoordinates,

            cargo,
            ships,
        };
        $trackedFleets[id] = fleet;

        trackedNewFleet = true;
    });

    if(trackedNewFleet) {
        const msg: UpdateFleetsMessage = {
            ogameMeta: getOgameMeta(),
            type: MessageType.UpdateFleets,
            data: Object.values($trackedFleets),
            senderUuid: empireTrackingUuid,
        };
        sendMessage(msg);
    }
}

function getCoordinateType(elem: Element): PlanetType {
    if (elem.querySelector('figure.planet') != null) {
        return PlanetType.planet;
    }
    if (elem.querySelector('figure.moon') != null) {
        return PlanetType.moon;
    }
    if (elem.querySelector('figure.tf') != null) {
        return PlanetType.debrisField;
    }

    _throw('invalid coordinate type');
}
//#endregion
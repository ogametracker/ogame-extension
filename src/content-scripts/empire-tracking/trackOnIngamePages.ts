import { sendMessage } from "@/shared/communication/sendMessage";
import { MessageType } from "@/shared/messages/MessageType";
import { BasicPlanetData, BasicPlanetDataMoon, BasicPlanetDataPlanet, UpdateActiveOfficersMessage, UpdateOwnedPlanetsMessage, UpdatePlayerClassMessage } from "@/shared/messages/tracking/empire";
import { UpdateSelectedLifeformMessage } from "@/shared/messages/tracking/empire";
import { PlayerOfficers } from "@/shared/models/empire/PlayerOfficers";
import { PlayerClass } from "@/shared/models/ogame/classes/PlayerClass";
import { Coordinates } from "@/shared/models/ogame/common/Coordinates";
import { PlanetType } from "@/shared/models/ogame/common/PlanetType";
import { LifeformType } from "@/shared/models/ogame/lifeforms/LifeformType";
import { getOgameMeta } from "@/shared/ogame-web/getOgameMeta";
import { parseCoordinates } from "@/shared/utils/parseCoordinates";
import { parseIntSafe } from "@/shared/utils/parseNumbers";
import { _throw } from "@/shared/utils/_throw";
import { empireTrackingUuid } from "@/shared/uuid";
import { getActiveLifeform } from "./getActiveLifeform";
import { observerCallbacks } from "./main";

export function trackOnIngamePages() {
    trackPlayerClass();
    trackOwnedPlanets();
    trackOfficers();

    trackSelectedLifeform();
}

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
const maxTempRegex = / (?<temp>-?\d+)\s*°C<br\/?>/;
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
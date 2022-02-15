import { BasicPlanetData, BasicPlanetDataMoon, BasicPlanetDataPlanet, UpdateOwnedPlanetsMessage, } from "../../shared/messages/tracking/empire";
import { PlanetType } from "../../shared/models/v1/ogame/common/PlanetType";
import { observerCallbacks } from "./main";
import { _throw } from "../../shared/utils/_throw";
import { parseIntSafe } from "../../shared/utils/parseNumbers";
import { parseCoordinates } from '../../shared/utils/parseCoordinates';
import { Coordinates } from "../../shared/models/v1/ogame/common/Coordinates";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";
import { MessageType } from "../../shared/messages/MessageType";

export function trackOwnedPlanets() {
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
            };
            chrome.runtime.sendMessage(message);
        },
    });
}

const planetIdRegex = /&cp=(?<id>\d+)($|[^\d])/;
const maxTempRegex = / (?<temp>-?\d+)\s*°C<br\/?>/;

function getPlanetData(planetElem: Element): BasicPlanetDataPlanet {
    const planetLink = (planetElem.querySelector(':scope > a.planetlink') as HTMLAnchorElement | null)?.href ?? _throw('no planetlink found');
    const idText = planetLink.match(planetIdRegex)?.groups?.id ?? _throw('no planet id found in url');
    const id = parseIntSafe(idText, 10);

    const coordsText = planetElem.querySelector(':scope > a.planetlink > .planet-koords')?.textContent ?? _throw('no planet coordinates found');
    const coordinates = parseCoordinates(coordsText);

    const name = planetElem.querySelector(':scope > a.planetlink > .planet-name')?.textContent ?? _throw('no planet name found');

    const titleText = planetElem.querySelector(':scope > a.planetlink')?.getAttribute('title') ?? _throw('no planet title found');
    const maxTempText = titleText.match(maxTempRegex)?.groups?.temp ?? _throw('no max temp found');
    const maxTemperature = parseIntSafe(maxTempText, 10);

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

    const name = (moonLinkElem.querySelector(':scope > img') as HTMLImageElement | null)?.alt ?? _throw('no moon name found');

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


import { MessageType } from "../../shared/messages/MessageType";
import { UpdatePlanetBuildingLevelsMessage, UpdatePlanetDefenseCountsMessage, UpdatePlanetShipCountsMessage, UpdateResearchLevelsMessage } from "../../shared/messages/tracking/empire";
import { BuildingType } from "../../shared/models/ogame/buildings/BuildingType";
import { PlanetType } from "../../shared/models/ogame/common/PlanetType";
import { DefenseType } from "../../shared/models/ogame/defenses/DefenseType";
import { ResearchType } from "../../shared/models/ogame/research/ResearchType";
import { ShipType } from "../../shared/models/ogame/ships/ShipType";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";
import { getNumericEnumValues } from "../../shared/utils/getNumericEnumValues";
import { parseIntSafe } from "../../shared/utils/parseNumbers";
import { _logError } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import { observerCallbacks } from "./main";

interface OgameEmpireData {
    groups: any;
    translations: any;
    planets: OgameEmpirePlanet[];
}

// numbers are sometimes saved as string, wtf gameforge
type OgameEmpirePlanetTechnologies = Record<BuildingType | ResearchType | ShipType | DefenseType, number | string>;
type OgameEmpirePlanet = OgameEmpirePlanetTechnologies & {
    id: number;
    name: string;

    galaxy: number;
    system: number;
    position: number;

    metal: number;
    crystal: number;
    deuterium: number;

    equipment_html: string; //can contain HTML for active items, or something like "keine Items angelegt"
    temperature: string; //e.g. "12°C to 52°C" or "-9 °C bis 31 °C" (mind the space)
    type: 1 | 3;
};

const domParser = new DOMParser();

export function trackEmpirePage() {
    observerCallbacks.push({
        selector: '#siteFooter',
        callback: () => {
            const scripts = Array.from(document.querySelectorAll('script')) as HTMLScriptElement[];
            const script = scripts.find(s => s.textContent?.includes('createImperiumHtml(') ?? false)
                ?? _throw('did not find script with imperium data');
            const js = script.textContent ?? _throw('no js found');

            const jsonRegex = /createImperiumHtml\("#mainWrapper", "#loading", (?<json>.+), 0 \)/;
            const match = js.match(jsonRegex);
            const json = match?.groups?.json ?? _throw('no empire json found');

            const ogameEmpireData = JSON.parse(json) as OgameEmpireData;
            const ogameMeta = getOgameMeta();

            const buildingTypes = getNumericEnumValues<BuildingType>(BuildingType);
            const shipTypes = getNumericEnumValues<ShipType>(ShipType);
            const defenseTypes = getNumericEnumValues<DefenseType>(DefenseType);
            const researchTypes = getNumericEnumValues<ResearchType>(ResearchType);

            ogameEmpireData.planets.forEach(planet => {
                // ACHTUNG! Planetendaten (IDs, Positionen etc) werden NICHT getrackt, da dafür ALLE Planeten und Monde benötigt werden!

                // update building levels
                const updateBuildings = buildingTypes.filter(building => planet[building] != null);
                const buildingLevels = updateBuildings.reduce((acc, building) => {
                    acc[building] = parseIntSafe(planet[building].toString(), 10);
                    return acc;
                }, {} as Partial<Record<BuildingType, number>>);

                const buildingsMessage: UpdatePlanetBuildingLevelsMessage = {
                    ogameMeta,
                    type: MessageType.UpdatePlanetBuildingLevels,
                    data: {
                        planetId: planet.id,
                        data: buildingLevels,
                    },
                };
                chrome.runtime.sendMessage(buildingsMessage);

                // update ship counts
                const shipCounts = shipTypes.reduce((acc, ship) => {
                    acc[ship] = parseIntSafe(planet[ship].toString(), 10);
                    return acc;
                }, {} as Partial<Record<ShipType, number>>);

                const shipCountsMessage: UpdatePlanetShipCountsMessage = {
                    ogameMeta,
                    type: MessageType.UpdatePlanetShipCounts,
                    data: {
                        planetId: planet.id,
                        data: shipCounts,
                    },
                };
                chrome.runtime.sendMessage(shipCountsMessage);

                // update defense counts
                const defenseCounts = defenseTypes.reduce((acc, def) => {
                    acc[def] = parseIntSafe(planet[def].toString(), 10);
                    return acc;
                }, {} as Record<DefenseType, number>);

                const defenseCountsMessage: UpdatePlanetDefenseCountsMessage = {
                    ogameMeta,
                    type: MessageType.UpdatePlanetDefenseCounts,
                    data: {
                        planetId: planet.id,
                        data: {
                            ...defenseCounts,
                            [DefenseType.smallShieldDome]: defenseCounts[DefenseType.smallShieldDome] > 0,
                            [DefenseType.largeShieldDome]: defenseCounts[DefenseType.largeShieldDome] > 0,
                        },
                    },
                };
                chrome.runtime.sendMessage(defenseCountsMessage);

                //TODO: update active items (we need to know the small image hashes for every item to be able to track them!)
                const itemDoc = domParser.parseFromString(planet.equipment_html, 'text/html');
                const itemDivs = Array.from(itemDoc.querySelectorAll('ul.empireItems > li > div'));
                itemDivs.forEach(itemDiv => {
                    const divWithImageStyle = itemDiv.querySelector(':scope > div[style]');

                    // there are empty divs in the html for some reason
                    if(divWithImageStyle == null) {
                        return;
                    }

                    //TODO: get small image url from style

                    const durationText = itemDiv.querySelector('span[data-total-duration]')?.getAttribute('data-total-duration') ?? _throw('found item div but no duration');
                    const duration = parseIntSafe(durationText, 10);
                    // permanent items have negative duration
                    if(duration < 0) {
                        //TODO: handle items with no remaining duration (like planet/moon field items)
                    }

                });
                _logError('TODO: update active items');
            });


            // update research levels
            const researchLevels = researchTypes.reduce((acc, research) => {
                acc[research] = parseIntSafe(ogameEmpireData.planets[0][research].toString(), 10);
                return acc;
            }, {} as Record<ResearchType, number>);

            const researchMessage: UpdateResearchLevelsMessage = {
                ogameMeta: getOgameMeta(),
                type: MessageType.UpdateResearchLevels,
                data: researchLevels,
            };
            chrome.runtime.sendMessage(researchMessage);
        },
    });
}
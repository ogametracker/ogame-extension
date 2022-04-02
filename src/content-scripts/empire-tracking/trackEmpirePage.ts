import { sendMessage } from "@/shared/communication/sendMessage";
import { MessageType } from "../../shared/messages/MessageType";
import { UpdatePlanetActiveItemsMessage, UpdatePlanetBuildingLevelsMessage, UpdatePlanetDefenseCountsMessage, UpdatePlanetShipCountsMessage, UpdateResearchLevelsMessage } from "../../shared/messages/tracking/empire";
import { PlanetActiveItems } from "../../shared/models/empire/PlanetActiveItems";
import { BuildingType } from "../../shared/models/ogame/buildings/BuildingType";
import { PlanetType } from "../../shared/models/ogame/common/PlanetType";
import { DefenseType } from "../../shared/models/ogame/defenses/DefenseType";
import { Items } from "../../shared/models/ogame/items/Items";
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
            const ogameNowText = (document.querySelector('meta[name="ogame-timestamp"]') as HTMLMetaElement | null)?.content
                ?? _throw('no meta element found for ogame-timestamp');
            const ogameNow = parseIntSafe(ogameNowText, 10) * 1000;

            const scripts = Array.from(document.querySelectorAll('script')) as HTMLScriptElement[];
            const script = scripts.find(s => s.textContent?.includes('createImperiumHtml(') ?? false)
                ?? _throw('did not find script with imperium data');
            const js = script.textContent ?? _throw('no js found');

            const jsonRegex = /createImperiumHtml\("#mainWrapper", "#loading", (?<json>.+), [01] \)/;
            const match = js.match(jsonRegex);
            const json = match?.groups?.json ?? _throw('no empire json found');

            const ogameEmpireData = JSON.parse(json) as OgameEmpireData;
            const ogameMeta = getOgameMeta();

            const buildingTypes = getNumericEnumValues<BuildingType>(BuildingType);
            const shipTypes = getNumericEnumValues<ShipType>(ShipType);
            const defenseTypes = getNumericEnumValues<DefenseType>(DefenseType);
            const researchTypes = getNumericEnumValues<ResearchType>(ResearchType);

            ogameEmpireData.planets.forEach(planet => {
                /* ATTENTION! 
                 * Basic Planet data (IDs, positions, temperatures etc.) are NOT tracked here because we need to know ALL planets AND moons at once
                 * which is not possible on the OGame empire page
                 */

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
                sendMessage(buildingsMessage);

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
                sendMessage(shipCountsMessage);

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
                sendMessage(defenseCountsMessage);

                // update active items using the small image hashes
                const itemDoc = domParser.parseFromString(planet.equipment_html, 'text/html');
                const itemDivs = Array.from(itemDoc.querySelectorAll('ul.empireItems > li > div'));

                const activeItems: PlanetActiveItems = {};
                itemDivs.forEach(itemDiv => {
                    const divWithImageStyle = itemDiv.querySelector(':scope > div[style]');

                    // there are empty divs in the html for some reason
                    if (divWithImageStyle == null) {
                        return;
                    }

                    // get small image url from style
                    const styleAttr = divWithImageStyle.getAttribute('style') ?? _throw('no style attribute found?!');
                    const backgroundUrlRegex = /background: url\([^)]+\/(?<smallImageHash>[^)]+)-small.png\)/;
                    const backgroundUrlMatch = styleAttr.match(backgroundUrlRegex) ?? _throw('no background image url found');
                    const smallImageHash = backgroundUrlMatch.groups?.smallImageHash ?? _throw('matched but no background image url found');

                    const item = Object.values(Items).find(item => item.smallImage == smallImageHash) ?? _throw(`did not find item with small image hash '${smallImageHash}'`);

                    const durationLeftElem = itemDiv.querySelector('span[data-total-duration]') ?? _throw('no item duration found');
                    const durationLeftText = durationLeftElem.textContent ?? _throw('no duration found');
                    const totalDuration = parseIntSafe(durationLeftElem.getAttribute('data-total-duration') ?? _throw('no duration found'), 10);

                    let activeUntil: number | 'permanent' = 'permanent';
                    if (durationLeftText != '' && totalDuration > 0) {
                        const durationLeft = parseIntSafe(durationLeftText, 10) * 1000;
                        activeUntil = ogameNow + durationLeft;
                    }
                    activeItems[item.hash] = activeUntil;
                });
                const message: UpdatePlanetActiveItemsMessage = {
                    ogameMeta: getOgameMeta(),
                    type: MessageType.UpdatePlanetActiveItems,
                    data: {
                        planetId: planet.id,
                        data: activeItems,
                    },
                };
                sendMessage(message);
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
            sendMessage(researchMessage);
        },
    });
}
import { sendMessage } from "@/shared/communication/sendMessage";
import { MessageOgameMeta } from "@/shared/messages/Message";
import { LifeformBuildingType, LifeformBuildingTypes } from "@/shared/models/ogame/lifeforms/LifeformBuildingType";
import { LifeformTechnologyType, LifeformTechnologyTypes } from "@/shared/models/ogame/lifeforms/LifeformTechnologyType";
import { MissileType } from "@/shared/models/ogame/missiles/MissileType";
import { MissileTypes } from "@/shared/models/ogame/missiles/MissileTypes";
import { empireTrackingUuid } from "@/shared/uuid";
import { MessageType } from "../../shared/messages/MessageType";
import { UpdatePlanetActiveItemsMessage, UpdatePlanetBuildingLevelsMessage, UpdatePlanetDefenseCountsMessage, UpdatePlanetLifeformBuildingLevelsMessage, UpdatePlanetLifeformTechnologyLevelsMessage, UpdatePlanetMissileCountsMessage, UpdatePlanetShipCountsMessage, UpdateResearchLevelsMessage } from "../../shared/messages/tracking/empire";
import { PlanetActiveItems } from "../../shared/models/empire/PlanetActiveItems";
import { BuildingType } from "../../shared/models/ogame/buildings/BuildingType";
import { BuildingTypes } from "../../shared/models/ogame/buildings/BuildingTypes";
import { DefenseType } from "../../shared/models/ogame/defenses/DefenseType";
import { DefenseTypes } from "../../shared/models/ogame/defenses/DefenseTypes";
import { Items } from "../../shared/models/ogame/items/Items";
import { ResearchType } from "../../shared/models/ogame/research/ResearchType";
import { ResearchTypes } from "../../shared/models/ogame/research/ResearchTypes";
import { ShipType } from "../../shared/models/ogame/ships/ShipType";
import { ShipTypes } from "../../shared/models/ogame/ships/ShipTypes";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";
import { parseIntSafe } from "../../shared/utils/parseNumbers";
import { _logError } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import { observerCallbacks } from "./main";

interface OgameEmpireData {
    groups: any;
    translations: any;
    planets: OgameEmpirePlanet[];
}

const OgameMoonType = 3;

// numbers are sometimes saved as string, wtf gameforge
type OgameEmpirePlanetTechnologies = Record<
    | BuildingType
    | ResearchType
    | ShipType
    | DefenseType
    | MissileType
    | LifeformBuildingType
    | LifeformTechnologyType
    ,
    | number
    | string
>;
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
        callback: async () => {
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

            ogameEmpireData.planets.forEach(planet => {
                /* ATTENTION! 
                * Basic Planet data (IDs, positions, temperatures etc.) are NOT tracked here because we need to know ALL planets AND moons at once
                * which is not possible on the OGame empire page
                */

                trackPlanetBuildingLevels(planet, ogameMeta);
                trackPlanetDefenses(planet, ogameMeta);
                trackPlanetMissiles(planet, ogameMeta);
                trackPlanetActiveItems(planet, ogameNow);

                if (planet.type != OgameMoonType) {
                    trackPlanetLifeformBuildingLevels(planet, ogameMeta);
                    trackPlanetLifeformTechnologyLevels(planet, ogameMeta);
                }
            });


            trackResearchLevels(ogameEmpireData);
        },
    });
}

function trackResearchLevels(ogameEmpireData: OgameEmpireData) {
    const researchLevels = ResearchTypes.reduce((acc, research) => {
        acc[research] = parseIntSafe(ogameEmpireData.planets[0][research].toString(), 10);
        return acc;
    }, {} as Record<ResearchType, number>);

    const researchMessage: UpdateResearchLevelsMessage = {
        ogameMeta: getOgameMeta(),
        type: MessageType.UpdateResearchLevels,
        data: researchLevels,
        senderUuid: empireTrackingUuid,
    };
    sendMessage(researchMessage);
}

function trackPlanetActiveItems(planet: OgameEmpirePlanet, ogameNow: number) {
    const isMoon = planet.type == OgameMoonType;

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
        const backgroundUrlMatch = styleAttr.match(backgroundUrlRegex);
        if(backgroundUrlMatch == null) {
            console.warn('found item with no image hash match, likely lifeform or alliance debuff', backgroundUrlRegex);
            return;
        }
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
            isMoon,
            planetId: planet.id,
            data: activeItems,
        },
        senderUuid: empireTrackingUuid,
    };
    sendMessage(message);
}

function trackPlanetDefenses(planet: OgameEmpirePlanet, ogameMeta: MessageOgameMeta) {
    const isMoon = planet.type == OgameMoonType;

    const defenseCounts = DefenseTypes.reduce((acc, def) => {
        acc[def] = parseIntSafe(planet[def].toString(), 10);
        return acc;
    }, {} as Record<DefenseType, number>);

    const defenseCountsMessage: UpdatePlanetDefenseCountsMessage = {
        ogameMeta,
        type: MessageType.UpdatePlanetDefenseCounts,
        data: {
            isMoon,
            planetId: planet.id,
            data: {
                ...defenseCounts,
                [DefenseType.smallShieldDome]: defenseCounts[DefenseType.smallShieldDome] > 0,
                [DefenseType.largeShieldDome]: defenseCounts[DefenseType.largeShieldDome] > 0,
            },
        },
        senderUuid: empireTrackingUuid,
    };
    sendMessage(defenseCountsMessage);
}

function trackPlanetMissiles(planet: OgameEmpirePlanet, ogameMeta: MessageOgameMeta) {
    const isMoon = planet.type == OgameMoonType;
    
    const missileCounts = MissileTypes.reduce((acc, missile) => {
        acc[missile] = parseIntSafe(planet[missile].toString(), 10);
        return acc;
    }, {} as Record<MissileType, number>);

    const missileMessage: UpdatePlanetMissileCountsMessage = {
        ogameMeta: getOgameMeta(),
        type: MessageType.UpdatePlanetMissileCounts,
        data: {
            isMoon,
            planetId: planet.id,
            data: missileCounts,
        },
        senderUuid: empireTrackingUuid,
    };
    sendMessage(missileMessage);
}

function trackPlanetBuildingLevels(planet: OgameEmpirePlanet, ogameMeta: MessageOgameMeta) {
    const isMoon = planet.type == OgameMoonType;

    const updateBuildings = BuildingTypes.filter(building => planet[building] != null);
    const buildingLevels = updateBuildings.reduce((acc, building) => {
        acc[building] = parseIntSafe(planet[building].toString(), 10);
        return acc;
    }, {} as Partial<Record<BuildingType, number>>);

    const buildingsMessage: UpdatePlanetBuildingLevelsMessage = {
        ogameMeta,
        type: MessageType.UpdatePlanetBuildingLevels,
        data: {
            isMoon,
            planetId: planet.id,
            data: buildingLevels,
        },
        senderUuid: empireTrackingUuid,
    };
    sendMessage(buildingsMessage);

    // update ship counts
    const shipCounts = ShipTypes.reduce((acc, ship) => {
        acc[ship] = parseIntSafe(planet[ship].toString(), 10);
        return acc;
    }, {} as Partial<Record<ShipType, number>>);

    const shipCountsMessage: UpdatePlanetShipCountsMessage = {
        ogameMeta,
        type: MessageType.UpdatePlanetShipCounts,
        data: {
            isMoon,
            planetId: planet.id,
            data: shipCounts,
        },
        senderUuid: empireTrackingUuid,
    };
    sendMessage(shipCountsMessage);
}

function trackPlanetLifeformBuildingLevels(planet: OgameEmpirePlanet, ogameMeta: MessageOgameMeta) {
    const lifeformBuildingLevels = LifeformBuildingTypes.reduce((acc, type) => {
        acc[type] = parseIntSafe(planet[type]?.toString() ?? '0', 10); //TODO: remove nullability check when lifeforms live everywhere
        return acc;
    }, {} as Record<LifeformBuildingType, number>);

    const lifeformBuildingsMessages: UpdatePlanetLifeformBuildingLevelsMessage = {
        ogameMeta,
        type: MessageType.UpdatePlanetLifeformBuildingLevels,
        data: {
            isMoon: false,
            planetId: planet.id,
            data: lifeformBuildingLevels,
        },
        senderUuid: empireTrackingUuid,
    };
    sendMessage(lifeformBuildingsMessages);
}

function trackPlanetLifeformTechnologyLevels(planet: OgameEmpirePlanet, ogameMeta: MessageOgameMeta) {
    const lifeformTechLevels = LifeformTechnologyTypes.reduce((acc, type) => {        
        acc[type] = parseIntSafe(planet[type]?.toString() ?? '0', 10); //TODO: remove nullability check when lifeforms live everywhere
        return acc;
    }, {} as Record<LifeformTechnologyType, number>);

    const lifeformTechnologyMessages: UpdatePlanetLifeformTechnologyLevelsMessage = {
        ogameMeta,
        type: MessageType.UpdatePlanetLifeformTechnologyLevels,
        data: {
            isMoon: false,
            planetId: planet.id,
            data: lifeformTechLevels,
        },
        senderUuid: empireTrackingUuid,
    };
    sendMessage(lifeformTechnologyMessages);
}
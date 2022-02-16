import { MessageType } from "../../shared/messages/MessageType";
import { UpdateAllianceClassMessage, UpdatePlanetBuildingLevelsMessage, UpdatePlanetShipCountsMessage, UpdateResearchLevelsMessage } from "../../shared/messages/tracking/empire";
import { BuildingType } from "../../shared/models/v1/ogame/buildings/BuildingType";
import { AllianceClass } from "../../shared/models/v1/ogame/classes/AllianceClass";
import { ResearchType } from "../../shared/models/v1/ogame/research/ResearchType";
import { ShipType } from "../../shared/models/v1/ogame/ships/ShipType";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";
import { parseIntSafe } from "../../shared/utils/parseNumbers";
import { _throw } from "../../shared/utils/_throw";
import { observerCallbacks } from "./main";

export function trackResourceSettingsPage(): void {
    observerCallbacks.push({
        selector: '#inhalt .mainRS',
        callback: element => {
            const planetIdText = (document.querySelector('meta[name="ogame-planet-id"]') as HTMLMetaElement | null)?.content
                ?? _throw('no meta element found for ogame-planet-id');
            const planetId = parseIntSafe(planetIdText, 10);


            const buildingsMessage: UpdatePlanetBuildingLevelsMessage = {
                ogameMeta: getOgameMeta(),
                type: MessageType.UpdatePlanetBuildingLevels,
                data: {
                    planetId, 
                    data: {
                        [BuildingType.metalMine]: getLevelOrAmount(element, BuildingType.metalMine),
                        [BuildingType.crystalMine]: getLevelOrAmount(element, BuildingType.crystalMine),
                        [BuildingType.deuteriumSynthesizer]: getLevelOrAmount(element, BuildingType.deuteriumSynthesizer),
                        [BuildingType.fusionReactor]: getLevelOrAmount(element, BuildingType.fusionReactor),
                        [BuildingType.solarPlant]: getLevelOrAmount(element, BuildingType.solarPlant),
                    },
                },
            };
            chrome.runtime.sendMessage(buildingsMessage);


            const solSatMessage: UpdatePlanetShipCountsMessage = {
                ogameMeta: getOgameMeta(),
                type: MessageType.UpdatePlanetShipCounts,
                data: {
                    planetId,
                    data: {
                        [ShipType.solarSatellite]: getLevelOrAmount(element, ShipType.solarSatellite),
                    },
                },
            };
            chrome.runtime.sendMessage(solSatMessage);
            

            const researchMessage: UpdateResearchLevelsMessage = {
                ogameMeta: getOgameMeta(),
                type: MessageType.UpdateResearchLevels,
                data: {
                    [ResearchType.plasmaTechnology]: getLevelOrAmount(element, ResearchType.plasmaTechnology),
                },
            };
            chrome.runtime.sendMessage(researchMessage);


            const allyClassMessage: UpdateAllianceClassMessage = {
                ogameMeta: getOgameMeta(),
                type: MessageType.UpdateAllianceClass,
                data: getAllianceClass(element),
            };
            chrome.runtime.sendMessage(allyClassMessage);


            //TODO: get production percentages
            _throw('TODO: get production percentages');
        },
    });
}

function getLevelOrAmount(element: Element, id: number): number {
    const label = element.querySelector(`tr[class~="${id}"] .label`)?.textContent ?? _throw(`no label element found for techid ${id}`);
    const regex = /\b(?<level>\d+)\b/;

    const levelText = label.match(regex)?.groups?.level ?? _throw('no level text found');
    const level = parseIntSafe(levelText, 10);

    return level;
}

function getAllianceClass(element: Element): AllianceClass {
    const allianceClassElem = element.querySelector('.allianceclass') ?? _throw('no alliance class found');

    if (allianceClassElem.classList.contains('trader')) {
        return AllianceClass.trader;
    }
    if (allianceClassElem.classList.contains('explorer')) {
        return AllianceClass.researcher;
    }
    if (allianceClassElem.classList.contains('warrior')) {
        return AllianceClass.warrior;
    }

    return AllianceClass.none;
}

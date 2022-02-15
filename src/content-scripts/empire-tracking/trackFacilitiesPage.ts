import { _throw } from "../../shared/utils/_throw";
import { observerCallbacks } from "./main";
import { BuildingType } from '../../shared/models/v1/ogame/buildings/BuildingType';
import { parseIntSafe } from "../../shared/utils/parseNumbers";
import { UpdatePlanetBuildingLevelsMessage } from "../../shared/messages/tracking/empire";
import { MessageType } from "../../shared/messages/MessageType";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";

export function trackFacilitiesPage() {
    observerCallbacks.push({
        selector: '#technologies > .icons',
        callback: element => {
            const planetIdText = (document.querySelector('meta[name="ogame-planet-id"]') as HTMLMetaElement | null)?.content
                ?? _throw('no meta element found for ogame-planet-id');
            const planetId = parseIntSafe(planetIdText, 10);

            const planetType = (document.querySelector('meta[name="ogame-planet-type"]') as HTMLMetaElement | null)?.content
                ?? _throw('did not find meta ogame-planet-type');
            const isMoon = planetType == 'moon';

            const buildingTypes = isMoon
                ? [
                    BuildingType.roboticsFactory,
                    BuildingType.shipyard,
                    BuildingType.lunarBase,
                    BuildingType.sensorPhalanx,
                    BuildingType.jumpGate,
                ] : [
                    BuildingType.roboticsFactory,
                    BuildingType.shipyard,
                    BuildingType.researchLab,
                    BuildingType.allianceDepot,
                    BuildingType.missileSilo,
                    BuildingType.naniteFactory,
                    BuildingType.terraformer,
                    BuildingType.spaceDock,
                ];
            const buildingLevels = {} as Partial<Record<BuildingType, number>>;

            buildingTypes.forEach(building => {
                const levelText = element.querySelector(`[data-technology="${building}"] .level`)?.getAttribute('data-value')
                    ?? _throw(`did not find level of building '${BuildingType[building]}'`);
                const level = parseIntSafe(levelText, 10);

                buildingLevels[building] = level;
            });

            const message: UpdatePlanetBuildingLevelsMessage = {
                ogameMeta: getOgameMeta(),
                type: MessageType.UpdatePlanetBuildingLevels,
                data: {
                    planetId,
                    data: buildingLevels,
                },
            };
            chrome.runtime.sendMessage(message);
        },
    });
}
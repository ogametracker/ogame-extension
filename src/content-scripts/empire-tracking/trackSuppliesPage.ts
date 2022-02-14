import { MessageType } from "../../shared/messages/MessageType";
import { UpdatePlanetBuildingLevelsMessage, UpdatePlanetShipCountsMessage } from "../../shared/messages/tracking/empire";
import { BuildingType } from "../../shared/models/v1/ogame/buildings/BuildingType";
import { ShipType } from "../../shared/models/v1/ogame/ships/ShipType";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";
import { parseIntSafe } from "../../shared/utils/parseNumbers";
import { _throw } from "../../shared/utils/_throw";
import { observerCallbacks } from "./main";

export function trackSuppliesPage() {
    observerCallbacks.push({
        selector: '#producers',
        callback: element => {
            const planetType = (document.querySelector('meta[name="ogame-planet-type"]') as HTMLMetaElement | null)?.content
                ?? _throw('did not find meta ogame-planet-type');
            const isMoon = planetType == 'moon';
            if (isMoon) {
                return;
            }

            const buildingTypes = [
                BuildingType.metalMine,
                BuildingType.metalStorage,
                BuildingType.crystalMine,
                BuildingType.crystalStorage,
                BuildingType.deuteriumSynthesizer,
                BuildingType.deuteriumTank,
                BuildingType.solarPlant,
                BuildingType.fusionReactor,
            ];
            const buildingLevels = {} as Partial<Record<BuildingType, number>>;

            buildingTypes.forEach(building => {
                const levelText = element.querySelector(`[data-technology="${building}"] .level`)?.getAttribute('data-value')
                    ?? _throw(`did not find level of building '${BuildingType[building]}'`);
                const level = parseIntSafe(levelText, 10);

                buildingLevels[building] = level;
            });

            const buildingsMessage: UpdatePlanetBuildingLevelsMessage = {
                ogameMeta: getOgameMeta(),
                type: MessageType.UpdatePlanetBuildingLevels,
                data: buildingLevels,
            };
            chrome.runtime.sendMessage(buildingsMessage);



            const shipTypes = [ ShipType.solarSatellite, ShipType.crawler];
            const shipCounts = {} as Partial<Record<ShipType, number>>;
            shipTypes.forEach(ship => {
                const amountText = element.querySelector(`[data-technology="${ship}"] .amount`)?.getAttribute('data-value')
                    ?? _throw(`did not find amount of ship '${ShipType[ship]}'`);
                const amount = parseIntSafe(amountText, 10);

                shipCounts[ship] = amount;
            });

            const shipMessage: UpdatePlanetShipCountsMessage = {
                ogameMeta: getOgameMeta(),
                type: MessageType.UpdatePlanetShipCounts,
                data: shipCounts,
            };
            chrome.runtime.sendMessage(shipMessage);
        },
    });
}
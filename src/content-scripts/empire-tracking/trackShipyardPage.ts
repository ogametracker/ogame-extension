import { MessageType } from "../../shared/messages/MessageType";
import { UpdatePlanetShipCountsMessage } from "../../shared/messages/tracking/empire";
import { ShipType } from "../../shared/models/v1/ogame/ships/ShipType";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";
import { getNumericEnumValues } from "../../shared/utils/getNumericEnumValues";
import { parseIntSafe } from "../../shared/utils/parseNumbers";
import { _throw } from "../../shared/utils/_throw";
import { observerCallbacks } from "./main";

export function trackShipyardPage() {
    observerCallbacks.push({
        selector: '#technologies',
        callback: element => {
            const shipTypes = getNumericEnumValues<ShipType>(ShipType);
            const shipCounts = {} as Record<ShipType, number>;

            shipTypes.forEach(ship => {
                const amountText = element.querySelector(`[data-technology="${ship}"] .amount`)?.getAttribute('data-value')
                    ?? _throw(`did not find amount of ship '${ShipType[ship]}'`);

                const amount = parseIntSafe(amountText, 10);
                shipCounts[ship] = amount;
            });

            const message: UpdatePlanetShipCountsMessage = {
                ogameMeta: getOgameMeta(),
                type: MessageType.UpdatePlanetShipCounts,
                data: shipCounts,
            };
            chrome.runtime.sendMessage(message);
        },
    });
}
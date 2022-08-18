import { sendMessage } from "@/shared/communication/sendMessage";
import { createRecord } from "@/shared/utils/createRecord";
import { empireTrackingUuid } from "@/shared/uuid";
import { MessageType } from "../../shared/messages/MessageType";
import { UpdatePlanetShipCountsMessage } from "../../shared/messages/tracking/empire";
import { ShipType } from "../../shared/models/ogame/ships/ShipType";
import { NonStationaryShipTypes } from "../../shared/models/ogame/ships/ShipTypes";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";
import { parseIntSafe } from "../../shared/utils/parseNumbers";
import { _throw } from "../../shared/utils/_throw";
import { observerCallbacks } from "./main";

export function trackFleetDispatchPage(): void {
    observerCallbacks.push({
        selector: '#technologies',
        callback: element => {
            const planetIdText = (document.querySelector('meta[name="ogame-planet-id"]') as HTMLMetaElement | null)?.content
                ?? _throw('no meta element found for ogame-planet-id');
            const planetId = parseIntSafe(planetIdText, 10);

            const planetType = (document.querySelector('meta[name="ogame-planet-type"]') as HTMLMetaElement | null)?.content
                ?? _throw('did not find meta ogame-planet-type');
            const isMoon = planetType == 'moon';

            const shipCounts = createRecord(NonStationaryShipTypes, 0);

            NonStationaryShipTypes.forEach(ship => {
                const amountText = element.querySelector(`[data-technology="${ship}"] .amount`)?.getAttribute('data-value')
                    ?? _throw(`did not find amount of ship '${ShipType[ship]}'`);

                const amount = parseIntSafe(amountText, 10);
                shipCounts[ship] = amount;
            });

            const message: UpdatePlanetShipCountsMessage = {
                ogameMeta: getOgameMeta(),
                type: MessageType.UpdatePlanetShipCounts,
                data: {
                    isMoon,
                    planetId,
                    data: shipCounts,
                },
                senderUuid: empireTrackingUuid,
            };
            sendMessage(message);
        },
    });
}
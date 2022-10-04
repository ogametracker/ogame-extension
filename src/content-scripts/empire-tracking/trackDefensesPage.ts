import { _throw } from "../../shared/utils/_throw";
import { observerCallbacks } from "./main";
import { DefenseType } from '../../shared/models/ogame/defenses/DefenseType';
import { DefenseTypes } from '../../shared/models/ogame/defenses/DefenseTypes';
import { parseIntSafe } from "../../shared/utils/parseNumbers";
import { UpdatePlanetDefenseCountsMessage, UpdatePlanetMissileCountsMessage } from "../../shared/messages/tracking/empire";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";
import { MessageType } from "../../shared/messages/MessageType";
import { sendMessage } from "@/shared/communication/sendMessage";
import { empireTrackingUuid } from "@/shared/uuid";
import { createRecord } from "@/shared/utils/createRecord";
import { MissileTypes } from "@/shared/models/ogame/missiles/MissileTypes";
import { MissileType } from "@/shared/models/ogame/missiles/MissileType";

export function trackDefensesPage() {
    observerCallbacks.push({
        selector: '#technologies > .icons',
        callback: element => {
            const planetIdText = (document.querySelector('meta[name="ogame-planet-id"]') as HTMLMetaElement | null)?.content
                ?? _throw('no meta element found for ogame-planet-id');
            const planetId = parseIntSafe(planetIdText, 10);

            const planetType = (document.querySelector('meta[name="ogame-planet-type"]') as HTMLMetaElement | null)?.content
                ?? _throw('did not find meta ogame-planet-type');
            const isMoon = planetType == 'moon';

            const defenseCounts = createRecord(DefenseTypes, 0);
            DefenseTypes.forEach(defense => {
                const amountText = element.querySelector(`[data-technology="${defense}"] .amount`)?.getAttribute('data-value')
                    ?? _throw(`did not find amount of defense '${DefenseType[defense]}'`);

                const amount = parseIntSafe(amountText, 10);
                defenseCounts[defense] = amount;
            });

            const defenseMessage: UpdatePlanetDefenseCountsMessage = {
                ogameMeta: getOgameMeta(),
                type: MessageType.UpdatePlanetDefenseCounts,
                data: {
                    isMoon,
                    planetId,
                    data: {
                        ...defenseCounts,
                        [DefenseType.smallShieldDome]: defenseCounts[DefenseType.smallShieldDome] > 0,
                        [DefenseType.largeShieldDome]: defenseCounts[DefenseType.largeShieldDome] > 0,
                    },
                },
                senderUuid: empireTrackingUuid,
            };
            sendMessage(defenseMessage);


            const missileCounts = createRecord(MissileTypes, 0);
            MissileTypes.forEach(missile => {
                const amountText = element.querySelector(`[data-technology="${missile}"] .amount`)?.getAttribute('data-value')
                    ?? _throw(`did not find amount of missile '${MissileType[missile]}'`);

                const amount = parseIntSafe(amountText, 10);
                missileCounts[missile] = amount;
            });

            const missileMessage: UpdatePlanetMissileCountsMessage = {
                ogameMeta: getOgameMeta(),
                type: MessageType.UpdatePlanetMissileCounts,
                data: {
                    isMoon,
                    planetId,
                    data: missileCounts,
                },
                senderUuid: empireTrackingUuid,
            };
            sendMessage(missileMessage);
        },
    });
}
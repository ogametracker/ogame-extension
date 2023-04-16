import { observerCallbacks } from "./main";
import { _throw } from "../../shared/utils/_throw";
import { UpdateLifeformExperienceMessage } from "../../shared/messages/tracking/empire";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";
import { MessageType } from "../../shared/messages/MessageType";
import { sendMessage } from "@/shared/communication/sendMessage";
import { empireTrackingUuid } from "@/shared/uuid";
import { LifeformType, ValidLifeformTypes } from "@/shared/models/ogame/lifeforms/LifeformType";
import { parseIntSafe } from "@/shared/utils/parseNumbers";
import { getLifeformExperienceNeededForLevel } from "@/shared/models/ogame/lifeforms/experience";

export function trackLifeformSettingsPage() {
    observerCallbacks.push({
        selector: '#technologies',
        callback: element => {

            const lifeformExperience: Partial<Record<LifeformType, number>> = {};
            const index: Record<LifeformType, number> = {
                [LifeformType.none]: 0,
                [LifeformType.humans]: 1,
                [LifeformType.rocktal]: 2,
                [LifeformType.mechas]: 3,
                [LifeformType.kaelesh]: 4,
            };
            ValidLifeformTypes.forEach(lifeform => {
                const selector = `.lifeform${index[lifeform]} + .levelinformation > .xpbar`;
                const elem = element.querySelector(selector);
                if(elem == null) {
                    return;
                }

                const title = elem.getAttribute('title') ?? _throw('no experience title found');
                const match = title.match(/\s*(?<level>\d+)[^\d]*:\s+(?<exp>[^\s]+)\/\d/i);
                
                const levelText = match?.groups?.level.replace(/[^\d]/g, '') ?? _throw('no level match');
                const level = parseIntSafe(levelText, 10);

                const currentExpText = match?.groups?.exp.replace(/[^\d]/g, '') ?? _throw('no exp match');
                const currentExp = parseIntSafe(currentExpText, 10);

                const exp = getLifeformExperienceNeededForLevel(level) + currentExp;
                
                lifeformExperience[lifeform] = exp;
            });

            const message: UpdateLifeformExperienceMessage = {
                ogameMeta: getOgameMeta(),
                type: MessageType.UpdateLifeformExperience,
                data: lifeformExperience,
                senderUuid: empireTrackingUuid,
            };
            sendMessage(message);
        },
    });
}
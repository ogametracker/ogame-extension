import { LifeformType, ValidLifeformTypes } from "@/shared/models/ogame/lifeforms/LifeformType";
import { observerCallbacks } from "./main";
import { _throw } from "@/shared/utils/_throw";
import { parseIntSafe } from "@/shared/utils/parseNumbers";
import { getLifeformExperienceNeededForLevel } from "@/shared/models/ogame/lifeforms/experience";
import { UpdateLifeformExperienceMessage, UpdatePlanetActiveLifeformTechnologyLevelsMessage } from "@/shared/messages/tracking/empire";
import { getOgameMeta } from "@/shared/ogame-web/getOgameMeta";
import { MessageType } from "@/shared/messages/MessageType";
import { empireTrackingUuid } from "@/shared/uuid";
import { sendMessage } from "@/shared/communication/sendMessage";
import { LifeformTechnologyType } from "@/shared/models/ogame/lifeforms/LifeformTechnologyType";

export function trackLifeformBonusesPage() {
    observerCallbacks.push({
        selector: '#lfbonusescomponent',
        callback: element => {
            updateLifeformExperience(element);
            updateActiveLifeformResearchSlots(element);
        },
    });
}

function updateActiveLifeformResearchSlots(element: Element) {
    const selectedResearchesPerPlanet: Record<number, Partial<Record<LifeformTechnologyType, number>>> = {};

    const bonusElements = element.querySelectorAll('lifeform-technology-bonuses bonus-item-content[data-toggable-target]');
    for(const bonusElement of bonusElements) {
        const targetText = bonusElement.getAttribute('data-toggable-target') ?? _throw('missing data-toggable-target');
        if(!/^\d+$/.test(targetText)) {
            continue;
        }

        const planetId = parseIntSafe(targetText);
        const planetSelection = (selectedResearchesPerPlanet[planetId] ??= {});

        const slotElements = bonusElement.querySelectorAll('bonus-item-content-holder > space-object-technology:not(space-object-technology:first-of-type)');    
        for(const slotElement of slotElements) {
            const levelText = slotElement.querySelector(':scope > space-object-technology-item:nth-of-type(2)')?.textContent ?? _throw('missing research level');
            const level = parseIntSafe(levelText);

            const techIdText = [...slotElement.querySelector(':scope technology-icon')?.attributes ?? []]
                .map(attr => attr.name.match(/^lifeformtech(?<id>\d+)$/)?.groups?.id)
                .find(id => id != null)
                ?? _throw('missing research id');
            const techId = parseIntSafe(techIdText) as LifeformTechnologyType;

            planetSelection[techId] = level;
        }
    }

    for(const [planetId, technologyLevels] of Object.entries(selectedResearchesPerPlanet)) {
        const message: UpdatePlanetActiveLifeformTechnologyLevelsMessage = {
            ogameMeta: getOgameMeta(),
            type: MessageType.UpdatePlanetActiveLifeformTechnologyLevels,
            data: {
                isMoon: false,
                planetId: parseIntSafe(planetId),
                data: technologyLevels,
            },
            senderUuid: empireTrackingUuid,
        };
        sendMessage(message);
    }
}

function updateLifeformExperience(element: Element) {
    const lifeformExperience: Partial<Record<LifeformType, number>> = {};
    const index: Record<LifeformType, number> = {
        [LifeformType.none]: 0,
        [LifeformType.humans]: 1,
        [LifeformType.rocktal]: 2,
        [LifeformType.mechas]: 3,
        [LifeformType.kaelesh]: 4,
    };
    ValidLifeformTypes.forEach(lifeform => {
        const selector = `.lifeform${index[lifeform]} + .xpHolder > .xpbar`;
        const elem = element.querySelector(selector);
        if(elem == null) {
            return;
        }
        const title = elem.getAttribute('data-tooltip-title') ?? _throw('no experience title found');
        const match = title.match(/\s*(?<level>\d+)[^\d]*:?\s*(?<exp>[^\s\/]*)\/?\d?/i);
        
        const levelText = match?.groups?.level.replace(/[^\d]/g, '') 
            ?? elem.querySelector('.currentlevel')?.textContent?.trim()
            ?? _throw('no level match');
        const level = parseIntSafe(levelText, 10);

        let currentExp = 0;
        if(level < 100) {
            const currentExpText = match?.groups?.exp.replace(/[^\d]/g, '') ?? _throw('no exp match');
            currentExp = parseIntSafe(currentExpText, 10);
        }
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
}
import { LifeformTranslations } from "./types";
import { LifeformType } from "@/shared/models/ogame/lifeforms/LifeformType";

export const cs: LifeformTranslations = {
    [LifeformType.none]: 'Žádné formy života',
    [LifeformType.humans]: 'Lidé',
    [LifeformType.rocktal]: 'Rock\'talové',
    [LifeformType.mechas]: 'Mechani',
    [LifeformType.kaelesh]: 'Kaeleshi',
};
import { LifeformType } from "@/shared/models/ogame/lifeforms/LifeformType";
import { LifeformTranslations } from "./types";

export const sk: LifeformTranslations = {
    [LifeformType.none]: 'Žiadne formy života',
    [LifeformType.humans]: 'Ľudia',
    [LifeformType.rocktal]: 'Kameňáci',
    [LifeformType.mechas]: 'Mechanovia',
    [LifeformType.kaelesh]: 'Kaelešovia',
};
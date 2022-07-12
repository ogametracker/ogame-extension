import { LifeformType } from "@/shared/models/ogame/lifeforms/LifeformType";
import { _throw } from "@/shared/utils/_throw";

export function getActiveLifeform() {
    const element = document.querySelector('#lifeform') ?? _throw('did not find active lifeform element');
    const classDiv = element.querySelector('div.lifeform-item-icon') ?? _throw('no lifeform icon found');

    if (classDiv.classList.contains('lifeform1')) {
        return LifeformType.humans;
    } else if (classDiv.classList.contains('lifeform2')) {
        return LifeformType.rocktal;
    } else if (classDiv.classList.contains('lifeform3')) {
        return LifeformType.mechas;
    } else if (classDiv.classList.contains('lifeform4')) {
        return LifeformType.kaelesh;
    }

    return LifeformType.none;
}
import { _throw } from "../../shared/utils/_throw";
import { observerCallbacks } from "./main";
import { PlayerOfficers } from "../../shared/models/v1/empire/PlayerOfficers";

export function trackOfficers() {
    observerCallbacks.push({
        selector: '#officers',
        callback: element => {
            const commander = element.querySelector('.commander')?.classList.contains('on') ?? _throw('no commander found');
            const admiral = element.querySelector('.admiral')?.classList.contains('on') ?? _throw('no admiral found');
            const engineer = element.querySelector('.engineer')?.classList.contains('on') ?? _throw('no engineer found');
            const geologist = element.querySelector('.geologist')?.classList.contains('on') ?? _throw('no geologist found');
            const technocrat = element.querySelector('.technocrat')?.classList.contains('on') ?? _throw('no technocrat found');

            const officers: PlayerOfficers = {
                commander,
                admiral,
                engineer,
                geologist,
                technocrat,
            };
            //TODO: send message with updated officers
            _throw('TODO: send message with updated officers', officers);
        },
    });
}
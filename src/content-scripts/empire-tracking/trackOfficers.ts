import { _throw } from "../../shared/utils/_throw";
import { observerCallbacks } from "./main";
import { PlayerOfficers } from "../../shared/models/empire/PlayerOfficers";
import { UpdateActiveOfficersMessage } from "../../shared/messages/tracking/empire";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";
import { MessageType } from "../../shared/messages/MessageType";
import { sendMessage } from "@/shared/communication/sendMessage";

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

            const message: UpdateActiveOfficersMessage = {
                ogameMeta: getOgameMeta(),
                type: MessageType.UpdateActiveOfficers,
                data: officers,
            };
            sendMessage(message);
        },
    });
}
import { PlayerOfficers } from "../../empire/PlayerOfficers";

export function hasCommandStaff(officers: PlayerOfficers) {
    return officers.admiral
        && officers.commander
        && officers.engineer
        && officers.geologist
        && officers.technocrat;
}
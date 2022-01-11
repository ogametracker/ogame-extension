import { TrackExpeditionMessage } from "../shared/messages/tracking/TrackExpeditionMessage";
import { ExpeditionEvent } from "../shared/models/v1/expeditions/ExpeditionEvents";
import { RawExpeditionData } from "../shared/models/v1/expeditions/RawExpeditionData";
import { TryActionResult } from "../shared/TryActionResult";

export class ExpeditionModule {
    public tryTrackExpedition(message: TrackExpeditionMessage): TryActionResult<X> {
        //TODO: check if known => if true, return existing result

        //TODO: parse result
        //TODO: save result (chrome.storage)
        //TODO: return result
    }

    private parseExpedition(data: RawExpeditionData): ExpeditionEvent {
        //TODO: parse expo
    }
}
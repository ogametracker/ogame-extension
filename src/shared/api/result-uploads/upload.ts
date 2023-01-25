import { apiBaseUrl } from "../constants";
import { ApiBatchResultResponse, ApiExpeditionResult, ApiResultResponse } from "./models";

export async function uploadExpeditions(expedition: ApiExpeditionResult): Promise<ApiBatchResultResponse> {
    try {
        const ok: ApiResultResponse = await fetch(`${apiBaseUrl}/result/expedition`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(expedition),
        }).then(res => res.json());

        return {
            ok: [ok],
            invalid: [],
        };
    }
    catch {
        return {
            ok: [],
            invalid: [{
                serverId: expedition.serverId,
                language: expedition.language,
                messageId: expedition.messageId,
            }],
        };
    }
}

export async function batchUploadExpeditions(expeditions: ApiExpeditionResult[]): Promise<ApiBatchResultResponse> {
    try {
        return await fetch(`${apiBaseUrl}/result/expedition/batch`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(expeditions),
        }).then(res => res.json());
    }
    catch {
        return {
            ok: [],
            invalid: expeditions.map<ApiResultResponse>(e => ({
                serverId: e.serverId,
                language: e.language,
                messageId: e.messageId,
            })),
        };
    }
}


    //TODO: handle 400/invalid ids
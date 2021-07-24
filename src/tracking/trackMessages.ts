import { QueryParameters } from "@/utils/getQueryParameters";
import readBattles from "./readBattles";
import readExpeditions from "./readExpeditions";
import readDebrisFields from "./readDebrisFields";

export default function startMessageTracking(queryParams: QueryParameters) {
    if (queryParams.has('page', 'messages')) {
        trackMessages();
    }
}

async function trackMessages() {
    await readExpeditions();
    await readBattles();
    await readDebrisFields();

    requestAnimationFrame(trackMessages);
}
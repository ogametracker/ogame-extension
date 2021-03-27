import getQueryParameters from "@/utils/getQueryParameters";
import readBattles from "./readBattles";
import readExpeditions from "./readExpeditions";
import readDebrisFields from "./readDebrisFields";

export default function startMessageTracking() {
    const queryParams = getQueryParameters(window.location);
    if (queryParams.some(param => param.key == 'page' && param.value == 'messages')) {
        trackMessages();
    }
}

async function trackMessages() {
    await readExpeditions();
    await readBattles();
    await readDebrisFields();

    requestAnimationFrame(trackMessages);
}
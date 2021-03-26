import getQueryParameters from "@/utils/getQueryParameters";
import readBattles from "./readBattles";
import readExpeditions from "./readExpeditions";
import readWreckfields from "./readWreckfields";

export default function startMessageTracking() {
    const queryParams = getQueryParameters(window.location);
    if (queryParams.some(param => param.key == 'page' && param.value == 'messages')) {
        trackMessages();
    }
}

async function trackMessages() {
    await readExpeditions();
    await readBattles();
    await readWreckfields();

    requestAnimationFrame(trackMessages);
}
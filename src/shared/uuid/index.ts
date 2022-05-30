import { v5 } from "uuid";

export const namespace = '774522d3-7912-4e5c-b55b-e17198620b32';

export const serviceWorkerUuid = v5('service-worker', namespace);
export const messageTrackingUuid = v5('message-tracking', namespace);
export const empireTrackingUuid = v5('empire-tracking', namespace);
export const internalUuid = v5('internal', namespace);
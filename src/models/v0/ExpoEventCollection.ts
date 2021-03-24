import ExpoEventv0 from "./ExpoEvent";

export default interface ExpoEventCollectionv0 {
    [key: string]: ExpoEventv0;
    [key: number]: ExpoEventv0;
};
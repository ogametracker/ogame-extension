import ExpoEvent from "./ExpoEvent";

export default interface ExpoEventCollection {
    [key: string]: ExpoEvent;
    [key: number]: ExpoEvent;
};
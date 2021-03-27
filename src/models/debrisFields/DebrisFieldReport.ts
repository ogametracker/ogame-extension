import Resource from "../Resource";

export default interface DebrisFieldReport {
    date: number;
    id: number;
    [Resource.metal]: number;
    [Resource.crystal]: number;
}
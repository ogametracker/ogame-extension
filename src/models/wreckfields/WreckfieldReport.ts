import Resource from "../Resource";

export default interface WreckfieldReport {
    date: number;
    id: number;
    [Resource.metal]: number;
    [Resource.crystal]: number;
}
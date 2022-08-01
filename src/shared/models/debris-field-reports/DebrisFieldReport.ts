import { ResourceType } from '../ogame/resources/ResourceType';

export interface DebrisFieldReport {
    date: number;
    id: number;
    [ResourceType.metal]: number;
    [ResourceType.crystal]: number;
    
    isExpeditionDebrisField?: boolean;
}
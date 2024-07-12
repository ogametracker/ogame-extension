import { LifeformDiscoveryEvent } from '@/shared/models/lifeform-discoveries/LifeformDiscoveryEvent';
import { Message } from '../Message';
import { MessageType } from '../MessageType';

export interface RawLifeformDiscoveryMessageData {
    id: number;
    date: number;
    discoveryType: string;
    alreadyFound?: boolean;
    artifactsFound?: number;
    artifactsSize?: string;
    lifeform?: string
    lifeformExp?: number;
}

export type TrackLifeformDiscoveryMessage = Message<MessageType.TrackLifeformDiscovery, RawLifeformDiscoveryMessageData>;
export type LifeformDiscoveryMessage = Message<MessageType.LifeformDiscovery, LifeformDiscoveryEvent>;
export type NewLifeformDiscoveryMessage = Message<MessageType.NewLifeformDiscovery, LifeformDiscoveryEvent>;
import { LifeformDiscoveryEvent } from '@/shared/models/lifeform-discoveries/LifeformDiscoveryEvent';
import { Message } from '../Message';
import { MessageType } from '../MessageType';
import { RawMessageData } from './common';

export type TrackLifeformDiscoveryMessage = Message<MessageType.TrackLifeformDiscovery, RawMessageData>;
export type LifeformDiscoveryMessage = Message<MessageType.LifeformDiscovery, LifeformDiscoveryEvent>;
export type NewLifeformDiscoveryMessage = Message<MessageType.NewLifeformDiscovery, LifeformDiscoveryEvent>;
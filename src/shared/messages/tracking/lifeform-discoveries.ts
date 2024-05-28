import { LifeformDiscoveryEvent } from '@/shared/models/lifeform-discoveries/LifeformDiscoveryEvent';
import { Message } from '../Message';
import { MessageType } from '../MessageType';
import { RawLifeformDiscoveryMessageData } from './common';

export type TrackLifeformDiscoveryMessage = Message<MessageType.TrackLifeformDiscovery, RawLifeformDiscoveryMessageData>;
export type LifeformDiscoveryMessage = Message<MessageType.LifeformDiscovery, LifeformDiscoveryEvent>;
export type NewLifeformDiscoveryMessage = Message<MessageType.NewLifeformDiscovery, LifeformDiscoveryEvent>;
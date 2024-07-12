import { LifeformDiscoveryEvent } from '@/shared/models/lifeform-discoveries/LifeformDiscoveryEvent';
import { Message } from '../Message';
import { MessageType } from '../MessageType';
import { OgameRawArtifactFindSize } from '@/shared/models/ogame/messages/OgameRawArtifactFindSize';
import { OgameRawLifeformDiscoveryType } from '@/shared/models/ogame/messages/OgameRawLifeformDiscoveryType';
import { OgameRawLifeformType } from '@/shared/models/ogame/messages/OgameRawLifeformType';

export interface RawLifeformDiscoveryMessageData {
    id: number;
    date: number;
    type: OgameRawLifeformDiscoveryType;
    artifactsFound?: number;
    artifactsSize?: OgameRawArtifactFindSize;
    isNewLifeform?: boolean;
    lifeform?: OgameRawLifeformType;
    lifeformExperience?: number;
}

export type TrackLifeformDiscoveryMessage = Message<MessageType.TrackLifeformDiscovery, RawLifeformDiscoveryMessageData>;
export type LifeformDiscoveryMessage = Message<MessageType.LifeformDiscovery, LifeformDiscoveryEvent>;
export type NewLifeformDiscoveryMessage = Message<MessageType.NewLifeformDiscovery, LifeformDiscoveryEvent>;
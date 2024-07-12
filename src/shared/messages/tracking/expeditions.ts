import { OgameRawExpeditionDepletionLevel } from '@/shared/models/ogame/messages/OgameRawExpeditionDepletionLevel';
import { ExpeditionEvent, ExpeditionFindableShipType } from '../../models/expeditions/ExpeditionEvents';
import { Message } from '../Message';
import { MessageType } from '../MessageType';
import { OgameRawExpeditionResultType } from '@/shared/models/ogame/messages/OgameRawExpeditionResultType';
import { OgameRawExpeditionSize } from '@/shared/models/ogame/messages/OgameRawExpeditionSize';
import { Coordinates } from '@/shared/models/ogame/common/Coordinates';
import { ItemHash } from '@/shared/models/ogame/items/ItemHash';

export interface RawExpeditionMessageData {
    id: number;
    date: number;
    coordinates: Coordinates;
    type: OgameRawExpeditionResultType;
    depletion?: OgameRawExpeditionDepletionLevel;
    size?: OgameRawExpeditionSize;
    resources?: Partial<Record<'metal' | 'crystal' | 'deuterium', number>>;
    darkMatter?: number;
    ships?: Partial<Record<ExpeditionFindableShipType, number>>;
    item?: ItemHash;
    navigationType?: 'early' | 'delay';
}

export type TrackExpeditionMessage = Message<MessageType.TrackExpedition, RawExpeditionMessageData>;
export type ExpeditionMessage = Message<MessageType.Expedition, ExpeditionEvent>;
export type NewExpeditionMessage = Message<MessageType.NewExpedition, ExpeditionEvent>;
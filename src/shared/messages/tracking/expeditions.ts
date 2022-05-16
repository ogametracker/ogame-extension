import { ExpeditionEvent } from '../../models/expeditions/ExpeditionEvents';
import { Message, NoDataMessage } from '../Message';
import { MessageType } from '../MessageType';
import { RawMessageData } from './common';

export type TrackExpeditionMessage = Message<MessageType.TrackExpedition, RawMessageData>;
export type ExpeditionMessage = Message<MessageType.Expedition, ExpeditionEvent>;
export type NewExpeditionMessage = Message<MessageType.NewExpedition, ExpeditionEvent>;
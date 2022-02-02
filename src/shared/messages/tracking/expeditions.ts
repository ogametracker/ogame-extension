import { ExpeditionEvent } from "../../models/v1/expeditions/ExpeditionEvents";
import { RawExpeditionData } from "../../models/v1/expeditions/RawExpeditionData";
import { Message, NoDataMessage } from "../Message";
import { MessageType } from "../MessageType";

export type TrackExpeditionMessage = Message<MessageType.TrackExpedition, RawExpeditionData>;
export type RequestExpeditionEventsMessage = NoDataMessage<MessageType.RequestExpeditionEvents>;
export type ExpeditionMessage = Message<MessageType.Expedition, ExpeditionEvent>;
export type AllExpeditionsMessage = Message<MessageType.AllExpeditions, ExpeditionEvent[]>;
export type NewExpeditionMessage = Message<MessageType.NewExpedition, ExpeditionEvent>;
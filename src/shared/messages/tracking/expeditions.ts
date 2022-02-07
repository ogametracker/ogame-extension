import { ExpeditionEvent } from "../../models/v1/expeditions/ExpeditionEvents";
import { Message, NoDataMessage } from "../Message";
import { MessageType } from "../MessageType";
import { RawMessageData } from "./common";

export type TrackExpeditionMessage = Message<MessageType.TrackExpedition, RawMessageData>;
export type RequestExpeditionEventsMessage = NoDataMessage<MessageType.RequestExpeditionEvents>;
export type ExpeditionMessage = Message<MessageType.Expedition, ExpeditionEvent>;
export type AllExpeditionsMessage = Message<MessageType.AllExpeditions, ExpeditionEvent[]>;
export type NewExpeditionMessage = Message<MessageType.NewExpedition, ExpeditionEvent>;
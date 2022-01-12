import { ExpeditionEvent } from "../../models/v1/expeditions/ExpeditionEvents";
import { RawExpeditionData } from "../../models/v1/expeditions/RawExpeditionData";
import { Message } from "../Message";
import { MessageType } from "../MessageType";

export type TrackExpeditionMessage = Message<MessageType.TrackExpedition, RawExpeditionData>;
export type ExpeditionEventMessage = Message<MessageType.ExpeditionEvent, ExpeditionEvent>;
export type NewExpeditionEventMessage = Message<MessageType.NewExpeditionEvent, ExpeditionEvent>;
export type RequestExpeditionEventsMessage = Message<MessageType.RequestExpeditionEvents, undefined>;
export type AllExpeditionEventsMessage = Message<MessageType.AllExpeditionEvents, ExpeditionEvent[]>;
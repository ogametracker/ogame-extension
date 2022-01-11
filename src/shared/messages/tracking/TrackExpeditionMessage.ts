import { RawExpeditionData } from "../../models/v1/expeditions/RawExpeditionData";
import { Message } from "../Message";
import { MessageType } from "../MessageType";

export type TrackExpeditionMessage = Message<MessageType.TrackExpedition, RawExpeditionData>;
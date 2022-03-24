import { NoDataMessage } from "../messages/Message";
import { MessageType } from "../messages/MessageType";
import { ignoreStupidMessagePortErrors } from "./ignoreStupidMessagePortErrors";

export function sendMessage<T extends NoDataMessage<MessageType>>(message: T) {
    chrome.runtime.sendMessage(message, ignoreStupidMessagePortErrors);
}
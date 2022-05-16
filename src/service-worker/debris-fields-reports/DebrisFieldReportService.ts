import { Message, MessageOgameMeta } from '../../shared/messages/Message';
import { MessageType } from '../../shared/messages/MessageType';
import { _throw } from '../../shared/utils/_throw';
import { MessageService } from '../MessageService';
import { DebrisFieldReportModule } from './DebrisFieldReportModule';
import { broadcastMessage } from '../../shared/communication/broadcastMessage';
import { DebrisFieldReportMessage, NewDebrisFieldReportMessage, TrackDebrisFieldReportMessage, TrackManualDebrisFieldReportMessage } from '../../shared/messages/tracking/debris-fields';
import { WillNotBeTrackedMessage } from '../../shared/messages/tracking/misc';

export class DebrisFieldReportService implements MessageService {
    private readonly dfModule = new DebrisFieldReportModule();

    public async onMessage(message: Message<MessageType, any>): Promise<void> {
        switch (message.type) {
            case MessageType.TrackDebrisFieldReport: {
                const msg = message as TrackDebrisFieldReportMessage;
                const tryResult = await this.dfModule.tryTrackDebrisFieldReport(msg);
                if (!tryResult.success) {
                    _throw('failed to track expedition');
                }

                if(tryResult.result.ignored) {
                    const ignoreMessage: WillNotBeTrackedMessage = {
                        ogameMeta: message.ogameMeta,
                        type: MessageType.WillNotBeTracked,
                        data: msg.data.id,
                    };
                    await broadcastMessage(ignoreMessage);
                    break;
                }

                const { report, isAlreadyTracked } = tryResult.result;

                // broadcast "new df report available"
                if (!isAlreadyTracked) {
                    const newDfReportMessage: NewDebrisFieldReportMessage = {
                        ogameMeta: message.ogameMeta,
                        type: MessageType.NewDebrisFieldReport,
                        data: report,
                    };
                    await broadcastMessage(newDfReportMessage);
                }
                // send data of the specific expedition
                else {
                    const dfReportMessage: DebrisFieldReportMessage = {
                        ogameMeta: message.ogameMeta,
                        type: MessageType.DebrisFieldReport,
                        data: report,
                    };
                    await broadcastMessage(dfReportMessage);
                }
                break;
            }


            case MessageType.TrackManualDebrisFieldReport: {
                const msg = message as TrackManualDebrisFieldReportMessage;
                await this.dfModule.trackManualDebrisFieldReport(msg);
                
                const newDfReportMessage: NewDebrisFieldReportMessage = {
                    ogameMeta: message.ogameMeta,
                    type: MessageType.NewDebrisFieldReport,
                    data: msg.data,
                };
                await broadcastMessage(newDfReportMessage);
            }
        }
    }
}
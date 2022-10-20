import { Message, MessageOgameMeta } from '../../shared/messages/Message';
import { MessageType } from '../../shared/messages/MessageType';
import { _throw } from '../../shared/utils/_throw';
import { MessageService } from '../MessageService';
import { CombatReportModule } from './CombatReportModule';
import { broadcastMessage } from '../../shared/communication/broadcastMessage';
import { CombatReportMessage, CombatReportUnknownMessage, NewCombatReportMessage, RequestSingleCombatReportMessage, TrackCombatReportMessage } from '../../shared/messages/tracking/combat-reports';
import { serviceWorkerUuid } from '@/shared/uuid';
import { MessageTrackingErrorMessage, WillNotBeTrackedMessage } from '@/shared/messages/tracking/misc';
import { _logDebug } from '@/shared/utils/_log';

export class CombatReportService implements MessageService {
    private readonly combatReportModule = new CombatReportModule();

    public async onMessage(message: Message<MessageType, any>): Promise<void> {
        switch (message.type) {
            case MessageType.RequestSingleCombatReport: {
                const { data: id } = message as RequestSingleCombatReportMessage;
                const tryResult = await this.combatReportModule.tryGetSingleReport(message as RequestSingleCombatReportMessage);

                // unknown 
                if(!tryResult.success) {
                    const unknownMessage: CombatReportUnknownMessage = {
                        ogameMeta: message.ogameMeta,
                        type: MessageType.CombatReportUnknown,
                        data: id,
                        senderUuid: serviceWorkerUuid,
                    };
                    await broadcastMessage(unknownMessage);
                    break;
                }
                
                // known and ignored
                if(tryResult.result.ignored) {
                    const ignoreMessage: WillNotBeTrackedMessage = {
                        ogameMeta: message.ogameMeta,
                        type: MessageType.WillNotBeTracked,
                        data: {
                            id: tryResult.result.id,
                            type: 'combat-report',
                        },
                        senderUuid: serviceWorkerUuid,
                    };
                    await broadcastMessage(ignoreMessage);
                    break;
                }
                
                // known combat
                const combatReportMessage: CombatReportMessage = {
                    ogameMeta: message.ogameMeta,
                    type: MessageType.CombatReport,
                    data: tryResult.result.report,
                    senderUuid: serviceWorkerUuid,
                };
                await broadcastMessage(combatReportMessage);
                break;
            }

            case MessageType.TrackCombatReport: {
                const msg = message as TrackCombatReportMessage;
                const tryResult = await this.combatReportModule.tryTrackCombatReport(msg);
                if (!tryResult.success) {
                    const errorMessage: MessageTrackingErrorMessage = {
                        ogameMeta: message.ogameMeta,
                        type: MessageType.TrackingError,
                        data: {
                            id: msg.data.id,
                            type: 'combat-report',
                        },
                        senderUuid: serviceWorkerUuid,
                    };
                    await broadcastMessage(errorMessage);
                    return;
                }

                if(tryResult.result.ignored) {
                    const ignoreMessage: WillNotBeTrackedMessage = {
                        ogameMeta: message.ogameMeta,
                        type: MessageType.WillNotBeTracked,
                        data: {
                            id: tryResult.result.id,
                            type: 'combat-report',
                        },
                        senderUuid: serviceWorkerUuid,
                    };
                    await broadcastMessage(ignoreMessage);
                    break;
                }

                // broadcast "new combat report available"
                if (!tryResult.result.isAlreadyTracked) {
                    const newCombatReportMessage: NewCombatReportMessage = {
                        ogameMeta: message.ogameMeta,
                        type: MessageType.NewCombatReport,
                        data: tryResult.result.report,
                        senderUuid: serviceWorkerUuid,
                    };
                    await broadcastMessage(newCombatReportMessage);
                }
                // send data of the specific combat report
                else {
                    const combatReportMessage: CombatReportMessage = {
                        ogameMeta: message.ogameMeta,
                        type: MessageType.CombatReport,
                        data: tryResult.result.report,
                        senderUuid: serviceWorkerUuid,
                    };
                    await broadcastMessage(combatReportMessage);
                }

                break;
            }
        }
    }
}
import { Message, MessageOgameMeta } from '../../shared/messages/Message';
import { MessageType } from '../../shared/messages/MessageType';
import { _throw } from '../../shared/utils/_throw';
import { MessageService } from '../MessageService';
import { CombatReportModule } from './CombatReportModule';
import { broadcastMessage } from '../../shared/communication/broadcastMessage';
import { CombatReportMessage, CombatReportUnknownMessage, NewCombatReportMessage, RequestSingleCombatReportMessage, TrackCombatReportMessage } from '../../shared/messages/tracking/combat-reports';

export class CombatReportService implements MessageService {
    private readonly combatReportModule = new CombatReportModule();

    public async onMessage(message: Message<MessageType, any>): Promise<void> {
        switch (message.type) {
            case MessageType.RequestSingleCombatReport: {
                const { data: id } = message as RequestSingleCombatReportMessage;
                const tryResult = await this.combatReportModule.tryGetSingleReport(message as RequestSingleCombatReportMessage);
                if(!tryResult.success) {
                    const unknownMessage: CombatReportUnknownMessage = {
                        ogameMeta: message.ogameMeta,
                        type: MessageType.CombatReportUnknown,
                        data: id,
                    };
                    await broadcastMessage(unknownMessage);
                }
                else {
                    const combatReportMessage: CombatReportMessage = {
                        ogameMeta: message.ogameMeta,
                        type: MessageType.CombatReport,
                        data: tryResult.result,
                    };
                    await broadcastMessage(combatReportMessage);
                }
                break;
            }

            case MessageType.TrackCombatReport: {
                const tryResult = await this.combatReportModule.tryTrackCombatReport(message as TrackCombatReportMessage);
                if (!tryResult.success) {
                    _throw('failed to track combat report');
                }

                const { report, isAlreadyTracked } = tryResult.result;

                // broadcast "new combat report available"
                if (!isAlreadyTracked) {
                    const newCombatReportMessage: NewCombatReportMessage = {
                        ogameMeta: message.ogameMeta,
                        type: MessageType.NewCombatReport,
                        data: report,
                    };
                    await broadcastMessage(newCombatReportMessage);
                }
                // send data of the specific combat report
                else {
                    const combatReportMessage: CombatReportMessage = {
                        ogameMeta: message.ogameMeta,
                        type: MessageType.CombatReport,
                        data: report,
                    };
                    await broadcastMessage(combatReportMessage);
                }

                break;
            }
        }
    }
}
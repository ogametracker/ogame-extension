import { Message, MessageOgameMeta } from '../../shared/messages/Message';
import { MessageType } from '../../shared/messages/MessageType';
import { _throw } from '../../shared/utils/_throw';
import { MessageService } from '../MessageService';
import { CombatReportModule } from './CombatReportModule';
import { broadcastMessage } from '../../shared/communication/broadcastMessage';
import { AllCombatReportsMessage, CombatReportMessage, NewCombatReportMessage, TrackCombatReportMessage } from '../../shared/messages/tracking/combat-reports';

export class CombatReportService implements MessageService {
    private readonly combatReportModule = new CombatReportModule();

    public async onMessage(message: Message<MessageType, any>): Promise<void> {
        switch (message.type) {
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
                    broadcastMessage(newCombatReportMessage);
                }
                // send data of the specific combat report
                else {
                    const combatReportMessage: CombatReportMessage = {
                        ogameMeta: message.ogameMeta,
                        type: MessageType.CombatReport,
                        data: report,
                    };
                    broadcastMessage(combatReportMessage);
                }

                break;
            }

            case MessageType.RequestCombatReports: {
                await this.broadcastAllCombatReports(message.ogameMeta);
                break;
            }
        }
    }


    private async broadcastAllCombatReports(meta: MessageOgameMeta) {
        const combatReports = await this.combatReportModule.getCombatReports(meta);

        const allCombatReportsMessage: AllCombatReportsMessage = {
            ogameMeta: meta,
            type: MessageType.AllCombatReports,
            data: combatReports,
        };
        broadcastMessage(allCombatReportsMessage);
    }
}
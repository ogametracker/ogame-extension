import { Message, MessageOgameMeta } from '../../shared/messages/Message';
import { MessageType } from '../../shared/messages/MessageType';
import { _throw } from '../../shared/utils/_throw';
import { MessageService } from '../MessageService';
import { broadcastMessage } from '../../shared/communication/broadcastMessage';
import { EmpireModule } from './EmpireModule';
import { EmpireDataMessage } from '../../shared/messages/tracking/empire';

export class EmpireService implements MessageService {
    private readonly empireModule = new EmpireModule();

    public async onMessage(message: Message<MessageType, any>): Promise<void> {
        switch (message.type) {
            // case MessageType.TrackExpedition: {
            //     const tryResult = await this.expeditionModule.tryTrackExpedition(message as TrackExpeditionMessage);
            //     if (!tryResult.success) {
            //         _throw('failed to track expedition');
            //     }

            //     const { expedition, isAlreadyTracked } = tryResult.result;

            //     // broadcast "new expedition available"
            //     if (!isAlreadyTracked) {
            //         const newExpeditionMessage: NewExpeditionMessage = {
            //             ogameMeta: message.ogameMeta,
            //             type: MessageType.NewExpedition,
            //             data: expedition,
            //         };
            //         broadcastMessage(newExpeditionMessage);
            //     }
            //     // send data of the specific expedition
            //     else {
            //         const expeditionMessage: ExpeditionMessage = {
            //             ogameMeta: message.ogameMeta,
            //             type: MessageType.Expedition,
            //             data: expedition,
            //         };
            //         broadcastMessage(expeditionMessage);
            //     }

            //     break;
            // }

            case MessageType.RequestEmpireData: {
                await this.broadcastEmpireData(message.ogameMeta);
                break;
            }
        }
    }


    private async broadcastEmpireData(meta: MessageOgameMeta) {
        const empireData = await this.empireModule.getEmpireData(meta);

        const empireDataMessage: EmpireDataMessage = {
            ogameMeta: meta,
            type: MessageType.EmpireData,
            data: empireData,
        };
        broadcastMessage(empireDataMessage);
    }
}
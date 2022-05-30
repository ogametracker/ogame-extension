import { Message, MessageOgameMeta } from '../../shared/messages/Message';
import { MessageType } from '../../shared/messages/MessageType';
import { _throw } from '../../shared/utils/_throw';
import { MessageService } from '../MessageService';
import { broadcastMessage } from '../../shared/communication/broadcastMessage';
import { EmpireModule } from './EmpireModule';
import { EmpireDataMessage, NotifyEmpireDataUpdateMessage, UpdateActiveOfficersMessage, UpdateAllianceClassMessage, UpdateOwnedPlanetsMessage, UpdatePlanetActiveItemsMessage, UpdatePlanetBuildingLevelsMessage, UpdatePlanetDefenseCountsMessage, UpdatePlanetProductionSettingsMessage, UpdatePlanetShipCountsMessage, UpdatePlayerClassMessage, UpdatePlayerNameMessage, UpdateResearchLevelsMessage, UpdateUniverseNameMessage } from '../../shared/messages/tracking/empire';
import { serviceWorkerUuid } from '@/shared/uuid';

export class EmpireService implements MessageService {
    private readonly empireModule = new EmpireModule();

    public async onMessage(message: Message<MessageType, any>): Promise<void> {
        switch (message.type) {
            case MessageType.UpdateActiveOfficers: {
                const msg = message as UpdateActiveOfficersMessage;
                await this.empireModule.updateOfficers(msg.ogameMeta, msg.data);

                await this.notifyEmpireUpdate(message.ogameMeta);
                break;
            }

            case MessageType.UpdateAllianceClass: {
                const msg = message as UpdateAllianceClassMessage;
                await this.empireModule.updateAlliance(msg.ogameMeta, msg.data);

                await this.notifyEmpireUpdate(message.ogameMeta);
                break;
            }

            case MessageType.UpdatePlanetActiveItems: {
                const msg = message as UpdatePlanetActiveItemsMessage;
                await this.empireModule.updateActiveItems(msg.ogameMeta, msg.data);

                await this.notifyEmpireUpdate(message.ogameMeta);
                break;
            }

            case MessageType.UpdatePlanetBuildingLevels: {
                const msg = message as UpdatePlanetBuildingLevelsMessage;
                await this.empireModule.updateBuildingLevels(msg.ogameMeta, msg.data);

                await this.notifyEmpireUpdate(message.ogameMeta);
                break;
            }

            case MessageType.UpdatePlanetData: {
                const msg = message as UpdateOwnedPlanetsMessage;
                await this.empireModule.updateBasicPlanets(msg.ogameMeta, msg.data);

                await this.notifyEmpireUpdate(message.ogameMeta);
                break;
            }

            case MessageType.UpdatePlanetDefenseCounts: {
                const msg = message as UpdatePlanetDefenseCountsMessage;
                await this.empireModule.updatePlanetDefenses(msg.ogameMeta, msg.data);

                await this.notifyEmpireUpdate(message.ogameMeta);
                break;
            }

            case MessageType.UpdatePlanetShipCounts: {
                const msg = message as UpdatePlanetShipCountsMessage;
                await this.empireModule.updatePlanetShips(msg.ogameMeta, msg.data);

                await this.notifyEmpireUpdate(message.ogameMeta);
                break;
            }

            case MessageType.UpdatePlayerClass: {
                const msg = message as UpdatePlayerClassMessage;
                await this.empireModule.updatePlayerClass(msg.ogameMeta, msg.data);

                await this.notifyEmpireUpdate(message.ogameMeta);
                break;
            }

            case MessageType.UpdateResearchLevels: {
                const msg = message as UpdateResearchLevelsMessage;
                await this.empireModule.updateResearchLevels(msg.ogameMeta, msg.data);

                await this.notifyEmpireUpdate(message.ogameMeta);
                break;
            }

            case MessageType.UpdatePlanetProductionSettings: {
                const msg = message as UpdatePlanetProductionSettingsMessage;
                await this.empireModule.updateProductionSettings(msg.ogameMeta, msg.data);

                await this.notifyEmpireUpdate(message.ogameMeta);
                break;
            }

            case MessageType.UpdatePlayerName: {
                const msg = message as UpdatePlayerNameMessage;
                await this.empireModule.updatePlayerName(msg.ogameMeta, msg.data);

                await this.notifyEmpireUpdate(message.ogameMeta);
                break;
            }

            case MessageType.UpdateUniverseName: {
                const msg = message as UpdateUniverseNameMessage;
                await this.empireModule.updateUniverseName(msg.ogameMeta, msg.data);

                await this.notifyEmpireUpdate(message.ogameMeta);
                break;
            }

            case MessageType.RequestEmpireData: {
                await this.broadcastEmpireData(message.ogameMeta);
                break;
            }
        }
    }

    private async notifyEmpireUpdate(meta: MessageOgameMeta) {
        const empireData = await this.empireModule.getEmpireData(meta);

        const notifyMessge: NotifyEmpireDataUpdateMessage = {
            type: MessageType.NotifyEmpireDataUpdate,
            ogameMeta: meta,
            data: empireData,
            senderUuid: serviceWorkerUuid,
        };
        await broadcastMessage(notifyMessge);
    }


    private async broadcastEmpireData(meta: MessageOgameMeta) {
        const empireData = await this.empireModule.getEmpireData(meta);

        const empireDataMessage: EmpireDataMessage = {
            ogameMeta: meta,
            type: MessageType.EmpireData,
            data: empireData,
            senderUuid: serviceWorkerUuid,
        };
        await broadcastMessage(empireDataMessage);
    }
}
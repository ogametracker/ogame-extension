import { Message, MessageOgameMeta } from '../../shared/messages/Message';
import { MessageType } from '../../shared/messages/MessageType';
import { _throw } from '../../shared/utils/_throw';
import { MessageService } from '../MessageService';
import { broadcastMessage } from '../../shared/communication/broadcastMessage';
import { EmpireModule } from './EmpireModule';
import { NotifyEmpireDataUpdateMessage, UpdateActiveOfficersMessage, UpdateAllianceClassMessage, UpdateLifeformExperienceMessage, UpdateOwnedPlanetsMessage, UpdatePlanetActiveItemsMessage, UpdatePlanetActiveLifeformBuildingLevelsMessage, UpdatePlanetActiveLifeformTechnologyLevelsMessage, UpdatePlanetBuildingLevelsMessage, UpdatePlanetDefenseCountsMessage, UpdatePlanetLifeformBuildingLevelsMessage, UpdatePlanetLifeformTechnologyLevelsMessage, UpdatePlanetProductionSettingsMessage, UpdatePlanetShipCountsMessage, UpdatePlayerClassMessage, UpdateResearchLevelsMessage, UpdateSelectedLifeformMessage, } from '../../shared/messages/tracking/empire';
import { serviceWorkerUuid } from '@/shared/uuid';

export class EmpireService implements MessageService {
    private readonly empireModule = new EmpireModule();

    public async onMessage(message: Message<MessageType, any>): Promise<void> {
        switch (message.type) {
            case MessageType.UpdateActiveOfficers: {
                const msg = message as UpdateActiveOfficersMessage;
                await this.empireModule.updateOfficers(msg.ogameMeta, msg.data);
                break;
            }

            case MessageType.UpdateAllianceClass: {
                const msg = message as UpdateAllianceClassMessage;
                await this.empireModule.updateAlliance(msg.ogameMeta, msg.data);
                break;
            }

            case MessageType.UpdatePlanetActiveItems: {
                const msg = message as UpdatePlanetActiveItemsMessage;
                await this.empireModule.updateActiveItems(msg.ogameMeta, msg.data);
                break;
            }

            case MessageType.UpdatePlanetBuildingLevels: {
                const msg = message as UpdatePlanetBuildingLevelsMessage;
                await this.empireModule.updateBuildingLevels(msg.ogameMeta, msg.data);
                break;
            }

            case MessageType.UpdatePlanetData: {
                const msg = message as UpdateOwnedPlanetsMessage;
                await this.empireModule.updateBasicPlanets(msg.ogameMeta, msg.data);
                break;
            }

            case MessageType.UpdatePlanetDefenseCounts: {
                const msg = message as UpdatePlanetDefenseCountsMessage;
                await this.empireModule.updatePlanetDefenses(msg.ogameMeta, msg.data);
                break;
            }

            case MessageType.UpdatePlanetShipCounts: {
                const msg = message as UpdatePlanetShipCountsMessage;
                await this.empireModule.updatePlanetShips(msg.ogameMeta, msg.data);
                break;
            }

            case MessageType.UpdatePlayerClass: {
                const msg = message as UpdatePlayerClassMessage;
                await this.empireModule.updatePlayerClass(msg.ogameMeta, msg.data);
                break;
            }

            case MessageType.UpdateResearchLevels: {
                const msg = message as UpdateResearchLevelsMessage;
                await this.empireModule.updateResearchLevels(msg.ogameMeta, msg.data);
                break;
            }

            case MessageType.UpdatePlanetProductionSettings: {
                const msg = message as UpdatePlanetProductionSettingsMessage;
                await this.empireModule.updateProductionSettings(msg.ogameMeta, msg.data);
                break;
            }


            case MessageType.UpdateSelectedLifeform: {
                const msg = message as UpdateSelectedLifeformMessage;
                await this.empireModule.updateSelectedLifeform(msg.ogameMeta, msg.data);
                break;
            }

            case MessageType.UpdateLifeformExperience: {
                const msg = message as UpdateLifeformExperienceMessage;
                await this.empireModule.updateLifeformExperience(msg.ogameMeta, msg.data);
                break;
            }

            case MessageType.UpdatePlanetActiveLifeformBuildingLevels:
            case MessageType.UpdatePlanetLifeformBuildingLevels: {
                const msg = message as UpdatePlanetActiveLifeformBuildingLevelsMessage;
                await this.empireModule.updatePlanetLifeformBuildings(msg.ogameMeta, msg.data);
                break;
            }

            case MessageType.UpdatePlanetLifeformTechnologyLevels: {
                const msg = message as UpdatePlanetLifeformTechnologyLevelsMessage;
                await this.empireModule.updatePlanetLifeformTechnologies(msg.ogameMeta, msg.data);
                break;
            }

            case MessageType.UpdatePlanetActiveLifeformTechnologyLevels: {
                const msg = message as UpdatePlanetActiveLifeformTechnologyLevelsMessage;
                await this.empireModule.updatePlanetActiveLifeformTechnologies(msg.ogameMeta, msg.data);
                break;
            }

            default: return; // send no update notification
        }

        await this.notifyEmpireUpdate(message.ogameMeta);
    }

    private async notifyEmpireUpdate(meta: MessageOgameMeta) {
        const notifyMessge: NotifyEmpireDataUpdateMessage = {
            type: MessageType.NotifyEmpireDataUpdate,
            ogameMeta: meta,
            senderUuid: serviceWorkerUuid,
        };
        await broadcastMessage(notifyMessge);
    }
}
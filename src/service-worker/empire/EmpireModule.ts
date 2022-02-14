import { TryActionResult } from "../../shared/TryActionResult";
import { _log, _logError } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import { TrackExpeditionMessage } from "../../shared/messages/tracking/expeditions";
import { getStorageKeyPrefix } from "../../shared/utils/getStorageKeyPrefix";
import { EmpireManager } from "./EmpireManager";
import { MessageOgameMeta } from "../../shared/messages/Message";
import { LocalPlayerData } from "../../shared/models/v1/empire/LocalPlayerData";

export class EmpireModule {
    private readonly empireManagers: Record<string, EmpireManager | undefined> = {};

    public async tryTrackExpedition(message: TrackExpeditionMessage): Promise<TryActionResult<ExpeditionEventResult>> {
        const expeditionEventData = message.data;

        const manager = this.getManager(message.ogameMeta);
        const { language } = message.ogameMeta;
        const expeditionEvents = await manager.getData();

        // check if expedition already tracked => if true, return tracked data
        const knownExpedition = expeditionEvents[expeditionEventData.id];
        if (knownExpedition != null) {
            return {
                success: true,
                result: {
                    expedition: knownExpedition,
                    isAlreadyTracked: true,
                },
            };
        }

        // otherwise parse and save result
        let expedition: ExpeditionEvent;
        try {
            if (!isSupportedLanguage(language)) {
                throw new Error(`unsupported language '${language}'`);
            }

            expedition = this.parseExpedition(language as LanguageKey, expeditionEventData);
        } catch (error) {
            _logError({ error, message });
            return { success: false };
        }

        await manager.add(expedition);
        return {
            success: true,
            result: {
                expedition,
                isAlreadyTracked: false,
            },
        };
    }

    public async getEmpireData(meta: MessageOgameMeta): Promise<LocalPlayerData> {
        const manager = this.getManager(meta);
        const localPlayerData = await manager.getData();
        return localPlayerData;
    }

    private getManager(meta: MessageOgameMeta): EmpireManager {
        const key = getStorageKeyPrefix(meta);
        const manager = (this.empireManagers[key] ??= new EmpireManager(key));

        return manager;
    }
}
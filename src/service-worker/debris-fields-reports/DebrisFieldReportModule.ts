import { isSupportedLanguage } from "../../shared/i18n/isSupportedLanguage";
import { LanguageKey } from "../../shared/i18n/LanguageKey";
import { MessageOgameMeta } from "../../shared/messages/Message";
import { ExpeditionEvent, ExpeditionEventAliens, ExpeditionEventDarkMatter, ExpeditionEventDelay, ExpeditionEventEarly, ExpeditionEventFleet, ExpeditionEventItem, ExpeditionEventLostFleet, ExpeditionEventNothing, ExpeditionEventPirates, ExpeditionEventResources, ExpeditionEventTrader, ExpeditionFindableShipType } from "../../shared/models/v1/expeditions/ExpeditionEvents";
import { TryActionResult } from "../../shared/TryActionResult";
import { _log, _logError } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import i18nExpeditions from '../../shared/i18n/ogame/expeditions';
import i18nPremium from '../../shared/i18n/ogame/premium';
import i18nResources from '../../shared/i18n/ogame/resources';
import i18nShips from '../../shared/i18n/ogame/ships';
import { ExpeditionEventSize } from "../../shared/models/v1/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../../shared/models/v1/expeditions/ExpeditionEventType";
import { ResourceType } from "../../shared/models/v1/ogame/resources/ResourceType";
import { ItemHash } from "../../shared/models/v1/ogame/items/ItemHash";
import { TrackExpeditionMessage } from "../../shared/messages/tracking/expeditions";
import { getNumericEnumValues } from "../../shared/utils/getNumericEnumValues";
import { ShipType } from "../../shared/models/v1/ogame/ships/ShipType";
import { getStorageKeyPrefix } from "../../shared/utils/getStorageKeyPrefix";
import { DebrisFieldReportManager } from "./DebrisFieldReportManager";
import { TrackDebrisFieldReportMessage } from "../../shared/messages/tracking/debris-fields";
import { DebrisFieldReport } from "../../shared/models/v1/debris-field-reports/DebrisFieldReport";
import { RawMessageData } from "../../shared/messages/tracking/common";

type DebrisFieldReportResult = {
    ignored: true;
    report: undefined;
    isAlreadyTracked: undefined;
} | {
    ignored: false;
    report: DebrisFieldReport;
    isAlreadyTracked: boolean;
};

export class DebrisFieldReportModule {
    private readonly dfManagers: Record<string, DebrisFieldReportManager | undefined> = {};

    public async tryTrackDebrisFieldReport(message: TrackDebrisFieldReportMessage): Promise<TryActionResult<DebrisFieldReportResult>> {
        const messageData = message.data;

        const manager = this.getManager(message.ogameMeta);
        const { language } = message.ogameMeta;
        const reports = await manager.getItems();

        // check if expedition already tracked => if true, return tracked data
        const knownReport = reports[messageData.id];
        if (knownReport != null) {
            return {
                success: true,
                result: {
                    ignored: false,
                    report: knownReport,
                    isAlreadyTracked: true,
                },
            };
        }

        // otherwise parse and save result
        let report: DebrisFieldReport;
        try {
            if (!isSupportedLanguage(language)) {
                _throw(`unsupported language '${language}'`);
            }

            const parseResult = this.tryParseDebrisFieldReport(language as LanguageKey, messageData);
            if (!parseResult.success) {
                return {
                    success: true,
                    result: { ignored: true },
                };
            }

            report = parseResult.report;
        } catch (error) {
            _logError({ error, message });
            return { success: false };
        }

        await manager.add(report);
        return {
            success: true,
            result: {
                ignored: false,
                report,
                isAlreadyTracked: false,
            },
        };
    }

    private tryParseDebrisFieldReport(language: LanguageKey, messageData: RawMessageData): ({ success: false } | { success: true, report: DebrisFieldReport }) {
        //TODO: implement df report tracking
        throw new Error("Method not implemented.");
    }

    public async getDebridFieldReports(meta: MessageOgameMeta): Promise<DebrisFieldReport[]> {
        const manager = this.getManager(meta);
        const reports = await manager.getItems();
        return Object.values(reports);
    }

    private getManager(meta: MessageOgameMeta): DebrisFieldReportManager {
        const key = getStorageKeyPrefix(meta);
        const manager = (this.dfManagers[key] ??= new DebrisFieldReportManager(key));

        return manager;
    }
}
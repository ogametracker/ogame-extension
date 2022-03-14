import { isSupportedLanguage } from "../../shared/i18n/isSupportedLanguage";
import { LanguageKey } from "../../shared/i18n/LanguageKey";
import { MessageOgameMeta } from "../../shared/messages/Message";
import { TryActionResult } from "../../shared/TryActionResult";
import { _log, _logError } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import i18nDebrisFieldReports from '../../shared/i18n/ogame/messages/debris-field-reports';
import { getStorageKeyPrefix } from "../../shared/utils/getStorageKeyPrefix";
import { DebrisFieldReportManager } from "./DebrisFieldReportManager";
import { TrackDebrisFieldReportMessage } from "../../shared/messages/tracking/debris-fields";
import { DebrisFieldReport } from "../../shared/models/v2/debris-field-reports/DebrisFieldReport";
import { RawMessageData } from "../../shared/messages/tracking/common";
import { parseIntSafe } from "../../shared/utils/parseNumbers";

type DebrisFieldReportResult = {
    ignored: true;
    report?: undefined;
    isAlreadyTracked?: undefined;
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
        const reports = await manager.getData();

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
                throw new Error(`unsupported language '${language}'`);
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

    private tryParseDebrisFieldReport(language: LanguageKey, data: RawMessageData): ({ success: false } | { success: true, report: DebrisFieldReport }) {
        const regex = i18nDebrisFieldReports[language].regex;
        const match = regex.exec(data.text);
        if (match == null) {
            return { success: false };
        }

        const metalText = match.groups?.metal.replace(/\./g, '') ?? _throw('metal not found');
        const crystalText = match.groups?.crystal.replace(/\./g, '') ?? _throw('crystal not found');

        const metal = parseIntSafe(metalText, 10);
        const crystal = parseIntSafe(crystalText, 10);

        return {
            success: true,
            report: {
                id: data.id,
                date: data.date,
                metal,
                crystal,
            },
        };
    }

    public async getDebridFieldReports(meta: MessageOgameMeta): Promise<DebrisFieldReport[]> {
        const manager = this.getManager(meta);
        const reports = await manager.getData();
        return Object.values(reports);
    }

    private getManager(meta: MessageOgameMeta): DebrisFieldReportManager {
        const key = getStorageKeyPrefix(meta);
        const manager = (this.dfManagers[key] ??= new DebrisFieldReportManager(key));

        return manager;
    }
}
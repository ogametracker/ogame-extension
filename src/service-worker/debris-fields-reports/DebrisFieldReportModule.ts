import { isSupportedLanguage } from "../../shared/i18n/isSupportedLanguage";
import { LanguageKey } from "../../shared/i18n/LanguageKey";
import { TryActionResult } from "../../shared/TryActionResult";
import { _log, _logError } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import i18nDebrisFieldReports from '../../shared/i18n/ogame/messages/debris-field-reports';
import { getStorageKeyPrefix } from "../../shared/utils/getStorageKeyPrefix";
import { TrackDebrisFieldReportMessage, TrackManualDebrisFieldReportMessage } from "../../shared/messages/tracking/debris-fields";
import { DebrisFieldReport } from "../../shared/models/debris-field-reports/DebrisFieldReport";
import { RawMessageData } from "../../shared/messages/tracking/common";
import { parseIntSafe } from "../../shared/utils/parseNumbers";
import { getDatabase } from "../PersistentData";

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

    public async trackManualDebrisFieldReport(message: TrackManualDebrisFieldReportMessage): Promise<void> {
        const report = message.data;
        const db = await getDatabase(getStorageKeyPrefix(message.ogameMeta));
        await db.put('debrisFieldReports', report);
    }

    public async tryTrackDebrisFieldReport(message: TrackDebrisFieldReportMessage): Promise<TryActionResult<DebrisFieldReportResult>> {
        const messageData = message.data;
        const { language } = message.ogameMeta;
        const db = await getDatabase(getStorageKeyPrefix(message.ogameMeta));

        // check if expedition already tracked => if true, return tracked data
        const knownReport = await db.get('debrisFieldReports', messageData.id);
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

            await db.put('debrisFieldReports', report);

            return {
                success: true,
                result: {
                    ignored: false,
                    report,
                    isAlreadyTracked: false,
                },
            };
        } catch (error) {
            _logError({ error, message });
            return { success: false };
        }
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
}
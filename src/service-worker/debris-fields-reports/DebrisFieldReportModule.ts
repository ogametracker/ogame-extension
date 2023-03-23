import { isSupportedLanguage } from "../../shared/i18n/isSupportedLanguage";
import { LanguageKey } from "../../shared/i18n/LanguageKey";
import { TryActionResult } from "../../shared/TryActionResult";
import { _log, _logError } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import i18nDebrisFieldReports from '../../shared/i18n/ogame/messages/debris-field-reports';
import { TrackDebrisFieldReportMessage, TrackManualDebrisFieldReportMessage } from "../../shared/messages/tracking/debris-fields";
import { DebrisFieldReport } from "../../shared/models/debris-field-reports/DebrisFieldReport";
import { RawMessageData } from "../../shared/messages/tracking/common";
import { parseIntSafe } from "../../shared/utils/parseNumbers";
import { getPlayerDatabase } from "@/shared/db/access";
import { getLanguage } from "@/shared/i18n/getLanguage";

interface DebrisFieldReportResult {
    report: DebrisFieldReport;
    isAlreadyTracked: boolean;
};

export class DebrisFieldReportModule {

    public async trackManualDebrisFieldReport(message: TrackManualDebrisFieldReportMessage): Promise<void> {
        const report = message.data;
        const db = await getPlayerDatabase(message.ogameMeta);
        await db.put('debrisFieldReports', report);
    }

    public async tryTrackDebrisFieldReport(message: TrackDebrisFieldReportMessage): Promise<TryActionResult<DebrisFieldReportResult>> {
        const messageData = message.data;
        const { language } = message.ogameMeta;
        const db = await getPlayerDatabase(message.ogameMeta);

        // check if expedition already tracked => if true, return tracked data
        const knownReport = await db.get('debrisFieldReports', messageData.id);
        if (knownReport != null) {
            return {
                success: true,
                result: {
                    report: knownReport,
                    isAlreadyTracked: true,
                },
            };
        }

        // otherwise parse and save result
        let report: DebrisFieldReport;

        try {            
            const languageKey = getLanguage(language, true);
            const parseResult = this.tryParseDebrisFieldReport(languageKey, {
                ...messageData,
                text: messageData.text.replace(/\s+/g, ' ').trim(),
            });

            report = parseResult.report;

            await db.put('debrisFieldReports', report);

            return {
                success: true,
                result: {
                    report,
                    isAlreadyTracked: false,
                },
            };
        } catch (error) {
            _logError({ error, message });
            return { success: false };
        }
    }

    private tryParseDebrisFieldReport(language: LanguageKey, data: RawMessageData): { success: true, report: DebrisFieldReport } {
        const regexes = i18nDebrisFieldReports[language].regex;
        const match = regexes.map(regex => regex.exec(data.text)).find(match => match?.groups != null);
        if (match?.groups == null) {
            _throw('found no debris field report match');
        }

        const metalText = match.groups.metal.replace(/[^\d]/g, '') ?? _throw('metal not found');
        const crystalText = match.groups.crystal.replace(/[^\d]/g, '') ?? _throw('crystal not found');
        const deuteriumText = match.groups.deuterium?.replace(/[^\d]/g, '');

        const metal = parseIntSafe(metalText, 10);
        const crystal = parseIntSafe(crystalText, 10);
        const deuterium = deuteriumText != null ? parseIntSafe(deuteriumText, 10) : undefined;

        const isExpeditionDebrisField = /\[\d+:\d+:16\]/.test(data.text);

        return {
            success: true,
            report: {
                id: data.id,
                date: data.date,
                metal,
                crystal,
                deuterium,
                isExpeditionDebrisField,
            },
        };
    }
}
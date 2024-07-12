import { TryActionResult } from "../../shared/TryActionResult";
import { _log, _logError } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import { TrackDebrisFieldReportMessage, TrackManualDebrisFieldReportMessage } from "../../shared/messages/tracking/debris-fields";
import { DebrisFieldReport } from "../../shared/models/debris-field-reports/DebrisFieldReport";
import { RawDebrisFieldMessageData } from "../../shared/messages/tracking/common";
import { parseIntSafe } from "../../shared/utils/parseNumbers";
import { getPlayerDatabase } from "@/shared/db/access";

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
            const parseResult = this.tryParseDebrisFieldReport(messageData);

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

    private tryParseDebrisFieldReport(data: RawDebrisFieldMessageData): { success: true, report: DebrisFieldReport } {    
        const deuterium = data.resources.deuterium != null ? data.resources.deuterium : undefined;
        const isExpeditionDebrisField = data.coords.endsWith(':16');
    
        return {
            success: true,
            report: {
                id: data.id,
                date: data.date,
                metal: data.resources.metal,
                crystal: data.resources.crystal,
                deuterium: deuterium,
                isExpeditionDebrisField,
            },
        };
    }
}
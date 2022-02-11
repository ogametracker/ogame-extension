import { isSupportedLanguage } from "../../shared/i18n/isSupportedLanguage";
import { LanguageKey } from "../../shared/i18n/LanguageKey";
import { MessageOgameMeta } from "../../shared/messages/Message";
import { TryActionResult } from "../../shared/TryActionResult";
import { _log, _logError } from "../../shared/utils/_log";
import { getStorageKeyPrefix } from "../../shared/utils/getStorageKeyPrefix";
import { CombatReportManager } from "./CombatReportManager";
import { CombatReport } from "../../shared/models/v1/combat-reports/CombatReport";
import { _throw } from "../../shared/utils/_throw";
import { RawCombatReportData, TrackCombatReportMessage } from "../../shared/messages/tracking/combat-reports";

interface CombatReportResult {
    report: CombatReport;
    isAlreadyTracked: boolean;
}

export class CombatReportModule {
    private readonly combatReportManagers: Record<string, CombatReportManager | undefined> = {};

    public async tryTrackCombatReport(message: TrackCombatReportMessage): Promise<TryActionResult<CombatReportResult>> {
        const combatReportData = message.data;

        const manager = this.getManager(message.ogameMeta);
        const { language } = message.ogameMeta;
        const combatReports = await manager.getItems();

        // check if expedition already tracked => if true, return tracked data
        const knownReport = combatReports[combatReportData.id];
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
        let report: CombatReport;
        try {
            report = this.parseCombatReport(combatReportData);
        } catch (error) {
            _logError({ error, message });
            return { success: false };
        }

        await manager.add(report);
        return {
            success: true,
            result: {
                report,
                isAlreadyTracked: false,
            },
        };
    }

    private parseCombatReport(rawCombatReportData: RawCombatReportData): CombatReport {
        throw new Error("Method not implemented.");
    }

    public async getCombatReports(meta: MessageOgameMeta): Promise<CombatReport[]> {
        const manager = this.getManager(meta);
        const expeditions = await manager.getItems();
        return Object.values(expeditions);
    }

    private getManager(meta: MessageOgameMeta): CombatReportManager {
        const key = getStorageKeyPrefix(meta);
        const manager = (this.combatReportManagers[key] ??= new CombatReportManager(key));

        return manager;
    }
}
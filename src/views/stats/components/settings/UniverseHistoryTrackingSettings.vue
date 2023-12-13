<template>
    <div class="universe-history-tracking">
        <div v-if="!settings.enabled" v-html="$i18n.$t.extension.universeHistory.settings.messages.notEnabledHtml" />

        <checkbox-button
            :value="settings.enabled"
            :label="$i18n.$t.extension.universeHistory.settings.enableHighscoreTrackingOnly"
            @input="setEnabled($event)"
            color="#00ff00"
        />

        <hr />

        <div v-if="settings.enabled && !settings.trackHistory" v-html="$i18n.$t.extension.universeHistory.settings.messages.historyTrackingNotEnabledHtml" />
        <checkbox-button
            v-if="settings.enabled"
            :value="settings.trackHistory"
            :label="$i18n.$t.extension.universeHistory.settings.enableHistoryTracking"
            @input="setTrackHistory($event)"
            color="#00ff00"
        />

        <hr />

        <div v-html="$i18n.$t.extension.universeHistory.settings.messages.trackingTimesHtml" />
        <div class="time-grid">
            <checkbox-button
                v-for="(enabled, time) in timeSelection"
                :key="time"
                :value="enabled"
                @input="setTimeEnabled(time, $event)"
                :label="formatTime(time)"
                color="#00ff00"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { getLanguage } from '@/shared/i18n/getLanguage';
import { LanguageKey } from '@/shared/i18n/LanguageKey';
    import { getDefaultSettings } from '@/shared/models/settings/getDefaultSettings';
    import { parseIntSafe } from '@/shared/utils/parseNumbers';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { GlobalOgameMetaData } from '../../data/global';
    import { SettingsDataModule } from '../../data/SettingsDataModule';

    @Component({})
    export default class UniverseHistoryTrackingSettings extends Vue {
        private get timeSelection(): Record<number, boolean> {
            const result: Record<number, boolean> = {};

            for (let i = 0; i <= 23; i++) {
                const time = i * 60 * 60 * 1000;
                result[time] = this.settings.updateTimes.includes(time);
            }

            return result;
        }

        private get settings() {
            return SettingsDataModule.settings.universeHistory;
        }

        private formatTime(timeStr: string) {
            const time = parseIntSafe(timeStr, 10) + new Date(0).getTimezoneOffset() * 60 * 1000;
            return this.$i18n.$d(time, 'time_hm');
        }

        private setEnabled(enabled: boolean) {
            const universeHistory = {
                ...this.settings,
                enabled,
            };
            if (!enabled) {
                universeHistory.trackHistory = false;
            }

            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                universeHistory,
            });
        }

        private setTimeEnabled(timeStr: string, enabled: boolean) {
            const time = parseIntSafe(timeStr, 10);
            let updateTimes = this.settings.updateTimes;
            if (enabled && !updateTimes.includes(time)) {
                updateTimes.push(time);
            }
            else if (!enabled && updateTimes.includes(time)) {
                updateTimes = updateTimes.filter(t => t != time);
            }

            if (updateTimes.length == 0) {
                const languageKey = getLanguage(GlobalOgameMetaData.userLanguage) ?? LanguageKey.en;
                updateTimes = getDefaultSettings(languageKey).universeHistory.updateTimes;
            }

            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                universeHistory: {
                    ...this.settings,
                    updateTimes,
                },
            });
        }

        private setTrackHistory(trackHistory: boolean) {
            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                universeHistory: {
                    ...this.settings,
                    trackHistory,
                },
            });
        }
    }
</script>
<style lang="scss" scoped>
    .time-grid {
        display: inline-grid;
        grid-template-columns: repeat(12, 1fr);
        gap: 4px;
    }
</style>
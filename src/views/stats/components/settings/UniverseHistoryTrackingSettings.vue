<template>
    <div>
        <div
            v-if="!settings.enabled"
            v-text="$i18n.$t.universeHistory.settings.messages.notEnabled"
        />

        <checkbox-button
            :value="settings.enabled"
            :label="$i18n.$t.universeHistory.settings.enableHighscoreTrackingOnly"
            @input="setEnabled($event)"
            color="#00ff00"
        />

        <hr />

        <div
            v-if="settings.enabled && !settings.trackHistory"
            v-text="$i18n.$t.universeHistory.settings.messages.historyTrackingNotEnabled"
        />
        <checkbox-button
            v-if="settings.enabled"
            :value="settings.trackHistory"
            :label="$i18n.$t.universeHistory.settings.enableHistoryTracking"
            @input="setTrackHistory($event)"
            color="#00ff00"
        />

        <hr />

        <template v-for="(enabled, time) in timeSelection">
            <br v-if="time == 12 * 60 * 60 * 1000" :key="`br-${time}`" />
            <checkbox-button
                :key="time"
                :value="enabled"
                @input="setTimeEnabled(time, $event)"
                :label="formatTime(time)"
                color="#00ff00"
            />
        </template>
    </div>
</template>

<script lang="ts">
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
                updateTimes = getDefaultSettings(GlobalOgameMetaData.language as LanguageKey).universeHistory.updateTimes;
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
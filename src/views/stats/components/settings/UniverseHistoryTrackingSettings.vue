<template>
    <div class="universe-history-tracking">
        <div
            v-if="!settings.enabled"
            v-html="translations().extension.universeHistory.settings.messages.notEnabledHtml"
        />

        <CheckboxButton
            :model-value="settings.enabled"
            :label="translations().extension.universeHistory.settings.enableHighscoreTrackingOnly"
            @update:model-value="setEnabled($event)"
            color="#00ff00"
        />

        <hr />

        <div
            v-if="settings.enabled && !settings.trackHistory"
            v-html="translations().extension.universeHistory.settings.messages.historyTrackingNotEnabledHtml"
        />
        <CheckboxButton
            v-if="settings.enabled"
            :model-value="settings.trackHistory"
            :label="translations().extension.universeHistory.settings.enableHistoryTracking"
            @update:model-value="setTrackHistory($event)"
            color="#00ff00"
        />

        <hr />

        <div v-html="translations().extension.universeHistory.settings.messages.trackingTimesHtml" />
        <div class="time-grid">
            <CheckboxButton
                v-for="(enabled, time) in timeSelection"
                :key="time"
                :model-value="enabled"
                @update:model-value="setTimeEnabled(time, $event)"
                :label="formatTime(time)"
                color="#00ff00"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import CheckboxButton from '@stats/components/common/CheckboxButton.vue';
import { computed } from 'vue';
import { translations, formatDate } from '@stats/i18n';
import { getLanguage } from '@ogame-tracker/shared/i18n/getLanguage';
import { LanguageKey } from '@ogame-tracker/shared/i18n/LanguageKey';
import { getDefaultSettings } from '@ogame-tracker/shared/models/settings/getDefaultSettings';
import { parseIntSafe } from '@ogame-tracker/shared/utils/parseNumbers';
import { GlobalOgameMetaData } from '../../data/global';
import { useSettingsStore } from '../../data/SettingsDataModule';

const settingsStore = useSettingsStore();

const timeSelection = computed<Record<number, boolean>>(() => {
    const result: Record<number, boolean> = {};

    for (let i = 0; i <= 23; i++) {
        const time = i * 60 * 60 * 1000;
        result[time] = settings.value.updateTimes.includes(time);
    }

    return result;
});

const settings = computed(() => settingsStore.settings.universeHistory);

function formatTime(timeStr: string) {
    const time = parseIntSafe(timeStr, 10) + new Date(0).getTimezoneOffset() * 60 * 1000;
    return formatDate(time, 'time_hm');
}

function setEnabled(enabled: boolean) {
    const universeHistory = {
        ...settings.value,
        enabled,
    };
    if (!enabled) {
        universeHistory.trackHistory = false;
    }

    settingsStore.updateSettings({
        ...settingsStore.settings,
        universeHistory,
    });
}

function setTimeEnabled(timeStr: string, enabled: boolean) {
    const time = parseIntSafe(timeStr, 10);
    let updateTimes = settings.value.updateTimes;
    if (enabled && !updateTimes.includes(time)) {
        updateTimes.push(time);
    } else if (!enabled && updateTimes.includes(time)) {
        updateTimes = updateTimes.filter(t => t != time);
    }

    if (updateTimes.length == 0) {
        const languageKey = getLanguage(GlobalOgameMetaData.userLanguage) ?? LanguageKey.en;
        updateTimes = getDefaultSettings(languageKey).universeHistory.updateTimes;
    }

    settingsStore.updateSettings({
        ...settingsStore.settings,
        universeHistory: {
            ...settings.value,
            updateTimes,
        },
    });
}

function setTrackHistory(trackHistory: boolean) {
    settingsStore.updateSettings({
        ...settingsStore.settings,
        universeHistory: {
            ...settings.value,
            trackHistory,
        },
    });
}
</script>

<style lang="scss" scoped>
.time-grid {
    display: inline-grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 4px;
}
</style>

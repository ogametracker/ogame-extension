<template>
    <div>
        <div v-if="!settings.enabled">
            LOCA: Universe history tracking is not enabled. Enabling this
            feature will track changes in point distribution, planets and moons
            including their names ands coordinates, names and more of players
            and alliances. However, this will generate a lot of data which is
            why this feature is disabled by default. If you enable this feature,
            you can set below at which times in a day you want to update. The
            more times you select the more data will be generated. You can
            disable this feature later again but then you will not be able to
            view already tracked data.
        </div>

        <checkbox-button
            :value="settings.enabled"
            label="LOCA: Enable universe history tracking"
            @input="setEnabled($event)"
            color="#00ff00"
        />

        <checkbox-button
            v-for="(enabled, time) in timeSelection"
            :key="time"
            :value="enabled"
            @input="setTimeEnabled(time, $event)"
            :label="`LOCA: ${time}`"
            color="#00ff00"
        />
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

        private setEnabled(enabled: boolean) {
            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                universeHistory: {
                    ...this.settings,
                    enabled,
                },
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
    }
</script>
<template>
    <div class="fake-table">
        <div class="fake-table-header">
            <span v-text="translations().extension.settings.common.extensionLanguage" />
        </div>
        <div class="fake-table-body">
            <select :value="language" @change="setLanguage(($event.target as HTMLSelectElement).value as LanguageKey)">
                <option
                    v-for="lang in langs"
                    :key="lang"
                    :value="lang"
                    v-text="languageNames[lang]"
                />
            </select>
            <select
                v-if="Object.keys(getRegions(language)).length > 0"
                :value="languageRegion"
                @change="setLanguageRegion(($event.target as HTMLInputElement).value)"
            >
                <option
                    v-for="(name, region) in getRegions(language)"
                    :key="region"
                    :value="region"
                    v-text="name"
                />
            </select>
            <span v-text="translations().extension.settings.common.extensionLanguageFallbackHint" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { translations } from '@stats/i18n';
import { LanguageKey } from '@ogame-tracker/shared/i18n/LanguageKey';
import { useSettingsStore } from '../../data/SettingsDataModule';

const settingsStore = useSettingsStore();

const langs = ref<LanguageKey[]>([
    LanguageKey.de,
    LanguageKey.en,
    LanguageKey['pt-pt'],
    LanguageKey.fr,
]);

const languageNames = ref<Partial<Record<LanguageKey, string>>>({
    [LanguageKey.de]: 'Deutsch',
    [LanguageKey.en]: 'English',
    [LanguageKey['pt-pt']]: 'Português',
    [LanguageKey.fr]: 'Français',
});

const regions = ref<Partial<Record<LanguageKey, Record<string, string>>>>({
    [LanguageKey.en]: {
        'gb': 'United Kingdom',
        'us': 'United States',
    },
});

function getRegions(locale: LanguageKey): Record<string, string> {
    return regions.value[locale] ?? {};
}

const language = computed(() => settingsStore.settings.extensionLanguage);

const languageRegion = computed(() => settingsStore.settings.extensionLanguageRegion);

function setLanguage(extensionLanguage: LanguageKey) {
    settingsStore.updateSettings({
        ...settingsStore.settings,
        extensionLanguage,
    });

    setLanguageRegion(undefined);
}

function setLanguageRegion(region?: string) {
    settingsStore.updateSettings({
        ...settingsStore.settings,
        extensionLanguageRegion: region,
    });
}
</script>

<style lang="scss" scoped>
    .fake-table {
        border: 1px solid rgba(var(--color), 0.5);
        border-radius: 4px;
        display: grid;
        width: fit-content;
        max-width: 400px;

        &-header {
            background: black
                linear-gradient(
                    0deg,
                    rgba(var(--color), 0.5),
                    rgba(var(--color), 0.7)
                );
            justify-content: center;
        }

        &-header,
        &-body {
            height: 100%;
            padding: 8px;
            display: flex;;
            align-items: center;
        }

        &-body {
            flex-direction: column;
            align-items: start;
            gap: 4px;
        }
    }
</style>

<template>
    <div class="fake-table">
        <div class="fake-table-header">
            <span v-text="$i18n.$t.extension.settings.common.extensionLanguage" />
        </div>
        <div class="fake-table-body">
            <select :value="language" @change="setLanguage($event.target.value)">
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
                @change="setLanguageRegion($event.target.value)"
            >
                <option
                    v-for="(name, region) in getRegions(language)"
                    :key="region"
                    :value="region"
                    v-text="name"
                />
            </select>
            <span v-text="$i18n.$t.extension.settings.common.extensionLanguageFallbackHint" />
        </div>
    </div>
</template>

<script lang="ts">
    import { LanguageKey } from '@/shared/i18n/LanguageKey';
    import { Component, Vue } from 'vue-property-decorator';
    import { SettingsDataModule } from '../../data/SettingsDataModule';

    @Component({})
    export default class DetailedResourceBalanceSettings extends Vue {
        private langs: LanguageKey[] = [
            LanguageKey.de,
            LanguageKey.en,
            LanguageKey['pt-pt'],
            LanguageKey.fr,
        ];
        private languageNames: Partial<Record<LanguageKey, string>> = {
            [LanguageKey.de]: 'Deutsch',
            [LanguageKey.en]: 'English',
            [LanguageKey['pt-pt']]: 'Português',
            [LanguageKey.fr]: 'Français',
        };
        private regions: Partial<Record<LanguageKey, Record<string, string>>> = {
            [LanguageKey.en]: {
                'gb': 'United Kingdom',
                'us': 'United States',
            },
        };

        private getRegions(locale: LanguageKey): Record<string, string> {
            return this.regions[locale] ?? {};
        }

        private get language() {
            return SettingsDataModule.settings.extensionLanguage;
        }
        private get languageRegion() {
            return SettingsDataModule.settings.extensionLanguageRegion;
        }

        private setLanguage(extensionLanguage: LanguageKey) {
            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                extensionLanguage,
            });

            this.setLanguageRegion(undefined);
        }

        private setLanguageRegion(region?: string) {
            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                extensionLanguageRegion: region,
            });
        }
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
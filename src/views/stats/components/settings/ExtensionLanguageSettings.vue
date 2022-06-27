<template>
    <div class="fake-table">
        <div class="fake-table-header">
            <span v-text="$i18n.$t.settings.common.extensionLanguage" />
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
        </div>
    </div>
</template>

<script lang="ts">
    import { LanguageKey } from '@/shared/i18n/LanguageKey';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { SettingsDataModule } from '../../data/SettingsDataModule';

    type SupportedUILanguage = LanguageKey.de | LanguageKey.en;

    @Component({})
    export default class DetailedResourceBalanceSettings extends Vue {
        private langs: SupportedUILanguage[] = [
            LanguageKey.de,
            LanguageKey.en,
        ];
        private languageNames: Record<SupportedUILanguage, string> = {
            [LanguageKey.de]: 'Deutsch',
            [LanguageKey.en]: 'English',
        };

        private get language() {
            return SettingsDataModule.settings.extensionLanguage;
        }

        private setLanguage(extensionLanguage: LanguageKey) {
            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                extensionLanguage,
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
            padding: 8px;
            display: flex;
            align-items: center;
        }
    }
</style>
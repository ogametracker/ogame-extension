<template>
    <div>
        <span v-text="'LOCA: Extension Language'" />

        <select :value="language" @change="setLanguage($event)">
            <option
                v-for="lang in langs"
                :key="lang"
                :value="lang"
                v-text="lang"
            />
        </select>
    </div>
</template>

<script lang="ts">
    import { LanguageKey } from '@/shared/i18n/LanguageKey';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { SettingsDataModule } from '../../data/SettingsDataModule';

    @Component({})
    export default class DetailedResourceBalanceSettings extends Vue {
        private langs: LanguageKey[] = [
            LanguageKey.en,
            LanguageKey.de,
        ];

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
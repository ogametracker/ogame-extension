<template>
    <div>
        <h2 v-text="$i18n.$t.settings.detectedOgameLanguage" />
        <span style="display: inline-flex; align-items: center;">
            <span v-text="ogameLang" />
            <template v-if="!ogameI18n.enabled">
                <span class="icon-alert" />
                <span v-text="$i18n.$t.ogameLanguageNotSupported(ogameLang)" />
            </template>
        </span>
        <h2>
            {{ $i18n.$t.settings.interfaceLanguage }}
            <button
                class="reset-button"
                @click="resetLanguage()"
                :title="$i18n.$t.settings.reset"
            >
                <icon name="refresh" />
            </button>
        </h2>
        <select v-model="settings.language">
            <option
                v-for="lang in languages"
                :key="lang"
                :value="lang"
                v-text="lang"
            />
        </select>
    </div>
</template>

<script lang="ts">
    import { ogameI18n } from '@/i18n';
    import { Languages } from '@/i18n/languageKey';
    import getLanguage from '@/i18n/mapLanguage';
    import OgameMetaData from '@/models/ogame/OgameMetaData';
    import SettingsModule from '@/store/modules/SettingsModule';
    import { Component, Vue } from 'vue-property-decorator';

    @Component({})
    export default class Language extends Vue {
        private readonly ogameI18n = ogameI18n;
        private readonly languages = Languages;
        private readonly ogameLang = getLanguage(OgameMetaData.locale);

        private get settings() {
            return SettingsModule.settings;
        }

        private resetLanguage() {
            const defaultLang = SettingsModule.getDefaultSettings().language;
            this.settings.language = defaultLang;
        }
    }
</script>
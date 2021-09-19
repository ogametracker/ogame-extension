<template>
    <li
        class="ogame-tracker-menu-item"
        :class="{
            'ogame-tracker-menu-item-warning': !ogameLangSupported
        }"
    >
        <span class="menu_icon">
            <span
                class="statistics-menu-icon"
                :class="{
                    tooltipRight: !ogameLangSupported
                }"
                :title="ogameLangSupported ? null : $i18n.$t.ogameLanguageNotSupported(ogameLang)"
            />
        </span>
        <a class="menubutton" href="#" @click="showTrackerWindow()">
            <span class="textlabel">
                OGame Tracker
            </span>
        </a>
    </li>
</template>

<script lang="ts">
    import { extensionI18n, ogameI18n } from '@/i18n';
    import LanguageKey from '@/i18n/languageKey';
    import getLanguage from '@/i18n/mapLanguage';
    import OgameMetaData from '@/models/ogame/OgameMetaData';
    import { Component, Prop, Vue } from 'vue-property-decorator';
import App from './App.vue';

    @Component({})
    export default class MenuItem extends Vue {
        public app: App | null = null;

        private showTrackerWindow() {
            this.app!.visible = true;
        }

        private ogameLangSupported = true;
        private readonly ogameLang = OgameMetaData.locale;

        private async created() {
            const ogameLang = getLanguage(null);
            this.ogameLangSupported = ogameLang != null;

            console.log(extensionI18n);
        }
    }
</script>
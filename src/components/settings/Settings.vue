<template>
    <div class="settings">
        <tab-view :items="items" vertical>
            <template #date-ranges>
                <date-ranges />
            </template>

            <template #chart-colors>
                <chart-colors />
            </template>

            <template #import-export>
                <import-export />
            </template>

            <template #language>
                <language />
            </template>
        </tab-view>
    </div>
</template>

<script lang="ts">
    import NotificationModule, { Notification } from '@/store/modules/NotificationModule';
    import SettingsModule from '@/store/modules/SettingsModule';
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import { TabViewItem } from '../common/TabView.vue';
    import ImportExport from './ImportExport.vue';
    import Language from './Language.vue';
    import ChartColors from './ChartColors.vue';
    import DateRanges from './DateRanges.vue';

    @Component({
        components: {
            ImportExport,
            Language,
            ChartColors,
            DateRanges,
        },
    })
    export default class Settings extends Vue {
        private get settings() {
            return SettingsModule.settings;
        }

        private readonly items: TabViewItem[] = [
            {
                name: 'date-ranges',
                title: this.$i18n.$t.settings.titleDateRanges,
            },
            {
                name: 'chart-colors',
                title: this.$i18n.$t.settings.chartColors.title,
            },
            {
                name: 'import-export',
                title: this.$i18n.$t.settings.titleImportExport,
            },
            {
                name: 'language',
                title: this.$i18n.$t.settings.language,
            },
        ];

        @Watch('settings', { deep: true })
        private settingsChanged() {
            this.saveDelayed();
        }

        private saveTimeout: number | null = null;
        private readonly saveDelay = 1000;
        private oldNotification: Notification | null = null;
        private saveDelayed() {
            if (this.saveTimeout != null) {
                clearTimeout(this.saveTimeout);
            }

            this.saveTimeout = setTimeout(async () => {
                await SettingsModule.save();
                this.saveTimeout = null;

                if (this.oldNotification != null) {
                    NotificationModule.remove(this.oldNotification);
                    this.oldNotification = null;
                }

                this.oldNotification = NotificationModule.addNotification({
                    type: 'success',
                    title: this.$i18n.$t.notifications.settingsSaved.title,
                    text: this.$i18n.$t.notifications.settingsSaved.text,
                    timeout: 5000,
                });

            }, this.saveDelay);
        }
    }
</script>

<style lang="scss" scoped>
    .settings::v-deep .reset-button {
        font-size: 14px;
        background: none;
        display: inline-flex;
        align-items: baseline;
        color: white;
        cursor: pointer;
        padding: 0;
        margin-left: 8px;

        &:hover {
            text-decoration: underline;
        }

        .icon-refresh {
            font-size: 22px;
        }
    }
</style>
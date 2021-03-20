import Settings from '@/models/settings/Settings';
import { Component, Vue } from 'vue-property-decorator';

@Component({})
class SettingsModule extends Vue {
    public readonly settings: Settings = {
        tables: {
            ranges: [
                {
                    type: "day",
                    skip: 0,
                    take: 1,
                    label: "Heute",
                },
                {
                    type: "week",
                    skip: 0,
                    take: 1,
                    label: "Aktuelle Woche",
                },
                {
                    type: "week",
                    skip: 1,
                    take: 1,
                    label: "Letzte Woche",
                },
                {
                    type: "month",
                    skip: 0,
                    take: 1,
                    label: "Aktueller Monat",
                },
                {
                    type: "all",
                },
            ],
            showPercentage: true,
        },
        charts: {
            days: 31,
        },
    };

    private async created() {
        //TODO: load settings from chrome storage if exists
    }
}

export default new SettingsModule();
<template>
    <div class="stats-dialog" v-if="value" @click="close($event)">
        <div
            class="stats-dialog-content"
            :style="
                activeTab.color != null
                    ? `--color: ${getColorVar(activeTab.color)}`
                    : null
            "
        >
            <nav class="stats-dialog-nav">
                <ul class="nav">
                    <li
                        v-for="tabItem in tabItems"
                        :key="tabItem.name"
                        :class="{
                            'nav-item': !tabItem.disabled,
                            'nav-item-active': activeTab == tabItem,
                            'flex-grow-1': tabItem.flex,
                        }"
                        :style="
                            tabItem.color != null
                                ? `--color: ${getColorVar(tabItem.color)}`
                                : null
                        "
                        @click="
                            tabItem.disabled
                                ? null
                                : tabItem.customAction
                                ? tabItem.customAction()
                                : (activeTab = tabItem)
                        "
                    >
                        <icon
                            v-if="tabItem.icon != null"
                            :name="tabItem.icon"
                        />
                        <span v-if="tabItem.label != null">
                            {{ tabItem.label }}
                        </span>
                    </li>
                </ul>

                <div class="close-stats-dialog-wrapper">
                    <icon name="close"
                        @click="$emit('input', false)"
                    />
                </div>
            </nav>
            <main class="stats-dialog-body">
                <expedition-stats
                    v-if="activeTab.name == 'expos'"
                    class="stats-dialog-body-content"
                />

                <battles-stats
                    v-else-if="activeTab.name == 'battles'"
                    class="stats-dialog-body-content"
                />

                <debris-field-stats
                    v-else-if="activeTab.name == 'debrisFields'"
                    class="stats-dialog-body-content"
                />
                <span v-else-if="activeTab.name == 'settings'">
                    <settings />
                </span>
            </main>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from "vue-property-decorator";
    import ExpeditionStats from "./expeditions/ExpeditionStats.vue";
    import BattlesStats from "./battles/BattlesStats.vue";
    import DebrisFieldStats from "./debrisFields/DebrisFieldStats.vue";
    import Settings from "./settings/Settings.vue";
    import ExcelExport from '@/export/ExcelExport';
    import { HexColor, hexColorToRGB } from "@/utils/colors";
    import i18n from "@/i18n";

    interface TabItem {
        label?: string;
        name: string;
        icon?: string;
        disabled?: boolean;
        flex?: boolean;
        color?: HexColor;
        customAction?: () => void;
    }

    @Component({
        components: {
            ExpeditionStats,
            BattlesStats,
            DebrisFieldStats,
            Settings,
        },
    })
    export default class StatsDialog extends Vue {
        @Prop({ type: Boolean, required: true })
        private value!: boolean;

        private readonly tabItems: TabItem[] = [{
            name: 'expos',
            icon: 'expo',
            color: '#0066ff',
            label: i18n.messages.extension.headers.expeditions,
        }, {
            name: 'battles',
            icon: 'attack',
            color: '#c51b00',
            label: i18n.messages.extension.headers.battles,
        }, {
            name: 'debrisFields',
            icon: 'debris-field',
            color: '#00a031',
            label: i18n.messages.extension.headers.debrisFields,
        }, {
            name: 'placeholder_0',
            disabled: true,
            flex: true,
        }, {
            name: 'settings',
            icon: 'cog',
            color: '#888888',
            label: i18n.messages.extension.headers.settings,
        }, {
            name: 'excelExport',
            icon: 'microsoft-excel',
            color: '#21a366',
            customAction: this.excelExport,
        }];

        private activeTab = this.tabItems[0];


        private excelExport() {
            ExcelExport.export();
        }

        private getColorVar(color: HexColor): string {
            return hexColorToRGB(color).replace(/\s+/g, ', ');
        }

        private close($event: Event) {
            const path = $event.composedPath();
            if (path[0] != this.$el) {
                return;
            }

            this.$emit('input', false);
        }
    }
</script>
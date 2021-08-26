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
                                : 'customAction' in tabItem
                                ? tabItem.customAction()
                                : (activeTab = tabItem)
                        "
                    >
                        <icon
                            v-if="tabItem.icon != null"
                            :name="tabItem.icon" 
                            :style="tabItem.iconStyle"
                        />
                        <span v-if="tabItem.label != null">
                            {{ tabItem.label }}
                        </span>
                    </li>
                </ul>

                <div class="close-stats-dialog-wrapper">
                    <icon name="close" @click="$emit('input', false)" />
                </div>
            </nav>
            <main class="stats-dialog-body">
                <component
                    v-if="'component' in activeTab"
                    :is="activeTab.component"
                />
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
    import ResourceOverview from '@/components/resourceOverview/ResourceOverview.vue';
    import EmpireOverview from '@/components/empire/EmpireOverview.vue';
    import Info from '@/components/info/Info.vue';

    type TabItem = {
        label?: string;
        name: string;
        icon?: string;
        iconStyle?: any;
        disabled?: boolean;
        flex?: boolean;
        color?: HexColor;
    } & (
            { placeholder: true; }
            | { customAction: () => void; }
            | { component: string; }
        );

    @Component({
        components: {
            ExpeditionStats,
            BattlesStats,
            DebrisFieldStats,
            Settings,
            ResourceOverview,
            EmpireOverview,
            Info,
        },
    })
    export default class StatsDialog extends Vue {
        @Prop({ type: Boolean, required: true })
        private value!: boolean;

        private readonly tabItems: TabItem[] = [
            {
                name: 'expos',
                icon: 'expo',
                color: '#0066ff',
                label: i18n.messages.extension.headers.expeditions,
                component: 'expedition-stats',
            },
            {
                name: 'battles',
                icon: 'attack',
                color: '#c51b00',
                label: i18n.messages.extension.headers.battles,
                component: 'battles-stats',
            },
            {
                name: 'debrisFields',
                icon: 'debris-field',
                color: '#00a031',
                label: i18n.messages.extension.headers.debrisFields,
                component: 'debris-field-stats',
            },
            {
                name: 'resourceOverview',
                icon: 'economy',
                color: '#a9460c',
                label: i18n.messages.extension.headers.resourcesOverview,
                component: 'resource-overview',
                iconStyle: {
                    fontSize: '32px',
                },
            },
            {
                name: 'empire',
                icon: 'planet-moon',
                color: '#5000d0',
                label: 'LOCA: empire',
                component: 'empire-overview',
            },
            {
                name: 'tools',
                icon: 'tools',
                color: '#008c85',
                label: 'LOCA: Tools',
                component: null!,
                iconStyle: {
                    fontSize: '24px',
                },
            },
            {
                name: 'placeholder_0',
                disabled: true,
                flex: true,
                placeholder: true,
            },
            {
                name: 'settings',
                icon: 'cog',
                color: '#888888',
                label: i18n.messages.extension.headers.settings,
                component: 'settings',
            },
            {
                name: 'excelExport',
                icon: 'microsoft-excel',
                color: '#21a366',
                customAction: this.excelExport,
                iconStyle: {
                    marginRight: '3px',
                },
            },
            {
                name: 'info',
                icon: 'information',
                color: '#8c8ce0',
                component: 'info',
            },
        ];

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
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
                        <span
                            v-else-if="tabItem.customIcon != null"
                            :class="tabItem.customIcon"
                        />

                        <span v-if="tabItem.label != null">
                            {{ tabItem.label }}
                        </span>
                    </li>
                </ul>

                <div class="close-stats-dialog-wrapper">
                    <span
                        class="close-stats-dialog-button"
                        @click="$emit('input', false)"
                    >
                        ×
                    </span>
                </div>
            </nav>
            <main class="stats-dialog-body">
                <expedition-stats
                    v-if="activeTab.name == 'expos'"
                    class="stats-dialog-body-content"
                />

                <battle-stats
                    v-else-if="activeTab.name == 'battles'"
                    class="stats-dialog-body-content"
                />

                <wreckfield-stats
                    v-else-if="activeTab.name == 'wreckfields'"
                    class="stats-dialog-body-content"
                />

                <!-- 
                    <code style="white-space: pre">
                        msg_title: "Schürfbericht von TF auf [8:220:15]."
                        <br />
                        <br />
                        msg_content: "Deine (Recycler|Pathfinder|?) (1 Schiffe)
                        haben eine Gesamtladekapazität von 34.000. Am Ziel
                        [8:220:15] treiben 0 Metall und 11.500 Kristall im Raum.
                        Du hast 0 Metall und 11.500 Kristall abgebaut."
                    </code>
                </span> -->

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
    import BattleStats from "./battles/BattleStats.vue";
    import WreckfieldStats from "./wreckfields/WreckfieldStats.vue";
    import Settings from "./settings/Settings.vue";
    import ExcelExport from '@/export/ExcelExport';
    import { HexColor, hexColorToRGB } from "@/utils/colors";
import i18n from "@/i18n";

    interface TabItem {
        label?: string;
        name: string;
        icon?: string;
        customIcon?: string;
        disabled?: boolean;
        flex?: boolean;
        color?: HexColor;
        customAction?: () => void;
    }

    @Component({
        components: {
            ExpeditionStats,
            BattleStats,
            WreckfieldStats,
            Settings,
        },
    })
    export default class StatsDialog extends Vue {
        @Prop({ type: Boolean, required: true })
        private value!: boolean;

        private readonly tabItems: TabItem[] = [{
            name: 'expos',
            customIcon: 'icon-expo',
            color: '#0066ff',
            label: i18n.messages.extension.headers.expeditions,
        }, {
            name: 'battles',
            customIcon: 'icon-attack',
            color: '#c51b00',
            label: i18n.messages.extension.headers.battles,
        }, {
            name: 'wreckfields',
            customIcon: 'icon-wreckfield',
            color: '#00a031',
            label: i18n.messages.extension.headers.wreckfields,
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

<style lang="scss" scoped>
    @import "@/styles/colors";

    $padding: 50px;

    .stats-dialog {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 10000;
        padding: $padding;

        &::before {
            content: "";
            position: absolute;
            z-index: -1;
            background: rgba(0, 0, 0, 0.5);
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
        }
    }

    .stats-dialog-content {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-rows: auto 1fr;
        border-radius: 6px;
        overflow: hidden;

        background-color: black;
        background-image: linear-gradient(
            52deg,
            rgba(var(--color), 0.02),
            rgba(var(--color), 0.08)
        );
    }

    .stats-dialog-nav {
        display: flex;
        flex-direction: row;
        border-bottom: 2px solid rgb(var(--color));
    }

    .flex-grow-1 {
        flex-grow: 1;
    }

    .nav {
        display: flex;
        flex-direction: row;
        list-style: none;
        margin: 0;
        padding: 0;
        flex-grow: 1;

        .nav-item {
            line-height: 50px;
            height: 50px;
            font-size: 13px;
            padding: 0 16px;
            cursor: pointer;
            display: flex;
            align-items: center;

            .mdi {
                font-size: 24px;
                margin-right: 6px;
            }

            &:hover {
                background: linear-gradient(
                    180deg,
                    rgba(var(--color), 0.25),
                    rgba(var(--color), 0.5)
                );
            }

            &-active,
            &-active:hover {
                background: linear-gradient(
                    180deg,
                    rgba(var(--color), 0.5),
                    rgb(var(--color))
                );
            }
        }
    }

    .close-stats-dialog-wrapper {
        min-width: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
    }

    .close-stats-dialog-button {
        cursor: pointer;
        color: grey;

        &:hover {
            color: white;
        }
    }

    .stats-dialog-body {
        overflow: hidden;
        padding: 16px 16px 32px 16px;
    }

    .icon-expo,
    .icon-attack,
    .icon-wreckfield {
        display: inline-block;
        width: 1em;
        height: 1em;
        position: relative;
        font-size: 36px;

        &::before {
            content: "";
            background-repeat: no-repeat;
            background-size: contain;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    }

    .icon-expo::before {
        background-image: url(~@/assets/icons/expedition.svg);
    }
    .icon-attack::before {
        background-image: url(~@/assets/icons/attack.svg);
    }
    .icon-wreckfield::before {
        background-image: url(~@/assets/icons/wreckfield.svg);
    }
</style>
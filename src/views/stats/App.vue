<template>
    <div
        id="app"
        :style="{
            '--color': getColorVariable(activeColor),
        }"
    >
        <span v-if="loading"> LOCA: loading... </span>

        <template v-else>
            <nav>
                <component
                    :is="
                        tab.to != null
                            ? 'router-link'
                            : tab.href != null
                            ? 'a'
                            : 'div'
                    "
                    v-for="tab in tabs"
                    :key="tab.key"
                    :href="tab.href"
                    :target="tab.href != null ? '_blank' : null"
                    :to="tab.to"
                    :active-class="tab.to != null ? 'nav-item-active' : null"
                    :class="[
                        {
                            'nav-item': tab.noNavItem != true,
                            'icon-only': tab.label == null && tab.icon != null,
                        },
                        tab.class,
                    ]"
                    :style="[
                        {
                            '--color': getColorVariable(getColor(tab)),
                        },
                        tab.style,
                    ]"
                    @click="
                        () =>
                            tab.customAction != null ? tab.customAction() : null
                    "
                >
                    <span
                        v-if="tab.icon != null"
                        class="nav-item-icon"
                        :class="tab.icon"
                    />
                    <span v-if="tab.label != null" class="nav-item-label">
                        <span v-text="tab.label" />
                        <span
                            v-if="
                                tab.keyboardKey != null &&
                                tab.keyboardIcon != null
                            "
                            class="nav-item-keyboard-shortcut-icon"
                            :class="tab.keyboardIcon"
                        />
                    </span>
                </component>

                <template v-if="isIframeMode">
                    <div style="width: 24px" />
                    <div class="nav-item icon-only" style="--color: none">
                        <span
                            class="mdi mdi-close close-overlay"
                            @click="closeOverlay()"
                        />
                    </div>
                </template>
            </nav>
            <main>
                <router-view />
            </main>
        </template>

        <custom-dialog
            v-if="showAccountSwitchDialog"
            show-close
            @close="showAccountSwitchDialog = false"
        >
            <span
                v-if="knownAccounts.length == 0"
                v-text="'LOCA: loading...'"
            />
            <div v-else>
                LOCA: Look at data of account
                <select @change="gotoAccount()" v-model="selectedAccountIndex">
                    <option
                        v-for="(account, i) in knownAccounts"
                        :key="account.key"
                        :value="i"
                    >
                        {{ account.name || account.id }} ({{
                            account.universeName || account.universeId
                        }}
                        {{ account.universeLanguage.toUpperCase() }})
                    </option>
                </select>
            </div>
        </custom-dialog>
    </div>
</template>

<script lang="ts">
    import { LocalPlayerData } from "@/shared/models/v1/empire/LocalPlayerData";
    import { parseIntSafe } from "@/shared/utils/parseNumbers";
    import { Component, Vue, Watch } from "vue-property-decorator";
    import { closeOgameTrackerDialogEventName } from '../../shared/messages/communication';
    import { CombatReportDataModule } from "./data/CombatReportDataModule";
    import { DebrisFieldReportDataModule } from "./data/DebrisFieldReportDataModule";
    import { EmpireDataModule } from "./data/EmpireDataModule";
    import { ExpeditionDataModule } from "./data/ExpeditionDataModule";
    import { SettingsDataModule } from "./data/SettingsDataModule";
    import { IDataModule } from "./data/IDataModule";

    interface Tab {
        key: string;
        to?: { name: string };
        href?: string;
        icon?: string;
        label?: string;
        style?: string | Record<string, any>;
        noNavItem?: boolean;
        color?: string;
        class?: string;
        customAction?: () => void;

        keyboardKey?: string;
        keyboardIcon?: string;
    }

    interface KnownAccount {
        key: string;

        id: number;
        universeId: number;
        universeLanguage: string;

        name?: string;
        universeName?: string;
    }

    @Component
    export default class App extends Vue {

        private loading = true;

        private knownAccounts: KnownAccount[] = [];
        private selectedAccountIndex = -1;
        private showAccountSwitchDialog = false;

        private get isIframeMode() {
            const params = new URLSearchParams(location.search);
            return params.get('iframe') != null;
        }

        private get tabs(): Tab[] {
            const tabs: Tab[] = [
                {
                    key: 'expeditions',
                    to: { name: 'expeditions' },
                    icon: 'ogti ogti-expedition',
                    label: 'LOCA: Expeditionen',
                    keyboardKey: '1',
                    keyboardIcon: 'mdi mdi-numeric-1',
                },
                {
                    key: 'combats',
                    to: { name: 'combats' },
                    icon: 'ogti ogti-attack',
                    label: 'LOCA: Kämpfe',
                    keyboardKey: '2',
                    keyboardIcon: 'mdi mdi-numeric-2',
                },
                {
                    key: 'debris-fields',
                    to: { name: 'debris-fields' },
                    icon: 'ogti ogti-debris-field',
                    label: 'LOCA: Trümmerfelder',
                    keyboardKey: '3',
                    keyboardIcon: 'mdi mdi-numeric-3',
                },
                {
                    key: 'resource-overview',
                    to: { name: 'resource-overview' },
                    icon: 'ogti ogti-economy',
                    label: 'LOCA: Rohstoffbilanz',
                    keyboardKey: '4',
                    keyboardIcon: 'mdi mdi-numeric-4',
                },
                {
                    key: 'empire',
                    to: { name: 'empire' },
                    icon: 'ogti ogti-planet-moon',
                    label: 'LOCA: Imperium',
                    keyboardKey: '5',
                    keyboardIcon: 'mdi mdi-numeric-5',
                },
                {
                    key: 'tools',
                    to: { name: 'tools' },
                    icon: 'mdi mdi-tools',
                    label: 'LOCA: Tools',
                    keyboardKey: '6',
                    keyboardIcon: 'mdi mdi-numeric-6',
                },
                {
                    key: 'points',
                    to: { name: 'points' },
                    icon: 'mdi mdi-chart-timeline-variant',
                    label: 'LOCA: Points',
                    keyboardKey: '7',
                    keyboardIcon: 'mdi mdi-numeric-7',
                },
                {
                    key: 'space',
                    style: {
                        'flex-grow': 1
                    },
                    noNavItem: true,
                },
                {
                    key: 'settings',
                    to: { name: 'settings' },
                    icon: 'mdi mdi-cog',
                },
                {
                    key: 'excel-export',
                    to: { name: 'excel-export' },
                    icon: 'mdi mdi-microsoft-excel',
                },
                {
                    key: 'info',
                    to: { name: 'info' },
                    icon: 'mdi mdi-information',
                },
                {
                    key: 'donate',
                    to: { name: 'donate' },
                    icon: 'mdi mdi-coffee',
                    label: 'LOCA: Donate',
                    class: 'donate',
                },
                {
                    key: 'discord',
                    href: 'https://discord.gg/MZE9FrCwRj',
                    icon: 'ogti ogti-discord',
                    color: '#5865f2',
                },
            ];

            if (!this.isIframeMode) {
                tabs.push({
                    key: 'switch-account',
                    customAction: () => this.showAccountSwitchDialog = true,
                    icon: 'mdi mdi-account-multiple',
                    color: '#666666',
                });
            }

            return tabs;
        }

        private get activeColor(): string | null {
            const matchedRoutes = this.$route.matched;
            return matchedRoutes.map(route => route.meta?.color)
                .find(color => color != null)
                ?? null;
        }

        private getColor(tab: Tab): string | null {
            if (tab.color != null) {
                return tab.color;
            }

            const routes = this.$router.getRoutes();
            const route = routes.find(route => route.name == tab.to?.name);

            return route?.meta?.color ?? null;
        }

        private getColorVariable(hexColor: string | null): string | null {
            if (hexColor == null) {
                return null;
            }

            hexColor = hexColor.substring(1); // remove # at start
            const r = parseInt(hexColor.substring(0, 2), 16);
            const g = parseInt(hexColor.substring(2, 4), 16);
            const b = parseInt(hexColor.substring(4, 6), 16);

            return `${r}, ${g}, ${b}`;
        }


        private closeOverlay() {
            window.parent.postMessage(closeOgameTrackerDialogEventName, '*');
        }

        private async mounted() {
            window.addEventListener('keypress', e => {
                if (e.composedPath().some(elem => elem instanceof HTMLInputElement)) {
                    return;
                }

                const selectedTab = this.tabs.find(tab => tab.keyboardKey == e.key);
                const to = selectedTab?.to;
                if (to != null && !this.$route.matched.some(route => route.name == to.name)) {
                    this.$router.push(to);
                }
            });


            const dataModules: IDataModule[] = [
                CombatReportDataModule,
                DebrisFieldReportDataModule,
                EmpireDataModule,
                ExpeditionDataModule,
                SettingsDataModule,
            ];
            const loadPromises = dataModules.map(mod => mod.load());
            await Promise.all(loadPromises);

            //TODO: set window title to include universe name (if available), universe id, player name (if available), and player id

            this.loading = false;

            if (!this.isIframeMode) {
                await this.loadKnownAccounts();
            }
        }

        private async loadKnownAccounts(): Promise<void> {
            const all = await chrome.storage.local.get(null);
            const localPlayerKeys = Object.keys(all).filter(key => key.endsWith('-local-player'));
            const accounts: KnownAccount[] = localPlayerKeys.map(key => {
                const split = key.split('-');
                const localPlayer = all[key] as LocalPlayerData;
                const id = parseIntSafe(split[2], 10);
                const uniId = parseIntSafe(split[0].substring(1), 10);
                const uniLang = split[1];
                const { name, universeName } = localPlayer;

                return {
                    key: key.replace('-local-player', ''),
                    id,
                    universeId: uniId,
                    universeLanguage: uniLang,
                    name,
                    universeName,
                };
            });

            this.knownAccounts = accounts.sort((a, b) => {
                const lang = a.universeLanguage.localeCompare(b.universeLanguage);
                if (lang != 0) {
                    return lang;
                }

                if (a.universeName != null && b.universeName == null) {
                    return -1;
                }
                if (a.universeName == null && b.universeName != null) {
                    return 1;
                }

                const uniId = a.universeId - b.universeId;
                if (uniId != 0) {
                    return uniId;
                }

                if (a.name != null && b.name == null) {
                    return -1;
                }
                if (a.name == null && b.name != null) {
                    return 1;
                }

                return a.id - b.id;
            });
        }

        private gotoAccount(): void {
            const account = this.knownAccounts[this.selectedAccountIndex];
            const url = `/views/stats.html?player=${account.id}&language=${account.universeLanguage}&server=${account.universeId}`;
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }
</script>

<style lang="scss" scoped>
    #app {
        color: white;
        height: 100vh;

        display: grid;
        grid-template-rows: auto 1fr;

        background-color: black;
        background-image: linear-gradient(
            52deg,
            rgba(var(--color), 0.02),
            rgba(var(--color), 0.08)
        );

        overflow: auto;
    }

    nav {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;

        border-bottom: 2px solid rgb(var(--color));
    }

    .nav-item {
        height: 50px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        cursor: pointer;
        text-decoration: none;
        padding: 0 12px 0 6px;

        &.icon-only {
            padding: 0 12px;
        }

        &.nav-item-active,
        &.nav-item-active:hover {
            background: linear-gradient(
                to bottom,
                rgba(var(--color), 0.7),
                rgb(var(--color))
            );
        }
        &:hover {
            background: linear-gradient(
                to bottom,
                rgba(var(--color), 0.25),
                rgba(var(--color), 0.5)
            );
        }

        &-label {
            position: relative;
        }

        &-keyboard-shortcut-icon {
            font-size: 16px;
            position: absolute;
            top: -14px;
            left: -5px;
        }

        > .ogti {
            font-size: 36px;
        }
        > .mdi {
            font-size: 28px;
        }

        > .ogti + *,
        > .mdi + * {
            margin-left: 6px;
        }
    }

    main {
        padding: 16px;
        overflow: hidden;
    }

    .close-overlay {
        opacity: 0.5;
        cursor: pointer;

        &:hover {
            opacity: 1;
        }
    }

    .nav-item.donate:not(:hover):not(.nav-item-active) {
        color: rgb(var(--color));
    }
</style>

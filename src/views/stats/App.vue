<template>
    <div
        id="app"
        :style="{
            '--color': getColorVariable(activeColor),
        }"
        :class="activeTab ? activeTab.appClass : ''"
    >
        <span v-if="loading"> LOCA: loading... </span>

        <template v-else>
            <nav>
                <floating-menu
                    :value="tabWithMenu == tab"
                    @input="tabWithMenu = null"
                    v-for="tab in tabs"
                    :key="tab.key"
                    :style="tab.noNavItem ? tab.style : null"
                    class="tab_floating-menu"
                >
                    <template #activator>
                        <component
                            :is="
                                tab.to != null
                                    ? 'router-link'
                                    : tab.href != null
                                    ? 'a'
                                    : 'div'
                            "
                            :href="tab.href"
                            :target="tab.href != null ? '_blank' : null"
                            :to="tab.to"
                            :active-class="
                                tab.to != null ? 'nav-item-active' : null
                            "
                            :class="[
                                {
                                    'nav-item': tab.noNavItem != true,
                                    'icon-only':
                                        tab.label == null && tab.icon != null,
                                },
                                tab.class,
                            ]"
                            :style="[
                                {
                                    '--color': getColorVariable(getColor(tab)),
                                },
                                tab.noNavItem ? null : tab.style,
                            ]"
                            @click.left="
                                () =>
                                    tab.customAction != null
                                        ? tab.customAction()
                                        : null
                            "
                            :ref="`tab-${tab.key}`"
                        >
                            <span
                                v-if="tab.icon != null"
                                class="nav-item-icon"
                                :class="tab.icon"
                            />
                            <span
                                v-if="tab.label != null"
                                class="nav-item-label"
                            >
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
                            <span
                                v-if="isDefaultRoute(tab.to)"
                                class="nav-item-home-icon mdi mdi-home"
                            />
                        </component>
                    </template>

                    <set-default-route-button
                        v-if="tab.canBeDefault"
                        :label="'LOCA: Set as default'"
                        rootRouteName=""
                        :routeName="tab.to.name"
                    />
                </floating-menu>

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
            <footer>
                <router-link
                    :to="{ name: 'donate' }"
                    style="text-decoration: none"
                >
                    made with
                    <span class="mdi mdi-heart" style="color: #ff1f1f" /> by
                    Wonkydonky
                </router-link>
            </footer>
        </template>

        <custom-dialog
            v-if="showAccountSwitchDialog"
            show-close
            @close="showAccountSwitchDialog = false"
            :style="`--color: ${getColorVariable(colors.switchAccount)};`"
        >
            <span
                v-if="knownAccounts.length == 0"
                v-text="'LOCA: loading...'"
            />
            <div v-else>
                <div v-text="'LOCA: Look at data of account'" />
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
    import { LocalPlayerData } from "@/shared/models/empire/LocalPlayerData";
    import { parseIntSafe } from "@/shared/utils/parseNumbers";
    import { Component, Vue, Watch } from "vue-property-decorator";
    import { closeOgameTrackerDialogEventName } from '../../shared/messages/communication';
    import { EmpireDataModule } from "./data/EmpireDataModule";
    import { GlobalOgameMetaData } from "./data/GlobalOgameMetaData";
    import { getRGBString } from './utils/getRGBString';
    import { delay } from '@/shared/utils/delay';
    import { _throw } from "@/shared/utils/_throw";
    import { SettingsDataModule } from "./data/SettingsDataModule";
    import SetDefaultRouteButton from "@stats/components/settings/SetDefaultRouteButton.vue";

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
        appClass?: string;
        customAction?: () => void;
        canBeDefault?: boolean;

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

    @Component({
        components: {
            SetDefaultRouteButton,
        },
    })
    export default class App extends Vue {
        private readonly colors = {
            switchAccount: '#666666',
            discord: '#5865f2',
        };

        private loading = true;

        private knownAccounts: KnownAccount[] = [];
        private knownAccountsLoaded = false;
        private selectedAccountIndex = -1;
        private showAccountSwitchDialog = false;

        private get isIframeMode() {
            const params = new URLSearchParams(location.search);
            return params.get('iframe') != null;
        }

        private get activeTab(): Tab | null {
            return this.tabs.find(tab => tab.to != null &&
                this.$route.matched.some(route => route.name == tab.to?.name)
            ) ?? null;
        }

        private tabWithMenu: Tab | null = null;

        private setTabWithMenu(tab: Tab) {
            this.tabWithMenu = tab;
        }

        private isDefaultRoute(to?: { name: string }): boolean {
            if (to == null) {
                return false;
            }

            const defaultRoute = SettingsDataModule.settings.defaultRoutes[''] ?? 'expeditions';
            return defaultRoute == to.name;
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
                    canBeDefault: true,
                },
                {
                    key: 'combats',
                    to: { name: 'combats' },
                    icon: 'ogti ogti-attack',
                    label: 'LOCA: Kämpfe',
                    keyboardKey: '2',
                    keyboardIcon: 'mdi mdi-numeric-2',
                    canBeDefault: true,
                },
                {
                    key: 'debris-fields',
                    to: { name: 'debris-fields' },
                    icon: 'ogti ogti-debris-field',
                    label: 'LOCA: Trümmerfelder',
                    keyboardKey: '3',
                    keyboardIcon: 'mdi mdi-numeric-3',
                    canBeDefault: true,
                },
                {
                    key: 'resource-overview',
                    to: { name: 'resource-overview' },
                    icon: 'ogti ogti-economy',
                    label: 'LOCA: Rohstoffbilanz',
                    keyboardKey: '4',
                    keyboardIcon: 'mdi mdi-numeric-4',
                    canBeDefault: true,
                },
                {
                    key: 'empire',
                    to: { name: 'empire' },
                    icon: 'ogti ogti-planet-moon',
                    label: 'LOCA: Imperium',
                    keyboardKey: '5',
                    keyboardIcon: 'mdi mdi-numeric-5',
                    canBeDefault: true,
                },
                {
                    key: 'tools',
                    to: { name: 'tools' },
                    icon: 'mdi mdi-tools',
                    label: 'LOCA: Tools',
                    keyboardKey: '6',
                    keyboardIcon: 'mdi mdi-numeric-6',
                    canBeDefault: true,
                },
                {
                    key: 'universe-history',
                    to: { name: 'universe-history' },
                    icon: 'mdi mdi-chart-timeline-variant-shimmer',
                    label: 'LOCA: Universe History',
                    keyboardKey: '7',
                    keyboardIcon: 'mdi mdi-numeric-7',
                    canBeDefault: true,
                },
                {
                    key: 'espionage',
                    to: { name: 'espionage' },
                    icon: 'mdi mdi-eye-outline',
                    label: 'LOCA: Espionage',
                    keyboardKey: '8',
                    keyboardIcon: 'mdi mdi-numeric-8',
                    canBeDefault: true,
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
                    key: 'donate',
                    to: { name: 'donate' },
                    icon: 'mdi mdi-coffee',
                    label: 'LOCA: Donate',
                    class: 'donate',
                    appClass: 'donate-page',
                },
                {
                    key: 'discord',
                    href: 'https://discord.gg/MZE9FrCwRj',
                    icon: 'ogti ogti-discord',
                    color: this.colors.discord,
                },
                {
                    key: 'help',
                    to: { name: 'help' },
                    icon: 'mdi mdi-help-box',
                },
            ];

            if (!this.isIframeMode) {
                tabs.push({
                    key: 'switch-account',
                    customAction: async () => await this.initAccountDialog(),
                    icon: 'mdi mdi-account-multiple',
                    color: this.colors.switchAccount,
                });
            }

            return tabs;
        }

        private async initAccountDialog() {
            this.showAccountSwitchDialog = true;

            if (!this.knownAccountsLoaded) {
                await this.loadKnownAccounts();
                this.knownAccountsLoaded = true;
            }
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
            return getRGBString(hexColor);
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

            //TODO: await EmpireDataModule.load();
            await document.fonts.ready;
            await delay(500);

            this.updateDocumentTitle();

            this.loading = false;
            await this.$nextTick();
            this.onRefsChanged();
            window.focus();

            const splashscreen = document.querySelector('#splashscreen');
            splashscreen?.classList.add('fade');
            setTimeout(() => splashscreen?.remove(), 500);
        }

        private onRefsChanged() {
            // this method exists because @contextmenu does not seem to get passed to dynamic <component>
            const refKeys = Object.keys(this.$refs).filter(key => key.startsWith('tab-'));
            refKeys.forEach(key => {
                const tabKey = key.substring('tab-'.length);
                const tab = this.tabs.find(tab => tab.key == tabKey) ?? _throw(`tab with key '${tabKey}' not found`);

                if (!tab.canBeDefault) {
                    return;
                }

                const refElem = (this.$refs[key] as Vue[])[0];
                refElem.$el.addEventListener('contextmenu', e => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.setTabWithMenu(tab);
                });
            });
        }

        private updateDocumentTitle() {
            const ogameMeta = GlobalOgameMetaData;

            const serverName = EmpireDataModule.empire!.universeName;//TODO: !
            const serverId = ogameMeta.serverId;
            const serverLang = ogameMeta.language;

            const playerName = EmpireDataModule.empire!.name;//TODO: !
            const playerId = ogameMeta.playerId;

            const playerText = playerName != null
                ? `${playerName} (${playerId})`
                : playerId.toString();

            const serverText = serverName != null
                ? `${serverLang.toUpperCase()} ${serverName} (${serverId})`
                : `${serverLang.toUpperCase()} ${serverId}`;

            document.title = `${playerText} - ${serverText}`;
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

            this.showAccountSwitchDialog = false;
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

        &-home-icon {
            position: absolute;
            left: 2px;
            bottom: -2px;
            font-size: 12px !important;
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
        padding: 16px 16px 8px 16px;
        overflow: hidden;
    }
    footer {
        padding: 0 8px 4px 16px;
    }

    .close-overlay {
        opacity: 0.5;
        cursor: pointer;

        &:hover {
            opacity: 1;
        }
    }

    .nav-item.donate {
        font-weight: bold;

        &:not(:hover):not(.nav-item-active) {
            color: rgb(var(--color));
        }

        &:hover {
            background: rgba(var(--color), 0.5);
            text-shadow: 0 0 3px black, 0 0 8px rgb(var(--color)),
                0 0 16px rgb(var(--color)), 0 0 24px rgb(var(--color));
        }

        &.nav-item-active,
        &.nav-item-active:hover {
            background: rgb(var(--color));
            color: black;
            text-shadow: none;
        }
    }

    #app.donate-page {
        background: black linear-gradient(180deg, rgb(var(--color)), #ffc165);

        main {
            color: black;
        }

        footer {
            color: black;
        }

        nav {
            background: black;
        }
    }

    .tab_floating-menu {
        &::v-deep .floating-menu {
            left: 50%;
            top: 50%;
            z-index: 0 !important;
        }
    }
</style>

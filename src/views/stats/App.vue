<template>
    <div
        id="app"
        :style="{
            '--color': getColorVariable(activeColor),
        }"
    >
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
                :class="{
                    'nav-item': tab.noNavItem != true,
                    'icon-only': tab.label == null && tab.icon != null,
                }"
                :style="[
                    {
                        '--color': getColorVariable(getColor(tab)),
                    },
                    tab.style,
                ]"
            >
                <span v-if="tab.icon != null" :class="tab.icon" />
                <span v-if="tab.label != null" v-text="tab.label" />
            </component>

            <div
                v-if="isIframeMode"
                class="nav-item icon-only"
                style="--color: none"
            >
                <span
                    class="mdi mdi-close close-overlay"
                    @click="closeOverlay()"
                />
            </div>
        </nav>
        <main>
            <router-view />
        </main>
        <footer v-if="!isIframeMode">
            TODO: Switch between different accounts/servers here
        </footer>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from "vue-property-decorator";
    import { closeOgameTrackerDialogEventName } from '../../shared/messages/communication';
    import { GlobalOgameMetaData } from "./data/GlobalOgameMetaData";

    interface Tab {
        key: string;
        to?: { name: string };
        href?: string;
        icon?: string;
        label?: string;
        style?: string | Record<string, any>;
        noNavItem?: boolean;
        color?: string;
    }

    @Component
    export default class App extends Vue {
        private readonly port = chrome.runtime.connect();

        private get isIframeMode() {
            const params = new URLSearchParams(location.search);
            return params.get('iframe') != null;
        }

        private get tabs(): Tab[] {
            return [
                {
                    key: 'expeditions',
                    to: { name: 'expeditions' },
                    icon: 'ogti ogti-expedition',
                    label: 'LOCA: Expeditionen',
                },
                {
                    key: 'combats',
                    to: { name: 'combats' },
                    icon: 'ogti ogti-attack',
                    label: 'LOCA: Kämpfe',
                },
                {
                    key: 'debris-fields',
                    to: { name: 'debris-fields' },
                    icon: 'ogti ogti-debris-field',
                    label: 'LOCA: Trümmerfelder',
                },
                {
                    key: 'resource-balance',
                    to: { name: 'resource-balance' },
                    icon: 'ogti ogti-economy',
                    label: 'LOCA: Rohstoffbilanz',
                },
                {
                    key: 'empire',
                    to: { name: 'empire' },
                    icon: 'ogti ogti-planet-moon',
                    label: 'LOCA: Imperium',
                },
                {
                    key: 'tools',
                    to: { name: 'tools' },
                    icon: 'mdi mdi-tools', //TODO: fix
                    label: 'LOCA: Tools',
                },
                {
                    key: 'space',
                    style: {
                        'flex-grow': 1
                    },
                    noNavItem: true,
                },
                //TODO: remove, move settings to be inline with the usage(s)
                {
                    key: 'settings',
                    to: { name: 'settings' },
                    icon: 'mdi mdi-cog',
                    label: 'LOCA: Einstellungen',
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
                },
                {
                    key: 'discord',
                    href: 'https://discord.gg/MZE9FrCwRj',
                    icon: 'ogti ogti-discord',
                    color: '#5865f2',
                },
            ];
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
    }
</script>

<style lang="scss">
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
        padding: 0 8px;

        &.icon-only {
            padding: 0 12px;
        }

        &.nav-item-active,
        &.nav-item-active:hover {
            background: linear-gradient(
                to bottom,
                rgba(var(--color), 0.5),
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
    }

    .close-overlay {
        opacity: 0.5;
        cursor: pointer;

        &:hover {
            opacity: 1;
        }
    }
</style>

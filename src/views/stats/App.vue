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
                            tab.keyboardKey != null && tab.keyboardIcon != null
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
        <footer v-if="!isIframeMode">
            TODO: Switch between different accounts/servers here
        </footer>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import { closeOgameTrackerDialogEventName } from '../../shared/messages/communication';

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

        keyboardKey?: string;
        keyboardIcon?: string;
    }

    @Component
    export default class App extends Vue {
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

        private mounted() {
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

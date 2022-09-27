<template>
    <div class="tab-view">
        <header :style="{ '--tab-count': tabs.length }">
            <floating-menu
                v-for="(tab, i) in tabs"
                :key="i"
                :value="rootRouteName != null && showMenu[i] == true"
                @input="$set(showMenu, i, $event)"
                class="tab_floating-menu"
            >
                <template #activator>
                    <router-link :to="tab.to" class="tab" active-class="tab--active" ref="tabs">
                        <span class="tab-content">
                            <span v-if="tab.label != null" v-text="tab.label" />
                            <span v-if="isDefaultRoute(tab.to)" class="tab-item-home-icon mdi mdi-home" />
                        </span>
                    </router-link>
                </template>

                <set-default-route-button
                    v-if="rootRouteName != null"
                    :label="$i18n.$t.extension.settings.setDefaultSubRoute"
                    :rootRouteName="rootRouteName"
                    :routeName="tab.to.name"
                    @click="$set(showMenu, i, false)"
                />
            </floating-menu>
        </header>
        <main>
            <keep-alive>
                <router-view />
            </keep-alive>
        </main>
    </div>
</template>

<script lang="ts">
    import { PropType } from 'vue';
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import { RawLocation } from 'vue-router';
    import { SettingsDataModule } from '../../data/SettingsDataModule';
    import SetDefaultRouteButton from "@stats/components/settings/SetDefaultRouteButton.vue";

    export interface Tab {
        label?: string;
        to: RawLocation & { name: string };
    }

    @Component({
        components: {
            SetDefaultRouteButton,
        },
    })
    export default class TabView extends Vue {

        private showMenu: Record<number, boolean> = {};

        @Prop({ required: true, type: Array as PropType<Tab[]>, validator: (tabs: Tab[]) => tabs.length > 0 })
        private tabs!: Tab[];

        @Prop({ required: false, type: String, default: () => null })
        private rootRouteName!: string | null;

        private get defaultRouteName() {
            const routes = this.$router.getRoutes();
            const rootRoute = routes.find(route => route.name == this.rootRouteName);

            if (rootRoute?.redirect instanceof Object) {
                return rootRoute.redirect.name;
            }

            throw new Error('route without default route!');
        }

        private isDefaultRoute(to: { name: string }): boolean {
            if (this.rootRouteName == null) {
                return false;
            }

            const defaultRoute = SettingsDataModule.settings.defaultRoutes[this.rootRouteName] ?? this.defaultRouteName;
            return defaultRoute == to.name;
        }

        private async mounted() {
            await this.$nextTick();
            (this.$refs.tabs as Vue[]).forEach((component, i) => {
                const element = component.$el;
                element.addEventListener('contextmenu', e => {
                    e.preventDefault();

                    Object.keys(this.showMenu).forEach(key => this.showMenu[parseInt(key)] = false);
                    this.$set(this.showMenu, i, true);
                });
            });
        }
    }
</script>
<style lang="scss" scoped>
    .tab-view {
        display: grid;
        grid-template-rows: auto 1fr;
        height: 100%;

        > header {
            display: grid;
            grid-template-columns: repeat(var(--tab-count), 1fr);
            text-align: center;

            > .tab_floating-menu {
                display: flex;
                align-items: center;
                justify-content: center;

                &::v-deep .floating-menu {
                    z-index: 0;
                    left: unset;
                }

                > .tab {
                    width: 100%;
                    text-decoration: none;
                    padding: 8px;

                    background-color: rgba(var(--color), 0.15);

                    &:not(.tab--active):hover {
                        background-color: rgba(var(--color), 0.25);
                    }

                    &.tab--active {
                        background: linear-gradient(135deg, rgba(var(--color), 0.4), rgba(var(--color), 0.7));
                    }

                    &::v-deep {
                        .mdi::before,
                        .ogti::before {
                            transform: scale(1.5) translateX(-25%);
                        }
                    }
                }

                &:first-of-type > .tab {
                    border-top-left-radius: 4px;
                }
                &:last-of-type > .tab {
                    border-top-right-radius: 4px;
                }
            }
        }

        > main {
            border: 1px solid rgba(var(--color), 0.25);
            padding: 12px;
            overflow: auto;
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
            background: rgba(var(--color), 0.05);
        }
    }

    .tab-content {
        position: relative;

        .tab-item-home-icon {
            position: absolute;
            font-size: 7px;
            left: 50%;
            bottom: -9px;
            transform: translateX(-50%);
            opacity: 0.5;
        }
    }

    .tab--active {
        .tab-content .tab-item-home-icon {
            opacity: 1;
        }
    }
</style>
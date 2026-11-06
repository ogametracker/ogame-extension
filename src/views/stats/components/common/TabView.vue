<template>
    <div class="tab-view">
        <header :style="{ '--tab-count': tabs.length }">
            <floating-menu
                v-for="(tab, i) in tabs"
                :key="i"
                :model-value="rootRouteName != null && showMenu[i] == true"
                @update:model-value="showMenu[i] = $event"
                class="tab_floating-menu"
            >
                <template #activator>
                    <router-link :to="tab.to" class="tab" active-class="tab--active" @contextmenu="openDefaultMenu(i, $event)">
                        <span class="tab-content">
                            <span v-if="tab.label != null" v-text="tab.label" />
                            <span v-if="isDefaultRoute(tab.to)" class="tab-item-home-icon mdi mdi-home" />
                        </span>
                    </router-link>
                </template>

                <set-default-route-button
                    v-if="rootRouteName != null"
                    :label="translations().extension.settings.setDefaultSubRoute"
                    :rootRouteName="rootRouteName"
                    :routeName="tab.to.name"
                    @click="showMenu[i] = false"
                />
            </floating-menu>
        </header>
        <main>
            <router-view v-slot="{ Component }">
                <keep-alive>
                    <component :is="Component" />
                </keep-alive>
            </router-view>
        </main>
    </div>
</template>

<script lang="ts">
import type { RouteLocationRaw } from 'vue-router';

export interface Tab {
    label?: string;
    to: RouteLocationRaw & { name: string };
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { getDefaultRouteName } from '@stats/router';
import { translations } from '@stats/i18n';
import type { PropType } from 'vue';
import { useSettingsStore } from '../../data/SettingsDataModule';
import SetDefaultRouteButton from "@stats/components/settings/SetDefaultRouteButton.vue";

const props = defineProps({
    tabs: { required: true, type: Array as PropType<Tab[]>, validator: (tabs: Tab[]) => tabs.length > 0 },
    rootRouteName: { required: false, type: String as PropType<string | null>, default: () => null },
});

const settingsStore = useSettingsStore();

const showMenu = ref<Record<number, boolean>>({});

const defaultRouteName = computed(() => props.rootRouteName == null ? undefined : getDefaultRouteName(props.rootRouteName));

function isDefaultRoute(to: { name: string }): boolean {
    if (props.rootRouteName == null) {
        return false;
    }

    const defaultRoute = settingsStore.settings.defaultRoutes[props.rootRouteName] ?? defaultRouteName.value;
    return defaultRoute == to.name;
}

function openDefaultMenu(index: number, event: MouseEvent) {
    if (props.rootRouteName == null) {
        return;
    }
    event.preventDefault();
    showMenu.value = { [index]: true };
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

                &:deep(.floating-menu) {
                    z-index: 0;
                    left: unset;
                }

                > .tab {
                    width: 100%;
                    text-decoration: none;
                    padding: 8px;

                    background-color: rgba(var(--color), 0.15);

                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    &:not(.tab--active):hover {
                        background-color: rgba(var(--color), 0.25);
                    }

                    &.tab--active {
                        background: linear-gradient(135deg, rgba(var(--color), 0.4), rgba(var(--color), 0.7));
                    }

                    :deep(.mdi::before),
                    :deep(.ogti::before) {
                        transform: scale(1.5) translateX(-25%);
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

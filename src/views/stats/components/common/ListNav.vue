<template>
    <div class="nav-list" :style="{ overflow: showsAnyMenu ? 'visible' : undefined }">
        <floating-menu
            v-for="(item, i) in items"
            :key="i"
            :model-value="rootRouteName != null && showMenu[i] == true"
            @update:model-value="showMenu[i] = $event"
            class="nav-list_floating-menu"
        >
            <template #activator>
                <component
                    :is="item.to != null ? 'router-link' : 'a'"
                    class="nav-list-item"
                    :class="item.class"
                    v-bind="
                        item.href != null
                        ? { href: item.href }
                        : { to: item.to }
                    "
                    :target="item.target"
                    active-class="nav-list-item-active"
                    @contextmenu="openDefaultMenu(i, $event)"
                >
                    <span v-text="item.label" />
                    <span v-if="isDefaultRoute(item.to)" class="nav-list-item-home-icon mdi mdi-home" />
                </component>
            </template>

            <set-default-route-button
                v-if="rootRouteName != null && item.to != null"
                :label="translations().extension.settings.setDefaultSubRoute"
                :rootRouteName="rootRouteName"
                :routeName="item.to.name"
                @click="showMenu[i] = false"
            />
        </floating-menu>
    </div>
</template>

<script lang="ts">
import type { RouteLocationRaw } from 'vue-router';

export type ListNavItem = {
    label: string;
    class?: string;
} & (
        { to: RouteLocationRaw & { name: string }; href?: never; target?: never }
        | {
            to?: never;
            href: string;
            target?: string;
        }
    );
</script>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { getDefaultRouteName } from '@stats/router';
import { translations } from '@stats/i18n';
import type { PropType } from 'vue';
import SetDefaultRouteButton from "@stats/components/settings/SetDefaultRouteButton.vue";
import { useSettingsStore } from '../../data/SettingsDataModule';

const props = defineProps({
    items: { required: true, type: Array as PropType<ListNavItem[]> },
    rootRouteName: { required: false, type: String as PropType<string | null>, default: () => null },
});

const settingsStore = useSettingsStore();

const showMenu = ref<Record<number, boolean>>({});

const showsAnyMenu = computed(() => Object.values(showMenu.value).some(b => b));

const defaultRouteName = computed(() => props.rootRouteName == null ? undefined : getDefaultRouteName(props.rootRouteName));

function isDefaultRoute(to?: { name: string }): boolean {
    if (props.rootRouteName == null) {
        return false;
    }

    const defaultRoute = settingsStore.settings.defaultRoutes[props.rootRouteName] ?? defaultRouteName.value;
    return defaultRoute === to?.name;
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
    .nav-list {
        display: flex;
        flex-direction: column;
        min-width: 125px;
        gap: 2px;
        max-height: 100%;
        overflow: auto;
    }

    .nav-list-item {
        padding: 12px;
        border-radius: 4px;
        text-decoration: none;
        min-width: 140px;
        cursor: pointer;

        background: linear-gradient(to right, rgba(var(--color), 0.25) 30%, rgba(var(--color), 0.15));

        &:hover {
            background: linear-gradient(to right, rgba(var(--color), 0.5) 30%, rgba(var(--color), 0.3));
        }

        + .nav-list-item {
            margin-top: 2px;
        }

        &-home-icon {
            position: absolute;
            bottom: 0;
            left: 2px;
            font-size: 12px;
            opacity: 0.5;
        }
    }

    .nav-list-item-active,
    .nav-list-item-active:hover {
        background: linear-gradient(to right, rgba(var(--color), 0.8) 30%, rgba(var(--color), 0.6));

        .nav-list-item-home-icon {
            opacity: 1;
        }
    }

    .nav-list_floating-menu {
        display: flex !important;

        > .nav-list-item {
            width: 100%;
        }

        &:deep(.floating-menu) {
            left: 50%;
            top: 50%;
            z-index: 0;
        }
    }
</style>

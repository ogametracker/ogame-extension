<template>
    <div class="nav-list">
        <floating-menu
            v-for="(item, i) in items"
            :key="i"
            :value="rootRouteName != null && showMenu[i] == true"
            @input="$set(showMenu, i, $event)"
            class="nav-list_floating-menu"
        >
            <template #activator>
                <component
                    :is="item.to != null ? 'router-link' : 'a'"
                    class="nav-list-item"
                    :class="item.class"
                    :to="item.to"
                    :href="item.href"
                    :target="item.target"
                    active-class="nav-list-item-active"
                    ref="links"
                >
                    <span v-text="item.label" />
                    <span v-if="isDefaultRoute(item.to)" class="nav-list-item-home-icon mdi mdi-home" />
                </component>
            </template>

            <set-default-route-button
                v-if="rootRouteName != null"
                :label="$i18n.$t.settings.setDefaultSubRoute"
                :rootRouteName="rootRouteName"
                :routeName="item.to.name"
                @click="$set(showMenu, i, false)"
            />
        </floating-menu>
    </div>
</template>

<script lang="ts">
    import { PropType } from 'vue';
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import { RawLocation } from 'vue-router';
    import SetDefaultRouteButton from "@stats/components/settings/SetDefaultRouteButton.vue";
    import { SettingsDataModule } from '../../data/SettingsDataModule';

    export type ListNavItem = {
        label: string;
        class?: string;
    } & (
            { to: RawLocation & { name: string } }
            | {
                href: string;
                target?: string;
            }
        );

    @Component({
        components: {
            SetDefaultRouteButton,
        },
    })
    export default class ListNav extends Vue {
        @Prop({ required: true, type: Array as PropType<ListNavItem[]> })
        private items!: ListNavItem[];

        @Prop({ required: false, type: String, default: () => null })
        private rootRouteName!: string | null;

        private showMenu: Record<number, boolean> = {};

        private get defaultRouteName() {
            const routes = this.$router.getRoutes();
            const rootRoute = routes.find(route => route.name == this.rootRouteName);

            if (rootRoute?.redirect instanceof Object) {
                return rootRoute.redirect.name;
            }

            throw new Error('route without default route!');
        }

        private async mounted() {
            await this.$nextTick();
            (this.$refs.links as (Vue | HTMLElement)[]).forEach((component, i) => {
                const element = component instanceof HTMLElement ? component : component.$el;
                element.addEventListener('contextmenu', e => {
                    e.preventDefault();

                    Object.keys(this.showMenu).forEach(key => this.showMenu[parseInt(key)] = false);
                    this.$set(this.showMenu, i, true);
                });
            });
        }

        private isDefaultRoute(to: { name: string }): boolean {
            if (this.rootRouteName == null) {
                return false;
            }

            const defaultRoute = SettingsDataModule.settings.defaultRoutes[this.rootRouteName] ?? this.defaultRouteName;
            return defaultRoute == to.name;
        }
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

        &::v-deep .floating-menu {
            left: 50%;
            top: 50%;
            z-index: 0;
        }
    }
</style>
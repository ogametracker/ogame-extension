<template>
    <button @click="setDefaultRoute($event)" class="default-route-button">
        <span class="mdi mdi-home" />
        <span v-text="label" />
    </button>
</template>

<script lang="ts">
    import { _throw } from '@/shared/utils/_throw';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { SettingsDataModule } from '../../data/SettingsDataModule';

    @Component({})
    export default class SetDefaultRouteButton extends Vue {
        @Prop({ required: true, type: String })
        private label!: string;

        @Prop({ required: true, type: String })
        private routeName!: string;

        @Prop({ required: true, type: String })
        private rootRouteName!: string;


        private async setDefaultRoute(ev: Event) {
            await SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                defaultRoutes: {
                    ...SettingsDataModule.settings.defaultRoutes,
                    [this.rootRouteName]: this.routeName,
                },
            });

            const rootRoute = this.$router.getRoutes().find(route => route.name == this.rootRouteName) ?? _throw(`could not find route with name '${this.rootRouteName}'`);
            rootRoute.redirect = { name: this.routeName };

            this.$emit('click', ev);
        }
    }
</script>
<style lang="scss" scoped>
    .default-route-button {
        display: flex;
        gap: 4px;
        align-items: center;

        .mdi {
            font-size: 20px;
        }
    }
</style>
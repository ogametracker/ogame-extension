<template>
    <o-image-base
        class="o-ship"
        :class="type"
        :size="size"
        :disabled="disabled"
    />
</template>

<script lang="ts">
    import { PropType } from 'vue';
    import { Component, Prop, Vue } from 'vue-property-decorator';

    type OShipType =
        'light-fighter'
        | 'heavy-fighter'
        | 'cruiser'
        | 'battleship'
        | 'battlecruiser'
        | 'bomber'
        | 'destroyer'
        | 'death-star'
        | 'reaper'
        | 'pathfinder'
        | 'small-cargo'
        | 'large-cargo'
        | 'colony-ship'
        | 'recycler'
        | 'espionage-probe'
        | 'solar-satellite'
        | 'crawler'
        ;

    @Component({})
    export default class OShip extends Vue {
        @Prop({ required: true, type: String as PropType<OShipType> })
        private type!: OShipType;

        @Prop({ required: false, type: Boolean })
        private disabled!: boolean;

        @Prop({ required: false, type: Number })
        private size!: number | null;
    }
</script>

<style lang="scss" scoped>
    @import "@/styles/env.scss";

    .o-ship {
        &.light-fighter {
            background-image: url(#{$base-url}/img/ogame/ships/Light_Fighter.jpg);
        }

        &.heavy-fighter {
            background-image: url(#{$base-url}/img/ogame/ships/Heavy_Fighter.jpg);
        }

        &.cruiser {
            background-image: url(#{$base-url}/img/ogame/ships/Cruiser.jpg);
        }

        &.battleship {
            background-image: url(#{$base-url}/img/ogame/ships/Battle_Ship.jpg);
        }

        &.battlecruiser {
            background-image: url(#{$base-url}/img/ogame/ships/Battlecruiser.jpg);
        }

        &.bomber {
            background-image: url(#{$base-url}/img/ogame/ships/Bomber.jpg);
        }

        &.destroyer {
            background-image: url(#{$base-url}/img/ogame/ships/Destroyer.jpg);
        }

        &.death-star {
            background-image: url(#{$base-url}/img/ogame/ships/Death_Star.jpg);
        }

        &.reaper {
            background-image: url(#{$base-url}/img/ogame/ships/Reaper.jpg);
        }

        &.pathfinder {
            background-image: url(#{$base-url}/img/ogame/ships/Pathfinder.jpg);
        }

        &.small-cargo {
            background-image: url(#{$base-url}/img/ogame/ships/Small_Cargo.jpg);
        }

        &.large-cargo {
            background-image: url(#{$base-url}/img/ogame/ships/Large_Cargo.jpg);
        }

        &.colony-ship {
            background-image: url(#{$base-url}/img/ogame/ships/Colony_Ship.jpg);
        }

        &.recycler {
            background-image: url(#{$base-url}/img/ogame/ships/Recycler.jpg);
        }

        &.espionage-probe {
            background-image: url(#{$base-url}/img/ogame/ships/Espionage_Probe.jpg);
        }

        &.solar-satellite {
            background-image: url(#{$base-url}/img/ogame/ships/Solar_Satellite.jpg);
        }

        &.crawler {
            background-image: url(#{$base-url}/img/ogame/ships/Crawler.jpg);
        }
    }
</style>
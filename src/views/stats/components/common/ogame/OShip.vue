<template>
    <div
        class="o-ship"
        :style="{
            'background-image': `url(/img/ogame/ships/${ship}.jpg)`,
            'font-size': size,
        }"
    />
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { PropType } from 'vue';

    export enum OShipType {
        smallCargo = "small-cargo",
        largeCargo = "large-cargo",
        lightFighter = "light-fighter",
        heavyFighter = "heavy-fighter",
        cruiser = "cruiser",
        battleship = "battleship",
        colonyShip = "colony-ship",
        recycler = "recycler",
        espionageProbe = "espionage-probe",
        bomber = "bomber",
        solarSatellite = "solar-satellite",
        destroyer = "destroyer",
        deathStar = "death-star",
        battlecruiser = "battlecruiser",
        crawler = "crawler",
        reaper = "reaper",
        pathfinder = "pathfinder",
    }

    @Component({})
    export default class OShip extends Vue {

        @Prop({
            required: true,
            type: String as PropType<OShipType>,
            validator: (value: string) => (Object.values(OShipType) as string[]).includes(value)
        })
        private ship!: OShipType;

        @Prop({ required: false, type: String, default: '32px' })
        private size!: string;

        @Prop({ required: false, type: Boolean })
        private disabled!: boolean;
    }
</script>
<style lang="scss" scoped>
    .o-ship {
        width: 1em;
        height: 1em;
        display: inline-block;
        background-size: cover;
        background-position: center;
        image-rendering: -webkit-optimize-contrast;
        image-rendering: -moz-crisp-edges;
        border-radius: 4px;

        &--disabled {
            filter: grayscale(1) brightness(0.7) contrast(1.2);
        }
    }
</style>
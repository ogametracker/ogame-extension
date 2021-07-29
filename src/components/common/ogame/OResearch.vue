<template>
    <o-image-base
        class="o-research"
        :class="type"
        :size="size"
        :disabled="disabled"
    />
</template>

<script lang="ts">
    import { PropType } from 'vue';
    import { Component, Prop, Vue } from 'vue-property-decorator';

    type OResearchType =
        'energy-technology'
        | 'laser-technology'
        | 'ion-technology'
        | 'hyperspace-technology'
        | 'plasma-technology'
        | 'combustion-drive'
        | 'impulse-drive'
        | 'hyperspace-drive'
        | 'espionage-technology'
        | 'computer-technology'
        | 'astrophysics'
        | 'intergalactic-research-network'
        | 'graviton-technology'
        | 'armor-technology'
        | 'shielding-technology'
        | 'weapons-technology'
        ;

    @Component({})
    export default class OResearch extends Vue {
        @Prop({ required: true, type: String as PropType<OResearchType> })
        private type!: OResearchType;

        @Prop({ required: false, type: Boolean })
        private disabled!: boolean;

        @Prop({ required: false, type: Number })
        private size!: number | null;
    }
</script>

<style lang="scss" scoped>
    @import "@/styles/env.scss";

    .o-research {
        &.energy-technology {
            background-image: url(#{$base-url}/img/ogame/research/Energy_Technology.jpg);
        }

        &.laser-technology {
            background-image: url(#{$base-url}/img/ogame/research/Laser_Technology.jpg);
        }

        &.ion-technology {
            background-image: url(#{$base-url}/img/ogame/research/Ion_Technology.jpg);
        }

        &.hyperspace-technology {
            background-image: url(#{$base-url}/img/ogame/research/Hyperspace_Technology.jpg);
        }

        &.plasma-technology {
            background-image: url(#{$base-url}/img/ogame/research/Plasma_Technology.jpg);
        }

        &.combustion-drive {
            background-image: url(#{$base-url}/img/ogame/research/Combustion_Drive.jpg);
        }

        &.impulse-drive {
            background-image: url(#{$base-url}/img/ogame/research/Impulse_Drive.jpg);
        }

        &.hyperspace-drive {
            background-image: url(#{$base-url}/img/ogame/research/Hyperspace_Drive.jpg);
        }

        &.espionage-technology {
            background-image: url(#{$base-url}/img/ogame/research/Espionage_Technology.jpg);
        }

        &.computer-technology {
            background-image: url(#{$base-url}/img/ogame/research/Computer_Technology.jpg);
        }

        &.astrophysics {
            background-image: url(#{$base-url}/img/ogame/research/Astrophysics.jpg);
        }

        &.intergalactic-research-network {
            background-image: url(#{$base-url}/img/ogame/research/Intergalactic_Research_Network.jpg);
        }

        &.graviton-technology {
            background-image: url(#{$base-url}/img/ogame/research/Graviton_Technology.jpg);
        }

        &.armor-technology {
            background-image: url(#{$base-url}/img/ogame/research/Armour_Technology.jpg);
        }

        &.shielding-technology {
            background-image: url(#{$base-url}/img/ogame/research/Shielding_Technology.jpg);
        }

        &.weapons-technology {
            background-image: url(#{$base-url}/img/ogame/research/Weapons_Technology.jpg);
        }
    }
</style>
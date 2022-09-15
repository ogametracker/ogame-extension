<template>
    <div
        class="o-research"
        :class="{
            'o-research--disabled': disabled,
        }"
        :style="{
            'background-image': `url(/img/ogame/research/${image}.jpg)`,
            'font-size': size,
        }"
        v-on="$listeners"
        v-bind="{ ...$attrs, ...$props }"
    />
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { PropType } from 'vue';
    import { ResearchType } from '@/shared/models/ogame/research/ResearchType';
    import { ResearchTypes } from '@/shared/models/ogame/research/ResearchTypes';

    @Component({})
    export default class OResearch extends Vue {

        @Prop({
            required: true,
            type: Number as PropType<ResearchType>,
            validator: (value: number) => (ResearchTypes as number[]).includes(value)
        })
        private research!: ResearchType;

        @Prop({ required: false, type: String, default: '32px' })
        private size!: string;

        @Prop({ required: false, type: Boolean })
        private disabled!: boolean;


        private get image() {
            return this.imageMap[this.research];
        }
        private readonly imageMap: Record<ResearchType, string> = {
            [ResearchType.espionageTechnology]: 'espionage-technology',
            [ResearchType.computerTechnology]: 'computer-technology',
            [ResearchType.weaponsTechnology]: 'weapons-technology',
            [ResearchType.shieldingTechnology]: 'shielding-technology',
            [ResearchType.armorTechnology]: 'armor-technology',
            [ResearchType.energyTechnology]: 'energy-technology',
            [ResearchType.hyperspaceTechnology]: 'hyperspace-technology',
            [ResearchType.combustionDrive]: 'combustion-drive',
            [ResearchType.impulseDrive]: 'impulse-drive',
            [ResearchType.hyperspaceDrive]: 'hyperspace-drive',
            [ResearchType.laserTechnology]: 'laser-technology',
            [ResearchType.ionTechnology]: 'ion-technology',
            [ResearchType.plasmaTechnology]: 'plasma-technology',
            [ResearchType.intergalacticResearchNetwork]: 'intergalactic-research-network',
            [ResearchType.astrophysics]: 'astrophysics',
            [ResearchType.gravitonTechnology]: 'graviton-technology',
        };
    }
</script>
<style lang="scss" scoped>
    .o-research {
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
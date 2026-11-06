<template>
    <div
        class="o-research"
        :class="{
            'o-research--disabled': disabled,
            'o-research--fade': fade,
        }"
        :style="{
            'background-image': `url(/img/ogame/research/${image}.jpg)`,
            'font-size': size,
        }"
    />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';
import { ResearchType } from '@ogame-tracker/shared/models/ogame/research/ResearchType';
import { ResearchTypes } from '@ogame-tracker/shared/models/ogame/research/ResearchTypes';

const props = defineProps({
    research: { required: true, type: Number as PropType<ResearchType>, validator: (value: number) => (ResearchTypes as number[]).includes(value) },
    size: { required: false, type: String, default: '32px' },
    disabled: { required: false, type: Boolean },
    fade: { required: false, type: Boolean },
});

const image = computed(() => imageMap[props.research]);

const imageMap: Record<ResearchType, string> = {
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
        &--fade {
            opacity: 0.3;
        }
    }
</style>

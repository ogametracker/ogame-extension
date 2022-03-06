<template>
    <div class="planet-settings">
        <span>LOCA: Planet</span>
        <span>
            <span v-text="settings.name" />
            <span v-if="settings.coordinates != null">
                [{{ settings.coordinates.galaxy }}:{{
                    settings.coordinates.system
                }}:{{ settings.coordinates.position }}]
            </span>
        </span>

        <template v-if="toggleable">
            <span>LOCA: Enabled</span>
            <span>
                <input type="checkbox" v-model="settings.enabled" />
            </span>
        </template>

        <span>LOCA: Position</span>
        <span>
            <input
                type="number"
                v-model.number="settings.position"
                min="1"
                max="15"
                step="1"
            />
        </span>

        <span>LOCA: Temperature</span>
        <span>
            <input
                type="number"
                v-model.number="settings.maxTemperature"
                min="-130"
                max="260"
                step="1"
            />
        </span>

        <span>LOCA: Items</span>
        <span>TODO: Item settings here</span>

        <span>LOCA: Crawlers</span>
        <span>TODO: Crawler settings here</span>

        <span>LOCA: Mine Levels</span>
        <span>TODO: Current mine levels here</span>
    </div>
</template>

<script lang="ts">
    import { Coordinates } from '@/shared/models/v1/ogame/common/Coordinates';
    import { ItemHash } from '@/shared/models/v1/ogame/items/ItemHash';
    import { PropType } from 'vue';
    import { Component, Prop, VModel, Vue } from 'vue-property-decorator';

    export interface AmortizationPlanetSettings {
        enabled: boolean;
        id: number;
        name: string;
        coordinates?: Coordinates;
        position: number;
        maxTemperature: number;

        activeItems: ItemHash[];
        crawlers: {
            enabled: boolean;
            overload: boolean;
            count: 'max' | number;
        };

        mineLevels?: {
            metalMine: number;
            crystalMine: number;
            deuteriumSynthesizer: number;
        };
    }

    @Component({})
    export default class AmortizationPlanetSettingsInputs extends Vue {
        @VModel({ required: true, type: Object as PropType<AmortizationPlanetSettings> })
        private settings!: AmortizationPlanetSettings;

        @Prop({ required: false, type: Boolean })
        private toggleable!: boolean;
    }
</script>
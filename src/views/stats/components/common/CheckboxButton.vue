<template>
    <button
        class="checkbox-button"
        :style="{
            '--color': getRGBString(checked ? color : uncheckedColor),
        }"
        @click="checked = !checked"
    >
        <slot v-if="$scopedSlots.default != null" />
        <span v-else v-text="label" />
    </button>
</template>

<script lang="ts">
    import { Component, Prop, Vue, VModel } from 'vue-property-decorator';
    import { getRGBString } from '../../utils/getRGBString';

    @Component({})
    export default class Checkbox extends Vue {

        @VModel({ required: true, type: Boolean })
        private checked!: boolean;

        @Prop({ required: false, type: String, default: () => null })
        private color!: string | null;

        @Prop({ required: false, type: String, default: () => '#666666' })
        private uncheckedColor!: string | null;

        @Prop({ required: false, type: String, default: () => null })
        private label!: string | null;

        private readonly getRGBString = getRGBString;
    }
</script>
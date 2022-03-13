<template>
    <grid-table
        class="color-settings"
        :columns="columns"
        :items="items"
        style="width: max-content"
    >
        <template #cell-key="{ value: key }">
            <div
                class="color-input"
                @click="$refs[`colorInput-${key}`].click()"
            >
                <input
                    type="color"
                    :value="colors[key]"
                    @change="updateColor(key, $event)"
                    :ref="`colorInput-${key}`"
                />
                <div
                    class="color-indicator"
                    :style="{ background: colors[key] }"
                />
                <span v-text="labels[key]" />
            </div>
        </template>
    </grid-table>
</template>

<script lang="ts">
    import { PropType } from 'vue';
    import { Component, Prop, Vue, VModel } from 'vue-property-decorator';
    import { GridTableColumn } from '../../common/GridTable.vue';

    @Component({})
    export default class ColorSettingsTable extends Vue {
        @Prop({ required: true, type: String })
        private header!: string;

        @VModel({ required: true, type: Object as PropType<Record<string, string>> })
        private colors!: Record<string, string>;

        @Prop({ required: true, type: Object as PropType<Record<string, string>> })
        private labels!: Record<string, string>;

        @Prop({ required: false, type: Array as PropType<string[]>, default: () => null })
        private keys!: string[] | null;

        private get columns(): GridTableColumn[] {
            return [{
                key: 'key',
                label: this.header,
                headerClass: 'color-settings-header',
            }];
        }

        private get items(): { key: string }[] {
            const keys = this.keys ?? Object.keys(this.colors);
            return keys.map(key => ({ key }));
        }

        // private get colorInputs(): Record<string, HTMLInputElement> {
        //     const result: Record<string, HTMLInputElement> = {};
        //     Object.keys(this.colors).forEach(key => result[key] = this.$refs[`colorInput-${key}`] as HTMLInputElement);

        //     return result;
        // }

        private updateColor(key: string, event: InputEvent) {
            if (event.target instanceof HTMLInputElement) {
                this.colors = {
                    ...this.colors,
                    [key]: event.target.value
                };
            }
        }
    }
</script>
<style lang="scss" scoped>
    .color-input {
        display: flex;
        flex-grow: 1;
        align-items: center;
        cursor: pointer;
        column-gap: 4px;

        > input[type="color"] {
            width: 0;
            height: 0;
            box-sizing: border-box;
            transform: scale(0);
            display: inline;
            padding: 0;
            border: none;
        }

        > .color-indicator {
            height: 24px;
            width: 24px;
            display: inline-block;
            border-radius: 4px;
        }
    }

    .color-settings::v-deep .color-settings-header {
        justify-content: center;
    }
</style>
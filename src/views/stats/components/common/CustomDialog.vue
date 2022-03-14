<template>
    <div class="dialog-wrapper">
        <div class="dialog">
            <div class="dialog-header">
                <div v-if="$scopedSlots.header != null">
                    <slot name="header" />
                </div>
                <span v-else v-text="header" />

                <span
                    v-if="showClose"
                    class="close-dialog mdi mdi-close"
                    @click="$emit('close')"
                />
            </div>
            <div class="dialog-body">
                <slot />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({})
    export default class Dialog extends Vue {
        @Prop({ required: false, type: Boolean })
        private showClose!: boolean;

        @Prop({ required: false, type: String })
        private header!: string;
    }
</script>
<style lang="scss" scoped>
    .dialog-wrapper {
        display: flex;
        justify-content: center;
        align-items: flex-start;

        width: 100%;
        height: 100%;

        position: fixed;
        top: 0;
        left: 0;

        padding: 32px;
        background: rgba(black, 0.7);
    }

    .dialog {
        max-width: 50%;
        min-width: 300px;

        max-height: 100%;
        min-height: 200px;

        display: grid;
        grid-template-rows: auto 1fr;

        background: black
            linear-gradient(180deg, rgba(#969696, 0.3), rgba(#969696, 0.4));
        padding: 4px 16px 16px 16px;
        border-radius: 4px;

        &-header {
            display: grid;
            align-items: center;
            justify-items: center;
            grid-template-columns: 1fr auto;

            > .close-dialog {
                opacity: 0.5;
                font-size: 24px;
                cursor: pointer;

                &:hover {
                    opacity: 1;
                }
            }
        }

        &-body {
            height: 100%;
            overflow: auto;
        }
    }
</style>
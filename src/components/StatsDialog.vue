<template>
    <b-modal
        :dialog-class="$style['stats-dialog']"
        v-model="value"
        hide-footer
        hide-header
        body-class="mh-100 overflow-hidden"
        content-class="bg-ogame-darkblue"
        no-fade
    >
        <b-tabs
            class="min-max-h-100 d-flex flex-column"
            content-class="min-max-h-100 py-3 d-flex flex-nowrap flex-grow-1 pr-4"
            active-tab-class="min-max-w-100"
        >
            <b-tab title="Expeditionen" active>
                <expedition-stats />
            </b-tab>

            <b-tab title="Angriffe"> Angriffe </b-tab>

            <b-tab
                title-item-class="flex-grow-1"
                title-link-class="border-0 p-0"
                disabled
            ></b-tab>

            <b-tab>
                <template #title>Einstellungen</template>
            </b-tab>

            <b-tab
                :title-item-class="['justify-content-end', $style['close-tab-item']]"
                title-link-class="border-0 p-0"
            >
                <template #title>
                    <button
                        type="button"
                        class="close text-white"
                        style="text-shadow: none"
                        @click="$emit('input', false)"
                    >
                        ×
                    </button>
                </template>
            </b-tab>
        </b-tabs>
    </b-modal>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from "vue-property-decorator";
    import ExpeditionStats from "./expeditions/ExpeditionStats.vue";

    @Component({
        components: {
            ExpeditionStats,
        },
    })
    export default class StatsDialog extends Vue {
        @Prop({ type: Boolean, required: true })
        private value!: boolean;
    }
</script>

<style lang="scss" module>
    $margin: 100px;

    .stats-dialog {
        display: flex;

        max-width: calc(100vw - #{$margin});
        min-width: calc(100vw - #{$margin});

        max-height: calc(100vh - #{$margin});
        min-height: calc(100vh - #{$margin});
    }

    .close-tab-item {
        min-width: 48px;
    }
</style>
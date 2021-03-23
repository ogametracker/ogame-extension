<template>
    <div class="stats-dialog" v-if="value">
        <div class="stats-dialog-content">
            <nav class="stats-dialog-nav">
                <ul class="nav">
                    <!-- TODO: Vue router -->
                    <li
                        class="nav-item"
                        :class="{ 'nav-item-active': activeTab == 'expos' }"
                        @click="activeTab = 'expos'"
                    >
                        <span class="icon-expo" />
                        Expeditionen
                    </li>
                    <li
                        class="nav-item"
                        :class="{ 'nav-item-active': activeTab == 'attacks' }"
                        @click="activeTab = 'attacks'"
                    >
                        <span class="icon-attack" />
                        Angriffe
                    </li>
                    <li
                        class="nav-item"
                        :class="{ 'nav-item-active': activeTab == 'tfs' }"
                        @click="activeTab = 'tfs'"
                    >
                        <span class="icon-tf" />
                        Trümmerfelder
                    </li>
                    <li style="flex-grow: 1"></li>
                    <li
                        class="nav-item"
                        :class="{ 'nav-item-active': activeTab == 'settings' }"
                        @click="activeTab = 'settings'"
                    >
                        <icon name="cog" />
                        Einstellungen
                    </li>
                    <li class="nav-item" @click="excelExport()">
                        <icon name="microsoft-excel" />
                    </li>
                </ul>

                <div class="close-stats-dialog-wrapper">
                    <span
                        class="close-stats-dialog-button"
                        @click="$emit('input', false)"
                    >
                        ×
                    </span>
                </div>
            </nav>
            <main class="stats-dialog-body">
                <!-- router view? -->
                <expedition-stats
                    v-if="activeTab == 'expos'"
                    class="stats-dialog-body-content"
                />
                <span v-else-if="activeTab == 'attacks'">
                    <!-- router view? -->
                    Angriffe
                </span>
                <span v-else-if="activeTab == 'tfs'">
                    <!-- router view? -->
                    TFs

                    <code style="white-space: pre">
                        msg_title: "Schürfbericht von TF auf [8:220:15]."
                        <br />
                        <br />
                        msg_content: "Deine (Recycler|Pathfinder|?) (1 Schiffe)
                        haben eine Gesamtladekapazität von 34.000. Am Ziel
                        [8:220:15] treiben 0 Metall und 11.500 Kristall im Raum.
                        Du hast 0 Metall und 11.500 Kristall abgebaut."
                    </code>
                </span>
                <span v-else-if="activeTab == 'settings'">
                    <!-- router view? -->
                    Einstellungen
                </span>
            </main>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from "vue-property-decorator";
    import ExpeditionStats from "./expeditions/ExpeditionStats.vue";
    import ExcelExport from '@/export/ExcelExport';

    @Component({
        components: {
            ExpeditionStats,
        },
    })
    export default class StatsDialog extends Vue {
        @Prop({ type: Boolean, required: true })
        private value!: boolean;

        private activeTab = 'expos';


        private excelExport() {
            ExcelExport.export();
        }
    }
</script>

<style lang="scss" scoped>
    @import "@/styles/colors";

    $padding: 50px;

    .stats-dialog {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 10000;
        padding: $padding;

        &::before {
            content: "";
            position: absolute;
            z-index: -1;
            background: rgba(0, 0, 0, 0.5);
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
        }
    }

    .stats-dialog-content {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-rows: auto 1fr;
        border-radius: 6px;
        overflow: hidden;

        background: linear-gradient(52deg, #010108, #040a17);
    }

    .stats-dialog-nav {
        display: flex;
        flex-direction: row;
        border-bottom: 2px solid $ogame-blue;
    }

    .nav {
        display: flex;
        flex-direction: row;
        list-style: none;
        margin: 0;
        padding: 0;
        flex-grow: 1;

        .nav-item {
            line-height: 50px;
            height: 50px;
            font-size: 13px;
            padding: 0 16px;
            cursor: pointer;
            display: flex;
            align-items: center;

            .mdi {
                font-size: 24px;
                margin-right: 6px;
            }

            &:hover {
                background: linear-gradient(
                    180deg,
                    rgba(darken($ogame-blue, 25%), 0.5),
                    rgba($ogame-blue, 0.5)
                );
            }

            &-active,
            &-active:hover {
                background: linear-gradient(
                    180deg,
                    darken($ogame-blue, 25%),
                    $ogame-blue
                );
            }
        }
    }

    .close-stats-dialog-wrapper {
        min-width: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
    }

    .close-stats-dialog-button {
        cursor: pointer;
    }

    .stats-dialog-body {
        overflow: hidden;
        padding: 16px 16px 32px 16px;
    }

    .icon-expo,
    .icon-attack,
    .icon-tf {
        display: inline-block;
        width: 1em;
        height: 1em;
        position: relative;
        font-size: 36px;

        &::before {
            content: "";
            background-repeat: no-repeat;
            background-size: contain;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    }

    .icon-expo::before {
        background-image: url(~@/assets/icons/expedition.svg);
    }
    .icon-attack::before {
        background-image: url(~@/assets/icons/attack.svg);
    }
    .icon-tf::before {
        background-image: url(~@/assets/icons/wreckfield.svg);
    }
</style>
<template>
    <div class="stats-dialog" v-show="value">
        <div class="stats-dialog-content">
            <nav class="stats-dialog-nav">
                <ul class="nav">
                    <!-- TODO: Vue router -->
                    <li
                        class="nav-item"
                        :class="{ 'nav-item-active': activeTab == 'expos' }"
                        @click="activeTab = 'expos'"
                    >
                        Expeditionen
                    </li>
                    <li
                        class="nav-item"
                        :class="{ 'nav-item-active': activeTab == 'attacks' }"
                        @click="activeTab = 'attacks'"
                    >
                        Angriffe
                    </li>
                    <li style="flex-grow: 1"></li>
                    <li
                        class="nav-item"
                        :class="{ 'nav-item-active': activeTab == 'settings' }"
                        @click="activeTab = 'settings'"
                    >
                        Einstellungen
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

    @Component({
        components: {
            ExpeditionStats,
        },
    })
    export default class StatsDialog extends Vue {
        @Prop({ type: Boolean, required: true })
        private value!: boolean;

        private activeTab = 'expos';
    }
</script>

<style lang="scss" scoped>
    $padding: 50px;

    .stats-dialog {
        display: flex;
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
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        border-radius: 6px;
        overflow: hidden;

        background: black;
    }

    .stats-dialog-nav {
        display: flex;
        flex-direction: row;
        border-bottom: 2px solid blue;
    }

    .nav {
        display: flex;
        flex-direction: row;
        list-style: none;
        margin: 0;
        padding: 0;
        flex-grow: 1;

        .nav-item {
            padding: 16px;
            font-size: 13px;
            cursor: pointer;

            &:hover {
                background: rgba(blue, 0.5);
            }

            &-active,
            &-active:hover {
                background: blue;
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
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        padding: 16px 16px 32px 16px;
    }
</style>
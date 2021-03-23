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
                    <li
                        class="nav-item"
                        style="font-size: 24px; padding: 9px"
                        @click="excelExport()"
                    >
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
    import xlsx from 'xlsx';
    import localDownload from '@/utils/localDownload';

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
            //TODO: export all tables as their own sheet
            //TODO: export raw data as own sheet

            const testData = [
                {test: 123, hallo: 'name', expos: 3664},
                {test: 234, hallo: 'name', expos: 9999},
                {test: 345, hallo: 'name', expos: 3336},
                {test: 456, hallo: 'name', expos: 6656},
                {test: 567, hallo: 'name', expos: 3373},
            ];

            const sheet = xlsx.utils.json_to_sheet(testData);

            const workbook = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(workbook, sheet, "Test");

            xlsx.writeFile(workbook, 'test.xlsx');
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

        background: linear-gradient(290deg, #010106, #02050c);
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
            padding: 16px;
            font-size: 13px;
            cursor: pointer;

            &:hover {
                background: rgba($ogame-blue, 0.5);
            }

            &-active,
            &-active:hover {
                background: $ogame-blue;
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
</style>
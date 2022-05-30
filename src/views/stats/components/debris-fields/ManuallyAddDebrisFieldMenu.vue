<template>
    <floating-menu v-model="show" left>
        <template #activator>
            <button @click="show = !show">
                <span class="mdi mdi-plus" />
            </button>
        </template>

        <div class="fake-table">
            <div class="fake-table-header">
                <span v-text="'LOCA: add debris field manually'" />
            </div>
            <div class="fake-table-body">
                <span>
                    <o-resource resource="metal" />
                    <input
                        type="number"
                        value="1"
                        v-model.number.lazy="metal"
                        min="0"
                        step="1"
                    />
                </span>

                <span>
                    <o-resource resource="crystal" />
                    <input
                        type="number"
                        v-model.number.lazy="crystal"
                        min="0"
                        step="1"
                    />
                </span>
                <span>
                    <span class="mdi mdi-calendar calendar-icon" />
                    <input
                        type="datetime-local"
                        v-model.lazy="datetimeString"
                    />
                </span>
                <button
                    class="add"
                    v-text="'LOCA: Add'"
                    @click="addManualDebrisFieldReport()"
                    :disabled="(metal == 0 && crystal == 0) || datetime == null"
                />
            </div>
        </div>
    </floating-menu>
</template>

<script lang="ts">
    import { sendMessage } from '@/shared/communication/sendMessage';
    import { MessageType } from '@/shared/messages/MessageType';
    import { TrackManualDebrisFieldReportMessage } from '@/shared/messages/tracking/debris-fields';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { DebrisFieldReportDataModule } from '../../data/DebrisFieldReportDataModule';
    import { GlobalOgameMetaData, statsViewUuid } from '../../data/global';

    @Component({})
    export default class ManuallyAddDebrisFieldMenu extends Vue {
        private show = false;

        private datetimeString = "";
        private metal = 0;
        private crystal = 0;


        private get nextId() {
            const minId = DebrisFieldReportDataModule.reports.reduce((min, report) => Math.min(min, report.id), 0);
            return minId - 1;
        }

        private get datetime(): number | null {
            if (this.datetimeString == "") {
                return null;
            }

            const datetime = new Date(this.datetimeString).getTime();
            if (isNaN(datetime)) {
                return null;
            }

            return datetime;
        }

        private addManualDebrisFieldReport() {
            const date = this.datetime;
            if (date == null) {
                return;
            }

            const message: TrackManualDebrisFieldReportMessage = {
                ogameMeta: GlobalOgameMetaData,
                type: MessageType.TrackManualDebrisFieldReport,
                data: {
                    id: this.nextId,
                    date: date,
                    metal: this.metal,
                    crystal: this.crystal,
                },
                senderUuid: statsViewUuid,
            };
            sendMessage(message);

            this.datetimeString = "";
            this.metal = 0;
            this.crystal = 0;
        }
    }
</script>
<style lang="scss" scoped>
    .fake-table {
        border: 1px solid rgba(var(--color), 0.5);
        border-radius: 4px;
        display: grid;
        width: fit-content;

        &-header {
            background: black
                linear-gradient(
                    0deg,
                    rgba(var(--color), 0.5),
                    rgba(var(--color), 0.5)
                );
            justify-content: center;
            align-items: center;
        }

        &-header,
        &-body {
            padding: 8px;
            display: flex;
        }

        &-body {
            flex-direction: column;
            gap: 4px;
            align-items: flex-start;
            justify-content: flex-start;

            > * {
                display: flex;
            }
        }
    }

    input {
        width: 180px;
    }

    .mdi.calendar-icon {
        transform: scale(2);
        width: 32px;
        align-self: center;
        justify-self: center;
        display: flex;
        justify-content: center;
    }

    button.add {
        align-self: stretch;
        justify-content: center;
    }
</style>
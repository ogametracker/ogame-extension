<template>
    <floating-menu v-model="show" left>
        <template #activator>
            <button @click="show = !show">
                <span class="mdi mdi-plus" />
            </button>
        </template>

        <div class="fake-table">
            <div class="fake-table-header">
                <span v-text="translations().extension.debrisFields.addDebrisFieldManually.title" />
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
                    v-text="translations().extension.debrisFields.addDebrisFieldManually.buttonText"
                    @click="addManualDebrisFieldReport()"
                    :disabled="(metal == 0 && crystal == 0) || datetime == null"
                />
            </div>
        </div>
    </floating-menu>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { translations } from '@stats/i18n';
import { sendMessage } from '@ogame-tracker/shared/communication/sendMessage';
import { MessageType } from '@ogame-tracker/shared/messages/MessageType';
import type { TrackManualDebrisFieldReportMessage } from '@ogame-tracker/shared/messages/tracking/debris-fields';
import { useDebrisFieldReportStore } from '../../data/DebrisFieldReportDataModule';
import { GlobalOgameMetaData, statsViewUuid } from '../../data/global';

const debrisFieldReportStore = useDebrisFieldReportStore();

const show = ref(false);

const datetimeString = ref("");

const metal = ref(0);

const crystal = ref(0);

const nextId = computed(() => {
    const minId = Math.min(0, debrisFieldReportStore.minId);
    return minId - 1;
});

const datetime = computed<number | null>(() => {
    if (datetimeString.value == "") {
        return null;
    }

    const localDatetime = new Date(datetimeString.value).getTime();
    if (isNaN(localDatetime)) {
        return null;
    }

    return localDatetime;
});

function addManualDebrisFieldReport() {
    const date = datetime.value;
    if (date == null) {
        return;
    }

    const message: TrackManualDebrisFieldReportMessage = {
        ogameMeta: GlobalOgameMetaData,
        type: MessageType.TrackManualDebrisFieldReport,
        data: {
            id: nextId.value,
            date: date,
            metal: metal.value,
            crystal: crystal.value,
        },
        senderUuid: statsViewUuid,
    };
    sendMessage(message);

    datetimeString.value = "";
    metal.value = 0;
    crystal.value = 0;
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
                    rgba(var(--color), 0.7)
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

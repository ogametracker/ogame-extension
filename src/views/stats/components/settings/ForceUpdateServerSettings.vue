<template>
    <div class="fake-table">
        <div class="fake-table-header">
            <span v-text="translations().extension.settings.common.serverSettings.title" />
        </div>
        <div class="fake-table-body">
            <div>
                <span v-text="translations().extension.settings.common.serverSettings.lastUpdate + ': '" />
                <b v-text="formatDate(lastUpdate, 'datetime')" />
            </div>

            <button
                @click="forceUpdate()"
                v-text="translations().extension.settings.common.serverSettings.forceUpdate"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { translations, formatDate } from '@stats/i18n';
import { sendMessage } from '@ogame-tracker/shared/communication/sendMessage';
import { MessageType } from '@ogame-tracker/shared/messages/MessageType';
import type { ForceUpdateServerSettingsMessage } from '@ogame-tracker/shared/messages/server-settings';
import { GlobalOgameMetaData, statsViewUuid } from '../../data/global';
import { useServerSettingsStore } from '../../data/ServerSettingsDataModule';

const serverSettingsStore = useServerSettingsStore();

const lastUpdate = computed(() => serverSettingsStore.lastUpdate!);

function forceUpdate() {
    const message: ForceUpdateServerSettingsMessage = {
        ogameMeta: GlobalOgameMetaData,
        type: MessageType.ForceUpdateServerSettings,
        senderUuid: statsViewUuid,
    };
    sendMessage(message);
}

onMounted(async () => {
    await serverSettingsStore.ready;
});
</script>

<style lang="scss" scoped>
.fake-table {
    border: 1px solid rgba(var(--color), 0.5);
    border-radius: 4px;
    display: grid;
    width: fit-content;
    max-width: 400px;

    &-header {
        background: black linear-gradient(0deg, rgba(var(--color), 0.5), rgba(var(--color), 0.7));
        justify-content: center;
    }

    &-header,
    &-body {
        height: 100%;
        padding: 8px;
        display: flex;
        align-items: center;
    }

    &-body {
        flex-direction: column;
        align-items: start;
        gap: 4px;
    }
}
</style>

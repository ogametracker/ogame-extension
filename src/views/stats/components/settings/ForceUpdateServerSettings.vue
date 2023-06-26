<template>
    <div class="fake-table">
        <div class="fake-table-header">
            <span v-text="$i18n.$t.extension.settings.common.serverSettings.title" />
        </div>
        <div class="fake-table-body">
            <div>
                <span v-text="$i18n.$t.extension.settings.common.serverSettings.lastUpdate + ': '" />
                <b v-text="$i18n.$d(lastUpdate, 'datetime')" />
            </div>

            <button @click="forceUpdate()" v-text="$i18n.$t.extension.settings.common.serverSettings.forceUpdate" />
        </div>
    </div>
</template>

<script lang="ts">
    import { sendMessage } from '@/shared/communication/sendMessage';
    import { MessageType } from '@/shared/messages/MessageType';
    import { ForceUpdateServerSettingsMessage } from '@/shared/messages/server-settings';
    import { Component, Vue } from 'vue-property-decorator';
    import { GlobalOgameMetaData, statsViewUuid } from '../../data/global';
    import { ServerSettingsDataModule } from '../../data/ServerSettingsDataModule';

    @Component({})
    export default class ForceUpdateServerSettings extends Vue {

        get lastUpdate() {
            return ServerSettingsDataModule.lastUpdate!;
        }

        async mounted() {
            await ServerSettingsDataModule.ready;
        }

        forceUpdate() {
            const message: ForceUpdateServerSettingsMessage = {
                ogameMeta: GlobalOgameMetaData,
                type: MessageType.ForceUpdateServerSettings,
                senderUuid: statsViewUuid,
            };
            sendMessage(message);

        }
    }
</script>
<style lang="scss" scoped>
    .fake-table {
        border: 1px solid rgba(var(--color), 0.5);
        border-radius: 4px;
        display: grid;
        width: fit-content;
        max-width: 400px;

        &-header {
            background: black
                linear-gradient(
                    0deg,
                    rgba(var(--color), 0.5),
                    rgba(var(--color), 0.7)
                );
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
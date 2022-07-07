import { broadcastMessage } from "@/shared/communication/broadcastMessage";
import { getPlayerDatabase } from "@/shared/db/access";
import { Message } from "@/shared/messages/Message";
import { MessageType } from "@/shared/messages/MessageType";
import { NotifyUniverseSpecificSettingsUpdateMessage } from "@/shared/messages/universe-specific-settings";
import { loadUniverseSpecificSettings } from "@/shared/models/universe-specific-settings/loadUniverseSpecificSettings";
import { UniverseSpecificSettings } from "@/shared/models/universe-specific-settings/UniverseSpecificSettings";
import { ogameMetasEqual } from "@/shared/ogame-web/ogameMetasEqual";
import { Component, Vue } from 'vue-property-decorator';
import { GlobalOgameMetaData, statsViewUuid } from "./global";

@Component
class UniverseSpecificSettingsDataModuleClass extends Vue {
    public settings: UniverseSpecificSettings = null!;

    private _ready!: Promise<void>;
    private _resolveReady!: () => void;

    public updateSettings(settings: UniverseSpecificSettings) {
        console.debug('updating universe specific settings', settings);
        this.settings = settings;

        void (async () => {
            const db = await getPlayerDatabase(GlobalOgameMetaData);
            await db.put('universeSpecificSettings', settings, 0);

            const msg: NotifyUniverseSpecificSettingsUpdateMessage = {
                ogameMeta: GlobalOgameMetaData,
                senderUuid: statsViewUuid,
                type: MessageType.NotifyUniverseSpecificSettingsUpdate,
            }
            await broadcastMessage(msg);
        })();
    }

    public get ready(): Promise<void> {
        return this._ready;
    }

    private async created() {
        this._ready = new Promise<void>(resolve => this._resolveReady = resolve);

        this.initCommunication();
        await this.loadData();
    }

    private initCommunication() {
        chrome.runtime.onMessage.addListener(async message => await this.onMessage(message));
    }

    private async loadData() {
        this.settings = await loadUniverseSpecificSettings(GlobalOgameMetaData);

        this._resolveReady();
    }

    private async onMessage(msg: Message) {
        const { type, ogameMeta } = msg;
        if (!ogameMetasEqual(ogameMeta, GlobalOgameMetaData)) {
            return;
        }

        if (msg.senderUuid == statsViewUuid) {
            return;
        }

        switch (type) {
            case MessageType.NotifyUniverseSpecificSettingsUpdate: {
                await this.loadData();
                break;
            }
        }
    }
}

export const UniverseSpecificSettingsDataModule = new UniverseSpecificSettingsDataModuleClass();
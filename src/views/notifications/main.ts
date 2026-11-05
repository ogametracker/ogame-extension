import { createPinia, disposePinia } from 'pinia';
import { createApp } from 'vue';
import { parseIntSafe } from '@/shared/utils/parseNumbers';
import { _throw } from '@/shared/utils/_throw';
import type { MessageOgameMeta } from '@/shared/messages/Message';
import { addIconFonts } from '../_shared/addIconFonts';
import App from './App.vue';
import { useSettingsStore } from './stores/settings';
import '@/views/_shared/styles/index.scss';

async function main() {
    addIconFonts();

    const params = new URLSearchParams(location.search);
    const account: MessageOgameMeta = {
        language: params.get('language') ?? _throw('missing parameter "language"'),
        serverId: parseIntSafe(params.get('server') ?? _throw('missing parameter "server"'), 10),
        playerId: parseIntSafe(params.get('player') ?? _throw('missing parameter "player"'), 10),
        userLanguage: 'doesnt-matter',
    };

    const pinia = createPinia();
    const app = createApp(App, { account });
    app.use(pinia);
    app.onUnmount(() => disposePinia(pinia));

    await useSettingsStore(pinia).connect(account);
    app.mount('#notifications');
}

void main();
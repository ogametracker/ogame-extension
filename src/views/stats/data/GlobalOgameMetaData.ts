import { MessageOgameMeta } from "@/shared/messages/Message";
import { _throw } from '@/shared/utils/_throw';

const params = new URLSearchParams(location.search);

export const GlobalOgameMetaData: MessageOgameMeta = {
    language: params.get('language') ?? _throw('missing parameter "language"'),
    playerId: parseInt(params.get('player') ?? _throw('missing parameter "player"')),
    serverId: parseInt(params.get('server') ?? _throw('missing parameter "server"')),
};
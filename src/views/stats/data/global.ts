import { MessageOgameMeta } from '@/shared/messages/Message';
import { _throw } from '@/shared/utils/_throw';
import { parseIntSafe } from '@/shared/utils/parseNumbers';
import { v4 } from 'uuid';

const params = new URLSearchParams(location.search);

export const GlobalOgameMetaData: MessageOgameMeta = {
    language: params.get('language') ?? _throw('missing parameter "language"'),
    playerId: parseIntSafe(params.get('player') ?? _throw('missing parameter "player"'), 10),
    serverId: parseIntSafe(params.get('server') ?? _throw('missing parameter "server"'), 10),
};

export const statsViewUuid = v4();
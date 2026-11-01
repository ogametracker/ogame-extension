import { Item } from "./Item";

export interface ItemImageServer {
    serverId: number;
    language: string;
}

/**
 * Item images are loaded from the OGame CDN instead of being packed into the extension,
 * the browser caches them anyway.
 *
 * Without a server the URL is relative to the current page, which is what content scripts
 * want - they run on the game server itself.
 */
export function getItemImageUrl(item: Item, server?: ItemImageServer): string {
    const path = `/cdn/img/item-images/${item.image}.png`;
    if (server == null) {
        return path;
    }

    return `https://s${server.serverId}-${server.language}.ogame.gameforge.com${path}`;
}

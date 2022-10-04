import { _log, _logDebug } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import { ogameTrackerCloseDialogEventName } from '../../shared/messages/communication';
import { getOgameMeta } from '../../shared/ogame-web/getOgameMeta';
import ingamei18n from "@/shared/i18n/extension/ingame";
import { getLanguage } from "@/shared/i18n/getLanguage";

import './styles.scss';
import { LanguageKey } from "@/shared/i18n/LanguageKey";

const observer = new MutationObserver(() => {
    const menu = document.querySelector('#menuTableTools');

    if (menu != null) {
        const ogameMeta = getOgameMeta();
        const language = getLanguage(ogameMeta.language);

        const parent = menu;

        const ogameTrackerMenu = document.createElement('ul');
        ogameTrackerMenu.classList.add('leftmenu');
        ogameTrackerMenu.id = 'ogame-tracker-menu';

        const tooltip = ingamei18n[language ?? LanguageKey.en]?.tooltipNewTab;

        let html = `
            <li id="ogame-tracker-menu-item__v2">
                <span class="menu_icon tooltipRight" title="${tooltip}">
                    <span class="menuImage icon">
                        <span class="mdi mdi-radar"></span>
                    </span>
                </span>
                <div class="menubutton"></div>
                ${language != null
                ? ''
                : `<div class="warning-lang-not-supported tooltip" title="The OGame servers for locale '${ogameMeta.language}' is not supported.<br/>Expeditions, combats on expeditions, and debris field reports will not be tracked.">
                        <span class="mdi mdi-alert"></span>
                    </div>`
                }
            </li>
        `;
        ogameTrackerMenu.innerHTML = html;
        const link = ogameTrackerMenu.querySelector('.menubutton')! as HTMLAnchorElement;
        //TODO: disabled until "indexeddb access blocked by user": link.addEventListener('click', e => showOgameTrackerDialog());
        link.addEventListener('click', e => window.open(getStatsPageUrl(false), '_blank'));

        const miniLink = ogameTrackerMenu.querySelector('.menu_icon')! as HTMLAnchorElement;
        miniLink.addEventListener('click', e => window.open(getStatsPageUrl(false), '_blank'));

        parent.appendChild(ogameTrackerMenu);

        _logDebug('added menu item');
        observer.disconnect();
    }
});
observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
});

function getStatsPageUrl(iframe: boolean) {
    const url = chrome.runtime.getURL('/views/stats.html');
    const player = (document.querySelector('meta[name="ogame-player-id"]') as HTMLMetaElement | null)?.content
        ?? _throw('cannot find meta tag with player id');
    const language = (document.querySelector('meta[name="ogame-language"]') as HTMLMetaElement | null)?.content
        ?? _throw('cannot find meta tag with universe language');
    const server = (document.querySelector('meta[name="ogame-universe"]') as HTMLMetaElement | null)
        ?.content?.split('-')?.[0]?.substring(1)
        ?? _throw('cannot find meta tag with universe language');

    const queryData: Record<string, string> = {
        player,
        language,
        server,
    };

    if (iframe) {
        queryData.iframe = 'yes';
    }

    const query = new URLSearchParams(queryData);

    return `${url}?${query}`;
}

function showOgameTrackerDialog() {
    if (document.querySelector('#ogame-tracker-dialog__v2') != null) {
        return;
    }

    const container = document.createElement('div');
    const url = getStatsPageUrl(true);
    container.id = 'ogame-tracker-dialog__v2';
    container.innerHTML = `<iframe src="${url}"></iframe>`;
    container.addEventListener('click', () => closeOgameTrackerDialog());

    document.body.append(container);
}

function closeOgameTrackerDialog() {
    const dialog = document.querySelector('#ogame-tracker-dialog__v2');
    dialog?.remove();
}

// declare function in window to close overlay from within the iframe
window.addEventListener('message', e => {
    if (e.data == ogameTrackerCloseDialogEventName) {
        closeOgameTrackerDialog();
    }
});

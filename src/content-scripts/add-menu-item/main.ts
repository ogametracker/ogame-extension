import { _log } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import { closeOgameTrackerDialogEventName } from '../../shared/messages/communication';

import './styles.scss';

const observer = new MutationObserver(() => {
    const menu = document.querySelector('#menuTable');

    if (menu != null) {
        const parent = menu.parentElement ?? _throw('no parent element found');

        const ogameTrackerMenu = document.createElement('ul');
        ogameTrackerMenu.classList.add('leftmenu');
        ogameTrackerMenu.id = 'ogame-tracker-menu';

        ogameTrackerMenu.innerHTML = `
            <li id="ogame-tracker-menu-item">
                <span class="menu_icon">
                    <span class="menuImage icon"></span>
                </span>
                <div class="menubutton"></div>
            </li>
        `;
        const link = ogameTrackerMenu.querySelector('.menubutton')! as HTMLAnchorElement;
        link.addEventListener('click', e => {
            // don't change hash
            e.preventDefault();

            showOgameTrackerDialog();
        });

        parent.appendChild(ogameTrackerMenu);

        _log('added menu item');
        observer.disconnect();
    }
});
observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
});

function showOgameTrackerDialog() {
    if (document.querySelector('#ogame-tracker-dialog') != null) {
        return;
    }

    const url = chrome.runtime.getURL('/views/stats.html');
    const player = (document.querySelector('meta[name="ogame-player-id"]') as HTMLMetaElement | null)?.content
        ?? _throw('cannot find meta tag with player id');
    const language = (document.querySelector('meta[name="ogame-language"]') as HTMLMetaElement | null)?.content
        ?? _throw('cannot find meta tag with universe language');
    const server = (document.querySelector('meta[name="ogame-universe"]') as HTMLMetaElement | null)
        ?.content?.split('-')?.[0]?.substring(1)
        ?? _throw('cannot find meta tag with universe language');

    const query = new URLSearchParams({ player, language, server, iframe: 'yes' });

    const container = document.createElement('div');
    container.id = 'ogame-tracker-dialog';
    container.innerHTML = `<iframe src="${url}?${query}"></iframe>`;
    container.addEventListener('click', () => closeOgameTrackerDialog());

    document.body.append(container);
}

function closeOgameTrackerDialog() {
    const dialog = document.querySelector('#ogame-tracker-dialog');
    dialog?.remove();
}

// declare function in window to close overlay from within the iframe
window.addEventListener('message', e => {
    if (e.data == closeOgameTrackerDialogEventName) {
        closeOgameTrackerDialog();
    }
});

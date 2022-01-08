import { _log } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";

import './styles.scss';

const observer = new MutationObserver(() => {
    const menu = document.querySelector('#menuTable');

    if (menu != null) {
        const parent = menu.parentElement;

        const ogameTrackerMenu = document.createElement('ul');
        ogameTrackerMenu.classList.add('leftmenu');
        ogameTrackerMenu.id = 'ogame-tracker-menu';

        ogameTrackerMenu.innerHTML = `
            <li id="ogame-tracker-menu-item">
                <span class="menu_icon">
                    <span class="menuImage icon"></span>
                </span>
                <a class="menubutton" href="#"></a>
            </li>
        `;
        const link = ogameTrackerMenu.querySelector('.menubutton')! as HTMLAnchorElement;
        link.addEventListener('click', e => {
            // don't change hash
            e.preventDefault();

            //TODO: show stats page in iframe
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

import { extensionI18n } from "@/i18n";
import _throw from "@/utils/throw";
import Vue from "vue";
import MenuItem from '@/components/MenuItem.vue';
import App from '@/components/App.vue';

export default function attach(appComponent: App) {
    let ready = false;

    const observer = new MutationObserver(() => attach());
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });

    function addMenuItem(menu: Element) {
        const dialogLink = document.createElement('li');
        menu.appendChild(dialogLink);

        const menuItem: any = new MenuItem({
            i18n: extensionI18n,
        });
        menuItem.app = appComponent;
        menuItem.$mount(dialogLink);
        /*
            dialogLink.innerHTML = `
                <span class="menu_icon">
                    <span class="statistics-menu-icon"></span>
                </span>
                <a class="menubutton" href="#">
                    <span class="textlabel">
                        ${menuItemText}
                    </span>
                </a>
            `;
            dialogLink.querySelector('a')!.addEventListener('click', () => {
                (window as any).ogameTracker.visible = true;
            });
        
        
            const ogameLang = getLanguage(null);
            if(ogameLang == null) {
                dialogLink.classList.add('ogame-tracker-menu-item-warning');
                const icon = dialogLink.querySelector('.statistics-menu-icon')!;
                icon.classList.add('tooltipRight');
                icon.setAttribute('title', extensionI18n.$t.ogameLanguageNotSupported(OgameMetaData.locale));
            }
            */
    }

    function attach() {
        if (ready) {
            return;
        }

        const menu = document.querySelector('#menuTable');
        if (menu == null) {
            return;
        }

        addMenuItem(menu);
        ready = true;
        observer.disconnect();
    }
}
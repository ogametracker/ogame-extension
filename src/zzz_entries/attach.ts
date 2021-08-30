import i18n from "@/i18n";
import getLanguage from "@/i18n/mapLanguage";
import _throw from "@/utils/throw";

let ready = false;

const observer = new MutationObserver(() => attach());
observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
});

function addMenuItem(menu: Element) {
    i18n.locale = getLanguage();
    
    const menuItemText = i18n.messages.extension.menuItem;

    const dialogLink = document.createElement('li');
    dialogLink.innerHTML = `
        <span class="menu_icon">
            <span class="statistics-menu-icon"></span>
        </span>
        <a class="menubutton" href="#">
            <span class="textlabel">${menuItemText}</span>
        </a>
    `;
    dialogLink.querySelector('a')!.addEventListener('click', () => {
        (window as any).ogameTracker.visible = true;
    });

    menu.appendChild(dialogLink);
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
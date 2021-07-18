const menuItemText = {
    de: 'Statistiken',
    en: 'Statistics',
};


let ready = false;

const observer = new MutationObserver(() => {
    const menu = document.querySelector('#menuTable');
    if (menu != null) {
        attach();
    }
});
observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
});
document.addEventListener('load', () => attach());

async function addMenuItem() {
    let lang = document.querySelector('meta[name="ogame-language"]').content;
    if(!(lang in menuItemText)) {
        lang = 'de';
    }

    const menu = document.querySelector('#menuTable');

    const dialogLink = document.createElement('li');
    dialogLink.innerHTML = `
        <span class="menu_icon">
            <span class="statistics-menu-icon"></span>
        </span>
        <a class="menubutton" href="#">
            <span class="textlabel">${menuItemText[lang]}</span>
        </a>
    `;
    dialogLink.querySelector('a').addEventListener('click', () => {
        window.ogameTracker.visible = true;
    });

    menu.appendChild(dialogLink);
}

function attach() {
    if (ready)
        return;

    addMenuItem();
    ready = true;
    observer.disconnect();
}
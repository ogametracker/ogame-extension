import { env } from "@/shared/env";

export function addIconFonts() {
    const browser = env.browser;

    const linkMdi = document.createElement('link');
    linkMdi.rel = 'stylesheet';
    linkMdi.href = `/mdi/style.${browser}.css`;

    const linkOgti = document.createElement('link');
    linkOgti.rel = 'stylesheet';
    linkOgti.href = `/ogti/style.${browser}.css`;

    document.head.append(linkMdi);
    document.head.append(linkOgti);
}
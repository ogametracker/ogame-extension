import getQueryParameters from "./utils/getQueryParameters";

const queryParams = getQueryParameters(window.location);
if (queryParams.has('page', 'ingame')
    && queryParams.has('component', 'overview')
) {
    const observer = new MutationObserver(() => {
        const buffBar = document.querySelector('#buffBar');
        if(buffBar != null) {
            const jsDurations = buffBar.querySelectorAll('.js_duration');
            jsDurations.forEach(div => div.setAttribute('data-remaining-duration', div.textContent ?? '0'));

            observer.disconnect();
        }
    });

    observer.observe(document.documentElement, { 
        subtree: true,
        childList: true,
    });
}
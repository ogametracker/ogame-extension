import getQueryParameters from "./utils/getQueryParameters";

const queryParams = getQueryParameters(window.location);
if (queryParams.has('page', 'ingame')
    && queryParams.has('component', 'overview')
) {
    const jsDurations = document.querySelectorAll('#buffBar .js_duration');
    jsDurations.forEach(div => div.setAttribute('data-remaining-duration', div.textContent ?? '0'));
}
export function ignoreStupidMessagePortErrors() {
    const message = chrome.runtime.lastError?.message;
    if (![
        'Receiving end does not exist.',
        'The message port closed before a response was received.'
    ].some(error => message?.includes(error) ?? false)) {
        throw chrome.runtime.lastError;
    }
}
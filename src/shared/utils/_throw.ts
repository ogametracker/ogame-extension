export function _throw(message?: string): never {
    throw new Error('[OGame Tracker] ' + message);
}
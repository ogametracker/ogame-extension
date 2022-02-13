export function _throw(message?: string, data?: any): never {
    if (data != null) {
        throw { message, data };
    }
    throw new Error('[OGame Tracker] ' + message);
}
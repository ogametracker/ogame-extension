import { _logDebug } from "../_log";

export function __measure<T>(name: string, action: () => T): T {
    const start = performance.now();
    const result = action();
    const end = performance.now();

    _logDebug(`Performance measurement '${name}': ${(end - start).toFixed(3)}ms`);

    return result;
}
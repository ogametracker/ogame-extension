import { _throw } from "./utils/_throw";

type Browser = 'firefox' | 'chrome'
interface Environment {
    browser: Browser;
}

export const env: Environment = {
    browser: process.env.BROWSER as Browser ?? process.env.VUE_APP_BROWSER ?? _throw('invalid browser environment'),
};
import { _throw } from "../../shared/utils/_throw";

export function getMessageAttributes(msg: Element, className: string): { [key: string]: string } {
    const element = msg.querySelector(`.${className}`);
    if (!element) {
        _throw(`Cannot find .${className} element`);
    }

    const attributes = element.attributes;
    const extractedAttributes: { [key: string]: string } = {};
    for (const attribute of attributes) {
        if (attribute.name.startsWith('data-raw')) {
            const attributeName = attribute.name.replace('data-raw-', '');
            extractedAttributes[attributeName] = attribute.value;
        }
    }
    return extractedAttributes;
}
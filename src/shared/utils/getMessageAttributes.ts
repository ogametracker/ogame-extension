import { _throw } from "../../shared/utils/_throw";

export function getMessageAttributes(element: Element): Record<string, string> {
    const attributes = element.attributes;
    const extractedAttributes: Record<string, string> = {};
    for (const attribute of attributes) {
        if (attribute.name.startsWith('data-raw')) {
            const attributeName = attribute.name.replace('data-raw-', '');
            extractedAttributes[attributeName] = attribute.value;
        }
    }
    return extractedAttributes;
}
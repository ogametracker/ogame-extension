import { _throw } from "../../shared/utils/_throw";

export function getRawMessageAttributes(element: Element): Record<string, string> {
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

export function getMessageAttributes<T extends Record<string, (rawValue: string) => any>>(element: Element, conversions: T)
    : { [Key in keyof T]: ReturnType<T[Key]> }
{
    const rawAttributes = getRawMessageAttributes(element);

    const result = {} as any; // :(
    for(const [key, conversion] of Object.entries(conversions)) {
        const rawValue = rawAttributes[key] ?? _throw(`missing raw attribute value for attribute 'data-raw-${key}'`);

        result[key] = conversion(rawValue);
    }

    return result;
}
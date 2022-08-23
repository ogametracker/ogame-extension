export function getRGB(hexColor: string) {
    hexColor = hexColor.substring(1); // remove # at start
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);
    return { r, g, b };
}

export function getRGBString(hexColor: string | null): string | null {
    if (hexColor == null) {
        return null;
    }

    const { r, g, b } = getRGB(hexColor);
    return `${r}, ${g}, ${b}`;
}
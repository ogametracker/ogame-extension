type HexColor = string & `#${string}`;

interface ChartColor {
    bg: HexColor;
    border: HexColor;
}

function clamp(value: number, min = 0, max = 1) {
    if (value < min)
        return min;
    if (value > max)
        return max;
    return value;
}

function mixColor(color1: HexColor, color2: HexColor, alpha: number): HexColor {
    const c1 = {
        r: parseInt(color1.substr(1, 2), 16),
        g: parseInt(color1.substr(3, 2), 16),
        b: parseInt(color1.substr(5, 2), 16),
    };
    const c2 = {
        r: parseInt(color2.substr(1, 2), 16),
        g: parseInt(color2.substr(3, 2), 16),
        b: parseInt(color2.substr(5, 2), 16),
    };

    // clamp alpha form 0 to 1
    alpha = clamp(alpha);
    const oneMinusAlpha = 1.0 - alpha;

    const color = {
        r: Math.round(c1.r * oneMinusAlpha + c2.r * alpha),
        g: Math.round(c1.g * oneMinusAlpha + c2.g * alpha),
        b: Math.round(c1.b * oneMinusAlpha + c2.b * alpha),
    };

    return `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}` as HexColor;
}

function desaturate(color: HexColor, amount: number) {
    const c = {
        r: parseInt(color.substr(1, 2), 16),
        g: parseInt(color.substr(3, 2), 16),
        b: parseInt(color.substr(5, 2), 16),
    };

    const grey = Math.round((c.r + c.g + c.b) / 3);
    const grayHex = grey.toString(16).padStart(2, '0');
    const greyColor = `#${grayHex}${grayHex}${grayHex}` as HexColor;
    return mixColor(color, greyColor, clamp(amount));
}

const colors: { [key: string]: HexColor } = {
    blue: '#4285f4',
    red: '#c33737',
    yellow: '#fbbc04',
    green: '#9ecc00',
    teal: '#34a875',
    grey: '#aaaaaa',
    orange: '#ff6d01',
    sky: '#46bdc6',
    pink: '#a72766',
    petrol: '#075263',
    white: '#ffffff',
    purple: '#522eb3',
};

function defaultMixColor (color: HexColor): HexColor {
    return desaturate(mixColor(color, mixWithColor, 0.2), 0.1);
}

const mixWithColor: HexColor = '#000000';
const defaultColors: ChartColor[] = Object.values(colors).map(color => ({
    bg: defaultMixColor(color),
    border: color,
}));


function getDefaultChartColor(index: number): ChartColor {
    index = Math.max(0, Math.trunc(index));
    return defaultColors[index % defaultColors.length];
}


export {
    getDefaultChartColor,
    mixColor,
    defaultMixColor,
    HexColor,
    ChartColor,
};
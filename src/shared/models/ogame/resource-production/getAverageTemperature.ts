/** 
 * Returns the average position at the given position using the official list:
 * https://board.de.ogame.gameforge.com/index.php?thread/193098-offizielle-planetengr%C3%B6%C3%9Fen-in-version-6-1/
 */
export function getAverageTemperature(position: number): number {
    switch (position) {
        case 1: return 240;
        case 2: return 190;
        case 3: return 140;
        case 4: return 90;
        case 5: return 80;
        case 6: return 70;
        case 7: return 60;
        case 8: return 50;
        case 9: return 40;
        case 10: return 30;
        case 11: return 20;
        case 12: return 10;
        case 13: return -30;
        case 14: return -70;
        case 15: return -110;

        default: throw new Error('invalid position');
    }
}
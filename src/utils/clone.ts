//eslint-disable-next-line
export default function clone(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
}
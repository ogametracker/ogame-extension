export interface RawMessageData {
    id: number;
    date: number;
    text: string;
    html: string;
}

export interface RawDebrisFieldMessageData {
    id: number;
    date: number;
    coords: string;
    resources: {
        metal: number;
        crystal: number;
        deuterium: number;
    };
}
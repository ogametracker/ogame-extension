export interface RawMessageData {
    id: number;
    date: number;
    text: string;
    html: string;
}

export interface RawMessageDataV11 {
    id: number;
    date: number;
    attributes: { [key: string]: string };
}
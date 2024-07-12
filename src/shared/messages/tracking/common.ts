export interface RawMessageData {
    id: number;
    date: number;
    text: string;
    html: string;
    attributes: { [key: string]: string }; 
}
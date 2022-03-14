import { ItemGrade } from "./ItemGrade";

export interface Item {
    name: string;
    image: string;
    hash: string;
    grade: ItemGrade;
}
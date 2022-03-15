import { ItemGrade } from "./ItemGrade";
import { ItemHash } from "./ItemHash";

export interface Item {
    name: string;
    image: string;
    smallImage: string;
    hash: ItemHash;
    grade: ItemGrade;
}
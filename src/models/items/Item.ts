export enum ItemGrade {
    none = 'none',
    bronze = 'bronze',
    silver = 'silver',
    gold = 'gold',
    platinum = 'platinum',
}

export default interface Item {
    name: string;
    image: string;
    imageLarge?: string;
    hash: string;
    grade: ItemGrade;
}
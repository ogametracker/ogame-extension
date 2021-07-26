import { ItemHash } from ".";
import Item from "./Item";

type ItemDictionary = Record<ItemHash, Item>;
export default ItemDictionary;
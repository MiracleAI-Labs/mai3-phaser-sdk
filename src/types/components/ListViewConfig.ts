import { ScrollViewConfig } from "./ScrollViewConfig";
import { BaseConfig } from "../base/BaseConfig";

export interface ListViewConfig extends ScrollViewConfig {
  itemHeight: number;
  itemDatas: BaseConfig[][];
}

import { BaseConfig } from "../base/BaseConfig";
import { Alignment } from "../common";

export interface TabsConfig extends BaseConfig {
  items?: TabItem[];
  alignment?: Alignment;
  itemSpace?: number;
  texture?: string;
  fontColor: string;
  onTabClick?: (index: number) => void;
}

export interface TabItem {
  title?: string;
  texture?: string;
  activeImg: string;
}

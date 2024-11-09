import { BaseConfig } from "../base/BaseConfig";
import { TextStyle } from "../common";

export interface CheckboxGroupItem {
  text?: string;
  value?: string;
}

export interface CheckboxGroupConfig extends BaseConfig {
  x?: number;
  y?: number;
  labelSpace?: number;
  multiSelect?: boolean;
  defaultSelectedIndex?: number;
  textStyle?: TextStyle;
  items?: CheckboxGroupItem[];
  handleSelect?: Function;
  iconWidth: number;
  iconHeight: number;
  unCheckedTexture: string;
  checkedTexture: string;
  isCircle?: boolean;
}

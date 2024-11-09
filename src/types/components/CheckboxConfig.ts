import { BaseConfig } from "../base/BaseConfig";
import { TextStyle } from "../common";

export interface CheckboxConfig extends BaseConfig {
  x?: number;
  y?: number;
  iconWidth: number;
  iconHeight: number;
  unCheckedTexture: string;
  checkedTexture: string;
  isCircle?: boolean;
  isChecked?: boolean;
  text?: string;
  value?: string;
  textStyle?: TextStyle;
  labelSpace?: number;
  handleSelect?: Function;
}

import { BaseConfig } from "../base/BaseConfig";
import { TextStyle, Padding } from "../common";

export interface TextConfig extends BaseConfig {
  text?: string;
  textAlign?: string; // left | right | center
  isWordWrap?: boolean;
  autoWidth?: boolean;
  autoHeight?: boolean;
  textStyle?: TextStyle;
  isShow?: boolean;
}

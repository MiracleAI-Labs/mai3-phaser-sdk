import { BaseButtonConfig } from "../base/BaseButtonConfig";

export interface RoundedButtonConfig extends BaseButtonConfig {
  radius?: number;
  texture?: string;
  frame?: string | number;
  borderWidth?: number;
  borderColor?: number;
  backgroundColor?: number;
  backgroundAlpha?: number;
  text?: string;
  fontColor?: string;
  fontSize?: number;
}

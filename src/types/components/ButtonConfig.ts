import { BaseConfig } from "../base/BaseConfig";
import { TextStyle } from "../common";
import { ButtonHandle } from "../base/BaseButtonConfig";

export interface ButtonConfig extends BaseConfig {
  borderColorAlpha?: number;
  text?: string;
  textStyle?: TextStyle;
  radius?: number;
  handleHover?: ButtonHandle;
  handleOut?: ButtonHandle;
  handleDown?: ButtonHandle;
  handleUp?: ButtonHandle;
}

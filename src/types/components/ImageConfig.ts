import { BaseButtonConfig } from "../base/BaseButtonConfig";
import { TextStyle } from "../common";

export interface ImageConfig extends BaseButtonConfig {
  id?: string;
  x?: number;
  y?: number;
  type?: string;
  width?: number;
  height?: number;
  radius?: number;
  key?: string;
  frame?: string;
  isCircle?: boolean;
  draggable?: boolean;
  borderWidth?: number;
  borderColor?: number;
  backgroundColor?: number;
  backgroundAlpha?: number;
  text?: string;
  textStyle?: TextStyle;
  textX?: number;
  textY?: number;
}

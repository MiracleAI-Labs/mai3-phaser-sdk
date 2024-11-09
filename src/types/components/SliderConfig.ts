import { BaseBarConfig } from "./BaseBarConfig";
import { TextStyle } from "../common";

export interface SliderConfig extends BaseBarConfig {
  min?: number;
  max?: number;
  step?: number;
  progressPercent?: number;
  showValue?: boolean;
  valueTextStyle?: TextStyle;
  valueTextOffset?: { x?: number; y?: number };
  slider?: Phaser.GameObjects.GameObject | string;
  handleRadius?: number;
  handleBorderWidth?: number;
  handleBorderColor?: number;
  handleBackgroundColor?: number;
  handleBackgroundAlpha?: number;
  handleGeomType?: string;
  handleTexture?: string;
}

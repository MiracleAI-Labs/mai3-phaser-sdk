import { BaseConfig } from "../base/BaseConfig";

export interface BaseBarConfig extends BaseConfig {
  bgColor?: number;
  fillColor?: number;
  bgTexture?: string;
  fillTexture?: string;
  radius?: number;
  border?: number;
  borderWidth?: number;
  borderColor?: number;
  borderColorAlpha?: number;
  value?: number;
  process?: number;
}

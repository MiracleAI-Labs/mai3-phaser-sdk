import { BaseConfig } from "../base/BaseConfig";

export interface progressTextrureConfig {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  key?: string;
  frame?: string;
  leftWidth?: number;
  rightWidth?: number;
  topHeight?: number;
  bottomHeight?: number;
}

export interface ProgressBarConfig extends BaseConfig {
  barTexture?: progressTextrureConfig;
  fillTexture?: progressTextrureConfig;
  value?: number;
}

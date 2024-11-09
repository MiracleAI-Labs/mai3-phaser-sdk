import { BaseConfig } from "../base/BaseConfig";

export interface NinePatchConfig extends BaseConfig {
  texture?: string | Phaser.Textures.Texture;
  frame?: string | number;
  width?: number;
  height?: number;
  leftWidth?: number;
  rightWidth?: number;
  topHeight?: number;
  bottomHeight?: number;
}

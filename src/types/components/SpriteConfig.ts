import { BaseButtonConfig } from "../base/BaseButtonConfig";
import { BaseConfig } from "../base/BaseConfig";
export interface SpriteAnimConfig {
  key: string;
  frameKey?: string;
  frames?: number[];
  keys?: string[];
  frameRate: number;
  repeat: number;
}
//export type SpriteConfig = Phaser.Types.GameObjects.Sprite.SpriteConfig & BaseConfig;
export interface SpriteConfig
  extends BaseButtonConfig,
    Omit<Phaser.Types.GameObjects.Sprite.SpriteConfig, keyof BaseConfig> {
  animConfigs?: SpriteAnimConfig[];
}

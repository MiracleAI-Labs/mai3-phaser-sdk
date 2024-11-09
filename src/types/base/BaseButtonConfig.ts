import { BaseConfig } from "./BaseConfig";

export interface ButtonHandle {
  audio?: string;
  texture?: string | Phaser.Textures.Texture;
  handleFn?: Function;
}

export interface BaseButtonConfig extends BaseConfig {
  enableSmoothScaleAnim?: boolean;
  handleHover?: ButtonHandle;
  handleOut?: ButtonHandle;
  handleDown?: ButtonHandle;
  handleUp?: ButtonHandle;
}

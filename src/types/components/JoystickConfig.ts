import { BaseConfig } from "../base/BaseConfig";

export interface JoystickConfig extends BaseConfig {
    base: Phaser.GameObjects.Arc,
    thumb: Phaser.GameObjects.Arc,
} 
import { BaseScene } from "../game";
import { JoystickConfig } from "../types";
import { Container } from "./Container";
import VirtualJoystick from 'phaser3-rex-plugins/plugins/virtualjoystick.js';

export class Joystick extends Container<JoystickConfig> {
    protected _config: JoystickConfig;
    public instance?: VirtualJoystick;

    constructor(scene: BaseScene, config: JoystickConfig) {
        super(scene, config, "Joystick");
        this._config = config;

        this.reDraw(config);
        this.setEventInteractive();
    }

    reDraw(config: JoystickConfig) {
        this.instance = new VirtualJoystick(this.scene, config);
    }
}
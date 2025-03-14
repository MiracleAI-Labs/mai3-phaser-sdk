import Phaser from "phaser";
import { BaseButtonConfig, ButtonHandle } from "../types";
import { BaseScene } from "../game";
import { Container } from "./Container";
import Utils from "../utils";

export class BaseButton<T extends BaseButtonConfig = BaseButtonConfig> extends Container<T> {
  protected _baseConfig?: T;
  private lastAlpha?: number;
  constructor(scene: BaseScene, baseConfig?: T, type?: string) {
    super(scene, baseConfig, type);
    this._baseConfig = baseConfig;
  }

  protected initializeEvents(): void {
    super.initializeEvents();

    this.setEventInteractive();
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.off("pointerover", this.handleOver, this);
    this.off("pointerout", this.handleOut, this);
    this.off("pointerdown", this.handleDown, this);
    this.off("pointerup", this.handleUp, this);
    this.off("pointerupoutside", this.handleUp, this);

    this.on("pointerover", this.handleOver, this);
    this.on("pointerout", this.handleOut, this);
    this.on("pointerdown", this.handleDown, this);
    this.on("pointerup", this.handleUp, this);
    this.on("pointerupoutside", this.handleUp, this);
  }

  protected handleOver(): void {
    this.handleEvent(this._baseConfig?.handleHover);

    if (this._baseConfig?.enableSmoothScaleAnim) {
      Utils.smoothScale(this.scene.tweens, this, 1.02, 125);
    }
  }

  protected handleOut(): void {
    this.handleEvent(this._baseConfig?.handleOut);
    this.lastAlpha && (this.alpha = this.lastAlpha) && (this.lastAlpha = undefined);

    if (this._baseConfig?.enableSmoothScaleAnim) {
      Utils.smoothScale(this.scene.tweens, this, 1, 125);
    }
  }

  protected handleDown(): void {
    this.handleEvent(this._baseConfig?.handleDown);
    this.lastAlpha = this.alpha;
    this.alpha = 0.5;

    if (this._baseConfig?.enableSmoothScaleAnim) {
      Utils.smoothScale(this.scene.tweens, this, 0.95, 125);
    }
  }

  protected handleUp(): void {
    this.handleEvent(this._baseConfig?.handleUp);
    this.lastAlpha && (this.alpha = this.lastAlpha) && (this.lastAlpha = undefined);

    if (this._baseConfig?.enableSmoothScaleAnim) {
      Utils.smoothScale(this.scene.tweens, this, 1, 125);
    }
  }

  protected handleEvent(handle?: ButtonHandle): void {
    if (handle?.audio) {
      this.scene.sound.play(handle.audio);
    }

    if (handle?.handleFn) {
      handle.handleFn();
    }

    this.blendMode = Phaser.BlendModes.NORMAL;
  }
}

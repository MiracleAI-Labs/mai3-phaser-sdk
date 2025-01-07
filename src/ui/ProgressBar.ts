import { BaseScene } from "../game";
import { ProgressBarConfig } from "../types";
import { Container } from "./Container";

export class ProgressBar extends Container<ProgressBarConfig> {
  private bar?: Phaser.GameObjects.Image;
  private fill?: Phaser.GameObjects.Image;
  private _value: number = 0;
  protected _config: ProgressBarConfig;

  constructor(scene: BaseScene, config: ProgressBarConfig) {
    super(scene, config);
    this._config = config;
    this.Type = 'ProgressBar';
    this.initializeProgressBar();
  }

  private initializeProgressBar(): void {
    if (this.bar) {
      this.bar.destroy();
      this.bar = undefined;
    }
    if (this.fill) {
      this.fill.destroy();
      this.fill = undefined;
    }

    this.createBar();
    this.createFill();
    this.setDepth(this._config?.depth ?? 1);
    this.value = Math.min(1, Math.max(0, this._config.process ?? 0));
    this.value = Number(this.value.toFixed(2));
    this.updateProgress(this.value);
  }

  private createBar(): void {
    const { x = 0, y = 0, key = '', width = 0, height = 0 } = this._config.barTexture ?? {};
    this.bar = this.createImage(x, y, key, width, height);
    this.addChildAt(this.bar, 0);
  }

  private createFill(): void {
    const { x = 0, y = 0, key = '', width = 0, height = 0 } = this._config.fillTexture ?? {};
    this.fill = this.createImage(x, y, key, width, height);
    this.addChildAt(this.fill, 1);
  }

  private createImage(x: number, y: number, key: string, width: number, height: number): Phaser.GameObjects.Image {
    const image = this.scene.add.image(x, y, key);
    image.setOrigin(0);
    image.setDisplaySize(width, height);
    return image;
  }

  public updateProgress(progress: number): void {
    const barWidth = this._config.barTexture?.width ?? 0;
    const fillOffset = this._config.fillTexture?.x ?? 0;
    const realWidth = barWidth - fillOffset * 2;
    
    if (this._config.flipX) {
      // Progress bar from right to left
      this.fill?.setDisplaySize(progress * realWidth, this._config.fillTexture?.height ?? 0);
      const rightEdge = barWidth - fillOffset;
      const newX = rightEdge - (progress * realWidth);
      this.fill?.setPosition(newX, this._config.fillTexture?.y ?? 0);
    } else {
      // Progress bar from left to right
      this.fill?.setDisplaySize(progress * realWidth, this._config.fillTexture?.height ?? 0);
      this.fill?.setPosition(this._config.fillTexture?.x ?? 0, this._config.fillTexture?.y ?? 0);
    }
    
    this.updateConfig(this._config);
    this.RefreshBounds();
  }

  get value(): number {
    return this._value;
  }

  set value(value: number) {
    this._value = value;
  }

  public reDraw(newConfig: ProgressBarConfig): void {
    this._config = newConfig;
    this._config!.barTexture!.width = this._config.width;
    this._config!.barTexture!.height = this._config.height;
    this.initializeProgressBar();
  }

  public override destroy(fromScene?: boolean): void {
    this.bar?.destroy();
    this.bar = undefined;
    this.fill?.destroy();
    this.fill = undefined;
    super.destroy(fromScene);
  }

}

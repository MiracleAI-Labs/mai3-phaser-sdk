import { BaseScene } from "../game";
import { ProgressBarConfig } from "../types";
import { Container } from "./Container";

export class ProgressBar extends Container<ProgressBarConfig> {
  private bar?: Phaser.GameObjects.NineSlice;
  private fill?: Phaser.GameObjects.NineSlice;
  private _value: number = 0;
  protected _config: ProgressBarConfig;

  constructor(scene: BaseScene, config: ProgressBarConfig) {
    super(scene, config);
    this._config = config;
    this.Type = 'ProgressBar';
    this.initializeProgressBar();
  }

  private initializeProgressBar(): void {
    this.createBar();
    this.createFill();
    this.value = this._config.value ?? 0;
  }

  private createBar(): void {
    const { x = 0, y = 0, key = '', frame, width, height, leftWidth, rightWidth, topHeight, bottomHeight } = this._config.barTexture ?? {};
    this.bar = this.createNineSlice(x, y, key, frame, width, height, leftWidth, rightWidth, topHeight, bottomHeight);
    this.addChildAt(this.bar, 0);
  }

  private createFill(): void {
    const { x = 0, y = 0, key = '', frame, width, height, leftWidth, rightWidth, topHeight, bottomHeight } = this._config.fillTexture ?? {};
    this.fill = this.createNineSlice(x, y, key, frame, width, height, leftWidth, rightWidth, topHeight, bottomHeight);
    this.addChildAt(this.fill, 1);
  }

  private createNineSlice(x: number, y: number, key: string, frame?: string | number, width?: number, height?: number, leftWidth?: number, rightWidth?: number, topHeight?: number, bottomHeight?: number): Phaser.GameObjects.NineSlice {
    const nineSlice = this.scene.add.nineslice(x, y, key, frame, width, height, leftWidth, rightWidth, topHeight, bottomHeight);
    nineSlice.setOrigin(0);
    return nineSlice;
  }

  public updateProgress(progress: number): void {
    const barWidth = this._config.barTexture?.width ?? 0;
    const fillWidth = this._config.fillTexture?.x ?? 0;
    const realWidth = barWidth - fillWidth * 2;
    this.fill?.setSize(progress * realWidth, this.fill.height); 
    this._config.width = realWidth;
    this._config.height = this.fill?.height;
  }

  get value(): number {
    return this._value;
  }

  set value(value: number) {
    this._value = value;
    this.updateProgress(value);
  }

  public reDraw(newConfig: ProgressBarConfig): void {
    this._config = newConfig;
    this.bar?.destroy();
    this.fill?.destroy();
    this.removeAll();
    this.initializeProgressBar();
    this.updateProgress(this._value);
    this.updateConfig(this._config);
  }

  public override destroy(fromScene?: boolean): void {
    this.bar?.destroy();
    this.fill?.destroy();
    super.destroy(fromScene);
  }

}

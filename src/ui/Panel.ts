import { Container } from './Container';
import { PanelConfig } from '../types';
import Utils from '../utils';
import { BaseScene } from "../game";

export class Panel<T extends PanelConfig = PanelConfig> extends Container<T> {
  protected bg?: Phaser.GameObjects.RenderTexture | Phaser.GameObjects.NineSlice;
  protected _config?: T;

  constructor(scene: BaseScene, config: T) {
    super(scene, config);
    this._config = config;
    this.Type = 'Panel';
  }

  public render(): void {
    this.drawBackground();
  }

  public reDrawBackground(config: T): void {
    this._config = config;
    this.drawBackground();
  }

  public drawBackground(): void {
    this.RefreshBounds();
    this.updateConfigDimensions();
    
    if (this.shouldUseRenderTexture()) {
      this.createOrUpdateRenderTexture();
    } else {
      this.createOrUpdateNineSlice();
    }

    this.addChildAt(this.bg!, 0);
  }

  private updateConfigDimensions(): void {
    this._config!.width = Utils.GetOrDefaultValue(this._config?.width, this.RealWidth);
    this._config!.height = Utils.GetOrDefaultValue(this._config?.height, this.RealHeight);
  }

  private shouldUseRenderTexture(): boolean {
    return Utils.isNullOrZeroOrEmpty(this._config?.texture);
  }

  private createOrUpdateRenderTexture(): void {
    if (this.bg) {
      this.bg.destroy();
      this.bg = undefined;
    }

    const { width, height, borderWidth = 4, radius = 10, borderColor = 0xff8221, backgroundColor, backgroundAlpha } = this._config!;
    
    this.bg = Utils.reDrawRoundedRectRenderTexture(
      this.scene,
      this.bg! as Phaser.GameObjects.RenderTexture,
      0, 0, width, height,
      borderWidth, radius, borderColor as number,
      backgroundColor as number, backgroundAlpha
    ) || this.bg;
  }

  private createOrUpdateNineSlice(): void {
    if (this.bg && !(this.bg instanceof Phaser.GameObjects.NineSlice)) {
      this.bg.destroy();
      this.bg = undefined;
    }

    if (!this.bg) {
      this.createNineSlice();
    }

    this.updateNineSlice();
  }

  private createNineSlice(): void {
    const { texture = "", frame, width = 0, height = 0, leftWidth, rightWidth, topHeight, bottomHeight } = this._config!;
    
    this.bg = this.scene.add.nineslice(
      0, 0, texture, frame, width, height,
      leftWidth, rightWidth, topHeight, bottomHeight
    );
  }

  private updateNineSlice(): void {
    const bg = this.bg as Phaser.GameObjects.NineSlice;
    const { texture = "", frame, width = 0, height = 0 } = this._config!;
    
    bg.setTexture(texture, frame);
    bg.setDisplaySize(width, height);
    bg.setOrigin(0);
  }

  public reSize(width: number, height: number): void {
    this._config!.width = width;
    this._config!.height = height;
    this.reDrawBackground(this._config!);
  }
  
  destroy(fromScene?: boolean): void {
    if (this.bg) {
      this.bg.destroy();
      this.bg = undefined;
    }
    super.destroy(fromScene);
  }
}
import { Container } from './Container';
import { LabelConfig, TextStyle } from '../types';
import Utils from '../utils';
import { BaseScene } from "../game";
import { Panel } from './Panel';

const defaultStyle: TextStyle = {
  fontFamily: 'Arial',
  fontSize: '24px',
  color: '#fff',
};

export class Label extends Panel<LabelConfig> {
  private _width?: number;
  private _height?: number;
  private label?: Phaser.GameObjects.Text;
  protected _config: LabelConfig;

  constructor(scene: BaseScene, config: LabelConfig) {
    const padding = Utils.getPadding(config.padding);
    const width = padding.left + padding.right + (config.width ?? 0);
    const height = padding.top + padding.bottom + (config.height ?? 0);

    super(scene, { ...config, width, height });
    this._config = config;
    this.Type = 'Label';

    this.reDraw(config);
  }

  public reDraw(config: LabelConfig): void {
    this._config = config;
    this.validateConfig();
    this.drawText();
    this.reDrawBackground(this._config);
    this.RefreshBounds();
    this.updateConfig(this._config);
  }

  private validateConfig(): void {
    if (!this._config.autoWidth && !this._config.width) {
      throw new Error('Label ERROR: Label width must be specified when autoWidth is false');
    }
    if (this._config.autoWidth && this._config.isWordWrap) {
      throw new Error('Label ERROR: Label cannot be word wrapped when autoWidth is true');
    }
  }

  public drawText(): void {
    const { text = "Welcome to MiracleAI", textAlign = 'left' } = this._config;
    const style = this.getLabelStyle();
    const padding = Utils.getPadding(this._config.padding);

    this.createOrUpdateLabel(text, style);
    this.computedLabelSize();
    this.setLabelPosition(textAlign, padding);

    // console.log('config: ', this._config);
  }

  private createOrUpdateLabel(text: string, style: TextStyle): void {
    if (!this.label) {
      this.label = this.scene.make.text({});
      this.addChildAt(this.label, 1);
    }
    this.label.setText(text).setStyle(style);
    this.label.setFontStyle(this._config.textStyle?.fontStyle!);
  }

  private computedLabelSize(): void {
    const { autoWidth = false, autoHeight = false } = this._config;
    const padding = Utils.getPadding(this._config.padding);

    this._width = autoWidth ? (this.label?.displayWidth ?? 0) + padding.left + padding.right : this._config.width ?? 0;
    this._height = autoHeight ? (this.label?.displayHeight ?? 30) + padding.top + padding.bottom : this._config.height ?? (this.label?.displayHeight ?? 30) + padding.top + padding.bottom;

    this._config.width = this._width;
    this._config.height = this._height;
    
    // console.log(`this.label?.displayWidth: ${this.label?.displayWidth}, width: ${this._width}`);
  }

  private setLabelPosition(textAlign: string, padding: { top: number; left: number; right: number; }): void {
    const labelY = padding.top || (this._height! - this.label!.displayHeight) / 2;
    let labelX = padding.left;

    switch (textAlign) {
      case 'center':
        labelX = (this._width! - this.label!.displayWidth) / 2;
        break;
      case 'right':
        labelX = this._width! - this.label!.displayWidth - padding.right;
        break;
    }

    this.label!.setPosition(labelX, labelY);
  }

  private getLabelStyle(): TextStyle {
    const textStyle = this._config.textStyle ?? defaultStyle;
    const padding = Utils.getPadding(this._config.padding);
    const style: TextStyle = { ...textStyle, wordWrap: {}, padding };

    if (this._config.isWordWrap && !this._config.autoWidth) {
      style.wordWrap = {
        width: (this._config.width ?? 0) - padding.left - padding.right,
        useAdvancedWrap: true
      };
    }

    return style;
  }

  get Text(): string {
    return this.label!.text;
  }

  set Text(text: string) {
    this.reDraw({ ...this._config, text });
  }

  setWidth(width: number): void {
    this.reDraw({ ...this._config, width });
  }

  setStyle(textStyle: TextStyle): void {
    this.reDraw({ ...this._config, textStyle });
  }

  get TextWidth(): number {
    return this.label?.displayWidth ?? 0;
  }

  get Label(): Phaser.GameObjects.Text {
    return this.label!;
  }

  destroy(fromScene?: boolean): void {
    this.label?.destroy();
    this.label = undefined;
    super.destroy(fromScene);
  }
}
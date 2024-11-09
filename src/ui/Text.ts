import { Container } from './Container';
import { LabelConfig, TextConfig, TextStyle } from '../types';
import Utils from '../utils';
import { BaseScene } from "../game";

const defaultStyle = {
  fontFamily: 'Arial', // 字体
  fontSize: '24px', // 字号
  color: '#fff', // 颜色
};

export class Text extends Container<TextConfig> {
  private _width?: number;
  private _height?: number;
  protected _config: TextConfig;

  text: Phaser.GameObjects.Text;

  constructor(scene: BaseScene, config: TextConfig) {
    super(scene, config);
    this._config = config;
    this.Type = 'Text';

    const text = config.text || "Welcome to MiracleAI";
    const style = this.getLabelStyle(config);

    this.text = this.scene.make.text({ text, style: style as TextStyle });
    this.add(this.text);

    this.reDraw(config);
  }

  public reDraw(config: TextConfig) {
    this._config = config;
    this.computedLabelSize();

    const text = config.text || "Welcome to MiracleAI";
    const style = this.getLabelStyle(config);

    this.text.setText(text);
    this.text.setStyle(style);
    this.text.setFontStyle(config.textStyle?.fontStyle!);
    this.layout();
  }

  private layout() {
    const textAlign = this._config.textAlign ?? 'left';
    if (textAlign === 'left') {
      const labelY = (this._height! - this.text!.displayHeight) / 2;
      this.text!.setPosition(0, labelY);
    }

    if (textAlign === 'center') {
      const labelX = (this._width! - this.text!.displayWidth) / 2;
      const labelY = (this._height! - this.text!.displayHeight) / 2;
      this.text!.setPosition(labelX, labelY);
    }

    if (textAlign === 'right') {
      const labelX = this._width! - this.text!.displayWidth;
      const labelY = (this._height! - this.text!.displayHeight) / 2;
      this.text!.setPosition(labelX, labelY);
    }

    this.computedLabelSize();
    this.updateConfig(this._config);
    this.RefreshBounds();
  }

  private computedLabelSize() {
    const autoWidth = this._config.autoWidth ? true : (this._config.width ? false : true);
    const autoHeight = this._config.autoWidth ? true : (this._config.height ? false : true);
    this._width = autoWidth ? (this.scene.scale.width - 20) : (this._config.width ?? 150);
    this._width = autoWidth ? this.text.displayWidth : this._width;
    this._height = autoHeight ? this.text.displayHeight : (this._config.height ?? this.text.displayHeight);
    this._config.width = this._width;
    this._config.height = this._height;
  }

  private getLabelStyle(config: TextConfig) : LabelConfig{
    const textStyle = config.textStyle ?? defaultStyle;
    const autoWidth = config.width ? false : true;
    this._width = autoWidth ? (this.scene.scale.width - 20) : (config.width ?? 150);

    const style: LabelConfig = {
      ...textStyle,
      wordWrap: {},
      padding: config.padding,
      backgroundColor: undefined
    }

    let wordWrapWidth = this._width;
    wordWrapWidth = config.padding?.left ? (wordWrapWidth - config.padding.left) : wordWrapWidth;
    wordWrapWidth = config.padding?.right ? (wordWrapWidth - config.padding.right) : wordWrapWidth;
    wordWrapWidth = config.padding?.x ? (this._width - config.padding.x * 2) : wordWrapWidth;

    style.wordWrap = config.isWordWrap ? {
      width: wordWrapWidth !== this._width ? wordWrapWidth : this._width,
      useAdvancedWrap: config.isWordWrap
    } : {};

    return style;
  }

  get Text(): string {
    return this.text!.text;
  }

  set Text(text: string) {
    this._config = Utils.MergeRight(this._config, { text }) as TextConfig;
    this.reDraw(this._config);
  }

  setWidth(width: number) {
    this._config = Utils.MergeRight(this._config, { width }) as TextConfig;
    this.reDraw(this._config);
  }

  setStyle(textStyle: TextStyle) {
    this._config = Utils.MergeRight(this._config, { textStyle }) as TextConfig;
    this.reDraw(this._config);
  }

}
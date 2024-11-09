import { CheckboxConfig } from "../types";
import { BaseScene } from "../game";
import { Image } from "./Image";
import { Container } from "./Container";
import { BaseButton } from "./BaseButton";

export class Checkbox extends BaseButton<CheckboxConfig> {
  private _value: string = "";
  protected _config: CheckboxConfig;
  public isChecked: boolean = false;
  private label?: Phaser.GameObjects.Text;
  private checkboxButton?: Container;

  constructor(scene: BaseScene, config: CheckboxConfig) {
    super(scene, config);
    this.Type = "Checkbox";
    this._config = config;
    this.init();
  }

  private init(): void {
    this.reDraw();
    this.setEventInteractive();
  }

  protected handleDown(): void {
    super.handleDown();
    this.toggle();
    this._config.handleSelect?.(this);
    this.blendMode = "add";
  }

  private toggle(): void {
    this.isChecked = !this.isChecked;
    this.reDrawCheckboxButton();
  }

  public reDraw(config?: CheckboxConfig): void {
    if (config) this._config = config;
    this._value = this._config.value ?? "";
    this.isChecked = this._config.isChecked ?? false;
    this.reDrawCheckboxButton();
    this.reDrawLabel();
    this.RefreshBounds();
  }

  private reDrawLabel(): void {
    const text = this._config.text ?? "MiracleAI";
    const style = this._config.textStyle ?? {};
    
    if (!this.label) {
      this.label = this.scene.make.text({ text, style });
    } else {
      this.label.setText(text).setStyle(style);
      this.label.setFontStyle(this._config.textStyle?.fontStyle ?? '');
    }
    
    this.alignLabelWithCheckboxButton();
    this.addChild(this.label);
  }

  private alignLabelWithCheckboxButton(): void {
    if (!this.label || !this.checkboxButton) return;

    const labelSpace = this._config.labelSpace ?? 10;
    const fontSize = this.getLabelFontSize();
    this.label.x = this.checkboxButton.Right + labelSpace;
    this.label.y = this.checkboxButton.Top + (this.checkboxButton.RealHeight - fontSize) / 2;
  }

  private getLabelFontSize(): number {
    const fontSize = this._config.textStyle?.fontSize;
    if (typeof fontSize === "string") {
      return Number(fontSize.replace("px", ""));
    }
    return fontSize ?? 16;
  }

  private reDrawCheckboxButton(): void {
    this.createCheckboxButton();
    
    // 延迟更新遮罩位置，确保Image组件已完全初始化
    this.scene.time.delayedCall(0, () => {
      const bg = this.checkboxButton?.getByName("bg") as Image;
      bg?.updateMaskShapePos();

      const fill = this.checkboxButton?.getByName("fill") as Image;
      fill?.updateMaskShapePos();
    });
  }

  private createCheckboxButton() {
    if (this.checkboxButton) {
      this.checkboxButton.removeAll(true);
      this.checkboxButton.destroy(true);
    }

    const { iconWidth = 30, iconHeight = 30, unCheckedTexture, checkedTexture, isCircle = false } = this._config;
    const bgConfig = { x: 0, y: 0, width: iconWidth, height: iconHeight, key: unCheckedTexture, isCircle };
    const fillConfig = { ...bgConfig, key: checkedTexture };
    this.checkboxButton = this.scene.mai3.add.container({});

    const bg = this.scene.mai3.add.image(bgConfig);
    bg.setName("bg");
    this.checkboxButton.add(bg);

    const fill = this.scene.mai3.add.image(fillConfig);
    fill.setName("fill");
    fill.setVisible(this.isChecked);
    bg.setVisible(!this.isChecked);
    this.checkboxButton.add(fill);
    
    this.checkboxButton.RefreshBounds();
    this.add(this.checkboxButton);
  }

  set value(v: string) {
    this._value = v;
  }

  get value(): string {
    return this._value;
  }

  destroy(fromScene?: boolean): void {
    if (this.label) {
      this.label.destroy(fromScene);
      this.label = undefined;
    }
    if (this.checkboxButton) {
      this.checkboxButton.removeAll(true);
      this.checkboxButton.destroy(fromScene);
      this.checkboxButton = undefined;
    }
    super.destroy(fromScene);
  }
}

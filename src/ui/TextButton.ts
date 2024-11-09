import { TextButtonConfig, GridItem, BaseConfig } from "../types";
import Utils from "../utils";
import { BaseScene } from "../game";
import { BaseButton } from "./BaseButton";

export class TextButton
  extends BaseButton<TextButtonConfig>
  implements GridItem
{
  protected _config: TextButtonConfig;

  bg?: Phaser.GameObjects.RenderTexture;
  label?: Phaser.GameObjects.Text;
  columnSpan?: number;
  public image?: Phaser.GameObjects.NineSlice;

  constructor(scene: BaseScene, config: TextButtonConfig) {
    config.width = config.width ?? 200;
    config.height = config.height ?? 60;
    super(scene, config, "TextButton");
    this._config = config;
    this.columnSpan = 12;

    this.reDraw(config);
    this.setEventInteractive();
  }

  reDraw(config: TextButtonConfig) {
    config.width = config.width ?? 200;
    config.height = config.height ?? 60;
    this._config = config;

    const text = config.text ?? "MiracleAI";

    this.drawBackground(config);

    if (!this.label) this.label = this.scene.make.text({});

    this.label.setText(text);
    this.label.setStyle(config.textStyle ?? {});
    this.label.setFontStyle(config.textStyle?.fontStyle!);
    this.label.setPadding(config.textStyle?.padding ?? {});
    this.label.setOrigin(0);

    const x = (config.width - this.label?.displayWidth!) / 2;
    const y = (config.height - this.label?.displayHeight!) / 2;

    this.label?.setPosition(x, y);
    this.addChildAt(this.label, 1);

    this.drawIcon(config);

    this.updateConfig(config);
    this.RefreshBounds();
  }

  public drawIcon(config: TextButtonConfig): void {
    const iconWidth = config.iconWidth ?? 20;
    const iconHeight = config.iconHeight ?? 20;
    const iconPadding = config.iconPadding ?? 4;
    const iconPosition = config.iconPosition ?? "left";
    if (config.icon) {
      const labelX =
        iconPosition === "left"
          ? ((config.width ?? 0) -
              this.label?.displayWidth! -
              iconWidth -
              iconPadding) /
              2 +
            iconWidth +
            iconPadding
          : ((config.width ?? 0) -
              this.label?.displayWidth! -
              iconWidth -
              iconPadding) /
            2;
      this.label?.setPosition(labelX, this.label.y);
      const icon = this.scene.add.image(0, 0, config.icon);
      icon.setDisplaySize(config.iconWidth ?? 0, config.iconHeight ?? 0);
      icon.setOrigin(0);
      icon.setPosition(
        iconPosition === "left"
          ? labelX - iconPadding - iconWidth
          : labelX + iconPadding + (this.label?.displayWidth ?? 0),
        (this.label?.y ?? 0) +
          (this.label?.displayHeight ?? 0) / 2 -
          iconHeight / 2
      );
      this.addChildAt(icon, 2);
    }
  }

  public drawBackground(config: TextButtonConfig): void {
    if (config.texture) {
      if (this.image) {
        this.image.destroy();
        this.image = undefined;
      }

      if (!this.image)
        this.image = this.scene.add.nineslice(
          0,
          0,
          this._config.texture ?? "",
          this._config.frame ?? 0,
          this._config.width,
          this._config.height,
          this._config.leftWidth ?? 0,
          this._config.rightWidth ?? 0,
          this._config.topHeight ?? 0,
          this._config.bottomHeight ?? 0
        );

      this.image?.setTexture(
        (this._config.texture ?? "") as string,
        this._config.frame
      );
      this.image?.setDisplaySize(
        this._config.width ?? 0,
        this._config.height ?? 0
      );
      this.image?.setOrigin(0);
      this.addChild(this.image!);
    } else {
      const radius = config.radius ?? 0;
      const backgroundColor = config.backgroundColor ?? 0;
      const borderWidth = config.borderWidth ?? 0;
      const borderColor = config.borderColor || 0xcf4b00;
      if (this.bg) {
        this.bg.destroy(true);
        this.bg = undefined;
      }
      this.bg = Utils.reDrawRoundedRectRenderTexture(
        this.scene,
        this.scene.make.renderTexture({
          x: 0,
          y: 0,
          width: config.width,
          height: config.height,
        }),
        0,
        0,
        config.width,
        config.height,
        borderWidth,
        radius,
        borderColor as number,
        backgroundColor as number
      )!;
      this.addChildAt(this.bg, 0);
    }
  }

  set text(text: string) {
    if (this.label) this.label.text = text;
  }

  destroy(fromScene?: boolean) {
    if (this.bg) {
      this.bg.destroy();
      this.bg = undefined;
    }
    if (this.label) {
      this.label.destroy();
      this.label = undefined;
    }
    super.destroy(fromScene);
  }
}

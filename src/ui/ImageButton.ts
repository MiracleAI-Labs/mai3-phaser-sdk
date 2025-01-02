import { BaseScene } from "../game";
import { ImageButtonConfig } from '../types';
import { BaseButton } from "./BaseButton";
import { Text } from ".";

export class ImageButton extends BaseButton<ImageButtonConfig> {
  protected _config: ImageButtonConfig;
  public image?: Phaser.GameObjects.NineSlice;
  protected text?: Text;

  constructor(scene: BaseScene, config: ImageButtonConfig) {
    config.width = config.width ?? 200;
    config.height = config.height ?? 60;
    super(scene, config, "ImageButton");
    this._config = config;

    this.reDraw(config);
    this.setEventInteractive();
  }

  reDraw(config: ImageButtonConfig) {
    this._config = config;
    this._config.width = config.width ?? 200;
    this._config.height = config.height ?? 60;

    if (this.image) {
      this.image.destroy();
      this.image = undefined;
    }

    if (!this.image)
      this.image = this.scene.add.nineslice(
        0, 0,
        this._config.texture ?? "",
        this._config.frame ?? 0,
        this._config.width,
        this._config.height,
        this._config.leftWidth ?? 0,
        this._config.rightWidth ?? 0,
        this._config.topHeight ?? 0,
        this._config.bottomHeight ?? 0
      );

    this.image?.setTexture((this._config.texture ?? '') as string, this._config.frame);
    this.image?.setDisplaySize(this._config.width, this._config.height);
    this.image?.setOrigin(0);
    this.addChild(this.image!);

    this.RefreshBounds();
    this.reDrawText(config);
    this.updateConfig(config);
    this.setDepth(config?.depth ?? 1);
  }

  public reDrawText(config: ImageButtonConfig) {
    if (this.text) {
      this.text.destroy();
      this.text = undefined;
    }

    if (config.text === undefined || config.text === "" || config.text === null) {
      return;
    }

    this._config = config;
    const imageBounds = this.image?.getBounds();
    let isCenter: boolean = false;
    if (this._config.textX === undefined && this._config.textY === undefined) {
      isCenter = true;
    }

    const textConfig = {
      x: isCenter ? imageBounds!.width / 2 : this._config.textX ?? 0,
      y: isCenter ? imageBounds!.height / 2 : this._config.textY ?? 0,
      text: this._config.text ?? "",
      textStyle: this._config.textStyle ?? {},
    };
    this.text = new Text(this.scene, textConfig);

    if (isCenter) {
      this.text!.text!.setOrigin(0.5, 0.5);
    }

    this.add(this.text);
    this.RefreshBounds();
  }

  destroy(fromScene?: boolean) {
    if (this.image) {
      this.image.destroy();
      this.image = undefined;
    }
    super.destroy(fromScene);
  }
}

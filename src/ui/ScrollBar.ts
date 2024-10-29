import { BaseScene } from "../game";
import { Container } from "./Container";
import { ScrollBarConfig } from "../types";

const defaultConfig = {
  barColor: 0x888888,
};

export class ScrollBar extends Container {
  private _track: Phaser.GameObjects.Rectangle;
  private _thumb: Phaser.GameObjects.Graphics;
  private _direction: "x" | "y";
  private _thumbWidth: number;
  private _thumbHeight: number;

  constructor(scene: BaseScene, config: ScrollBarConfig) {
    super(scene);

    const mergedConfig = { ...defaultConfig, ...config };
    this._direction = mergedConfig.direction || "y";

    // Create a scrollbar track
    this._track = scene.add.rectangle(
      mergedConfig.x,
      mergedConfig.y,
      mergedConfig.width,
      mergedConfig.height,
      mergedConfig.backgroundColor
    );
    this._track.setOrigin(0, 0);

    this._thumb = scene.add.graphics();
    this._thumbWidth =
      this._direction === "y"
        ? mergedConfig.width || 0
        : (mergedConfig.width || 0) * 0.3;
    this._thumbHeight =
      this._direction === "y"
        ? (mergedConfig.height || 0) * 0.3
        : mergedConfig.height || 0;

    // Draw a rounded rectangular slider
    this._thumb.fillStyle(mergedConfig.barColor);
    const radius =
      this._direction === "y" ? this._thumbWidth / 2 : this._thumbHeight / 2;
    this._thumb.fillRoundedRect(
      mergedConfig.x ?? 0,
      mergedConfig.y ?? 0,
      this._thumbWidth ?? 0,
      this._thumbHeight ?? 0,
      radius
    );

    this.add(this._track);
    this.add(this._thumb);
  }

  updateThumbPosition(percent: number): void {
    const maxOffset =
      this._direction === "y"
        ? this._track.height - this._thumbHeight
        : this._track.width - this._thumbWidth;
    if (this._direction === "y") {
      this._thumb.y = maxOffset * percent;
    } else {
      this._thumb.x = maxOffset * percent;
    }
  }

  destroy(fromScene?: boolean): void {
    super.destroy(fromScene);
    this._track?.destroy(fromScene);
    this._thumb?.destroy(fromScene);
  }
}

import Utils from "../utils";
import { BaseConfig } from "../types";
import { Container } from "../ui";

const DragUtils = {
  setEventInteractive(
    container: Container,
    baseConfig?: BaseConfig,
    hitArea?: Phaser.Geom.Circle | Phaser.Geom.Rectangle
    ): Phaser.Geom.Circle | Phaser.Geom.Rectangle {
    if (baseConfig?.geomType === "Circle") {
      hitArea = this.createCircleHitArea(container, baseConfig, hitArea);
    } else {
      hitArea = this.createRectangleHitArea(container, baseConfig, hitArea);
    }

    return hitArea!;
  },

  createCircleHitArea(
    container: Container,
    baseConfig?: BaseConfig,
    hitArea?: Phaser.Geom.Circle | Phaser.Geom.Rectangle
  ): Phaser.Geom.Circle {
    if (!hitArea) hitArea = new Phaser.Geom.Circle();
    hitArea = hitArea as Phaser.Geom.Circle;

    const radius = baseConfig?.radius ?? 0;
    const borderWidth = baseConfig?.borderWidth ?? 0;
    hitArea.setPosition(radius + borderWidth, radius + borderWidth);
    hitArea.radius = radius + borderWidth;
    container.setInteractive(hitArea, Phaser.Geom.Circle.Contains);

    return hitArea;
  },

  createRectangleHitArea(
    container: Container,
    baseConfig?: BaseConfig,
    hitArea?: Phaser.Geom.Circle | Phaser.Geom.Rectangle
  ): Phaser.Geom.Rectangle {
    if (!hitArea) hitArea = new Phaser.Geom.Rectangle();
    hitArea = hitArea as Phaser.Geom.Rectangle;

    const width = Utils.GetValue(
      baseConfig!,
      "width",
      container.getBounds().width
    );
    const height = Utils.GetValue(
      baseConfig!,
      "height",
      container.getBounds().height
    );
    hitArea.setSize(width, height);
    hitArea.setPosition(0, 0);
    container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    // console.log("this.width, this.height: ", `${width}, ${height}`);
    return hitArea;
  },
};

export default DragUtils;

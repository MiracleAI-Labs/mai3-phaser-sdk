import { Container } from ".";
import { BaseScene } from "../game";
import { BaseConfig } from "../types";

export class EnemyContainer extends Container<BaseConfig> {
  protected _config: BaseConfig;

  constructor(scene: BaseScene, config: BaseConfig) {
    super(scene, config);
    this._config = config;
    this.Type = "EnemyContainer";
    this.reDraw(config);
  }

  reDraw(config: BaseConfig): void {
    this._config = config;
    const width = config.width ?? 0;
    const height = config.height ?? 0;
    
    // Create a background rectangle to give the container bounds
    const background = this.scene.add.rectangle(0, 0, width, height);
    background.setOrigin(0, 0);
    this.add(background);
    
    this.setSize(width, height);
    this.setPosition(config.x, config.y);
    this.setDepth(config?.depth ?? 1);
    this.setScrollFactor(config.isScrollFactor ? 0 : 1);
    this.updateConfig(config);
    this.RefreshBounds();
    this.setEventInteractive();
  }

  destroy(fromScene?: boolean): void {
    super.destroy(fromScene);
  }
}

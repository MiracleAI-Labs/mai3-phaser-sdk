import { BaseScene } from "../game";
import { BaseConfig, ListViewConfig } from "../types";
import { ScrollView, ItemPosition } from "./ScrollView";
import { Container } from "./Container";
export class ListView extends ScrollView<ListViewConfig> {
  private _lastItem?: Container;
  constructor(scene: BaseScene, config: ListViewConfig) {
    super(scene, config);
    this.Type = "ListView";
    this.setItemDatas(config?.itemDatas || []);
  }

  updateConfig(config?: ListViewConfig): void {
    super.updateConfig(config);
    this.setItemDatas(config?.itemDatas || []);
  }

  public addChild(child: Container): Container {
    const _child = super.addChild(child);
    const position = this.calculateNextItemPosition();
    _child.setPosition(position.x, position.y);
    this._lastItem = _child;
    return child;
  }

  public addItems(childConfigs: BaseConfig[][]): void {
    for (const childConfig of childConfigs) {
      const child = this.scene.getChild({
        type: "Container",
        width: this.config.width,
        height: this._config?.itemHeight,
        childConfigs: childConfig,
      });
      this.addChild(child);
    }
  }

  private calculateNextItemPosition(): ItemPosition {
    if (!this._lastItem) return { x: 0, y: 0 };
    return {
      x: this._direction === "x" ? this._lastItem.x + this._lastItem.Width : 0,
      y: this._direction === "y" ? this._lastItem.y + this._lastItem.Height : 0,
    };
  }

  public setChildren(childConfigs?: BaseConfig[]): void {
    // ListView has not implemented this method
  }

  public setItemDatas(itemDatas: BaseConfig[][]): void {
    if (!this._config) return;
    this.config.itemDatas = itemDatas;
    this.updateItems();
  }

  public updateItems(): void {
    if (!this._config || !this._content) return;
    let all = this._content?.getAll();
    if (!all || all?.length < this._config.itemDatas.length) {
      this._content?.removeAll(true);
      this._lastItem = undefined;
      for (let i = 0; i < this._config.itemDatas.length; i++) {
        const child = this.scene.getChild({
          type: "Container",
          childConfigs: this._config.itemDatas[i] || [],
          width: this.config.width,
          height: this._config.itemHeight,
        });
        this.addChild(child);
      }
    } else {
      all = this._content!.getAll();
      for (let i = 0; i < all.length; i++) {
        const item = all[i];
        if (item && this._config.itemDatas[i]) {
          (all[i] as Container).config.childConfigs =
            this._config.itemDatas[i];
          (all[i] as Container).reDraw((all[i] as Container).config);
        }
      }
    }
  }
}

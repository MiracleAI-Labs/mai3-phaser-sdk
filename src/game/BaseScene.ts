import Phaser from "phaser";
import { Mai3Plugin } from "../plugins/Mai3Plugin";
import ResizableComponentManager from "../utils/ResizableComponentManager";
import { Container } from "../ui/Container";
import UIComponentFactory from "../utils/UIComponentFactory";
import { BaseConfig } from "../types";
class BaseScene extends Phaser.Scene {
  mai3!: Mai3Plugin;
  public resizableManager: ResizableComponentManager;
  private printer?: Phaser.GameObjects.Text;
  private isDebugPrint: boolean = true;

  constructor(key: string) {
    super({ key });
    this.resizableManager = new ResizableComponentManager(this);
  }

  create() {}

  preload() {
    if (this.isDebugPrint) {
      this.setupDebugEnvironment();
    }
  }

  public setupDebugEnvironment() {
    const bg = this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x434349)
      .setOrigin(0, 0)
      .setInteractive()
      .setDepth(-1);

    ["pointerdown", "pointerup", "pointermove"].forEach((event) => {
      bg.on(event, this.printPointer, this);
    });

    this.printer = this.add.text(1, 1, "指针: 0, 0", {
      fontSize: "18px",
      color: "#ffffff",
    });
  }

  private printPointer(pointer: Phaser.Input.Pointer) {
    this.printer?.setText(
      `指针: ${pointer.x.toFixed(2)}, ${pointer.y.toFixed(2)}`
    );
  }

  public indexOfComponent(component: Container) {
    return this.resizableManager.components.indexOf(component);
  }

  public reDrawDragResizeComponent(component: Container) {
    const index = this.indexOfComponent(component);
    this.resizableManager?.updateResizeHandles(index);
  }

  public switchDragResizeComponent(component: Container) {
    this.resizableManager?.clear();
    this.resizableManager?.addComponent(component);
  }

  public addDragResizeComponent(component: Container) {
    this.resizableManager?.addComponent(component);
  }

  public addDragResizeComponents(components: Container[]) {
    components.forEach((item) => {
      this.resizableManager?.addComponent(item);
    });
  }

  public clearDragResizeComponents() {
    this.resizableManager?.clear();
  }

  public setChildren(parent?: Container, childConfigs?: BaseConfig[]): void {
    if (!parent || !childConfigs) return;
    for (const config of childConfigs) {
      const child = UIComponentFactory.createChildFromConfig(this, config);
      parent.addChild(child);
    }
  }

  public getChild(childConfig: BaseConfig): Container {
    const child = UIComponentFactory.createChildFromConfig(this, childConfig);
    return child;
  }
}

export default BaseScene;

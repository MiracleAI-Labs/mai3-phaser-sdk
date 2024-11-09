import { Container } from "../ui/Container";
import { ProgressBar } from "../ui/ProgressBar";
import { BaseScene } from "../game";
import { BaseBarConfig, BaseConfig } from "../types";

export default class ResizableComponentManager {
  private scene: BaseScene;
  private resizeHandles: Phaser.GameObjects.Rectangle[] = [];
  private resizeContainers: Phaser.GameObjects.Container[] = [];
  private isResizing: boolean = false;
  private activeHandle: Phaser.GameObjects.Rectangle | null = null;

  public components: Container[] = [];

  constructor(scene: BaseScene) {
    this.scene = scene;
  }

  addComponent(component: Container) {
    this.components.push(component);
    this.createResizeHandles(this.components.length - 1);
  }

  clear() {
    this.resizeContainers.forEach((item) => {
      item.destroy(true);
    });

    this.components = [];
    this.resizeContainers = [];
  }

  private createResizeHandles(componentIndex: number) {
    const component = this.components[componentIndex];
    const handleSize = 10;
    const padding = 5;
    const positions = this.getComponentBorderPositions(component, padding);

    const pos = component.getWorldTransformMatrix();
    const resizeContainer = this.scene.add.container(
      pos.tx - padding,
      pos.ty - padding
    );
    this.scene.add.existing(resizeContainer);
    this.resizeContainers.push(resizeContainer);

    const borderGraphics = this.scene.add.graphics();
    borderGraphics.lineStyle(2, 0xffffff, 1);
    borderGraphics.strokeRect(
      0,
      0,
      component.Width + padding * 2,
      component.Height + padding * 2
    );
    resizeContainer.setDepth(Infinity);
    resizeContainer.add(borderGraphics);

    positions.forEach((pos, index) => {
      const _pos = component.getWorldTransformMatrix();
      const handle = this.scene.add.rectangle(
        pos.x - _pos.tx + padding,
        pos.y - _pos.ty + padding,
        handleSize,
        handleSize,
        0xffffff
      );
      handle.setOrigin(0.5);
      handle.setInteractive({ draggable: true });
      handle.on("dragstart", () => this.startResize(handle, componentIndex));
      handle.on("drag", (pointer: Phaser.Input.Pointer) =>
        this.resize(pointer, index, componentIndex)
      );
      handle.on("dragend", () => this.endResize(componentIndex));
      this.resizeHandles.push(handle);
      resizeContainer.add(handle);
    });

    this.updateResizeHandles(componentIndex);
  }

  private getComponentBorderPositions(component: Container, padding: number) {
    const left = 0;
    const top = 0;
    const right = component.Width + padding * 2;
    const bottom = component.Height + padding * 2;
    const centerX = component.Width / 2;
    const centerY = component.Height / 2;

    return [
      { x: left, y: top },
      { x: centerX, y: top },
      { x: right, y: top },
      { x: left, y: centerY },
      { x: right, y: centerY },
      { x: left, y: bottom },
      { x: centerX, y: bottom },
      { x: right, y: bottom },
    ];
  }

  private startResize(
    handle: Phaser.GameObjects.Rectangle,
    componentIndex: number
  ) {
    this.isResizing = true;
    this.activeHandle = handle;
    const component = this.components[componentIndex];
    this.scene.events.emit("resizeStart", (component as Container).config);
  }

  private resize(
    pointer: Phaser.Input.Pointer,
    handleIndex: number,
    componentIndex: number
  ) {
    if (!this.isResizing || !this.activeHandle) return;

    const component = this.components[componentIndex];
    const resizeContainer = this.resizeContainers[componentIndex];
    const rePos = resizeContainer.getWorldTransformMatrix();
    const dx = pointer.x - rePos.tx - this.activeHandle.x;
    const dy = pointer.y - rePos.ty - this.activeHandle.y;

    const originalWidth = component.Width;
    const originalHeight = component.Height;
    let newWidth = originalWidth;
    let newHeight = originalHeight;
    let newX = component.x;
    let newY = component.y;

    const minWidth = 50;
    const minHeight = 30;

    switch (handleIndex) {
      case 0: // 左上
        newWidth = Math.max(originalWidth - dx, minWidth);
        newHeight = Math.max(originalHeight - dy, minHeight);
        newX += originalWidth - newWidth;
        newY += originalHeight - newHeight;
        break;
      case 1: // 上中
        newHeight = Math.max(originalHeight - dy, minHeight);
        newY += originalHeight - newHeight;
        break;
      case 2: // 右上
        newWidth = Math.max(originalWidth + dx, minWidth);
        newHeight = Math.max(originalHeight - dy, minHeight);
        newY += originalHeight - newHeight;
        break;
      case 3: // 左中
        newWidth = Math.max(originalWidth - dx, minWidth);
        newX += originalWidth - newWidth;
        break;
      case 4: // 右中
        newWidth = Math.max(originalWidth + dx, minWidth);
        break;
      case 5: // 左下
        newWidth = Math.max(originalWidth - dx, minWidth);
        newHeight = Math.max(originalHeight + dy, minHeight);
        newX += originalWidth - newWidth;
        break;
      case 6: // 下中
        newHeight = Math.max(originalHeight + dy, minHeight);
        break;
      case 7: // 右下
        newWidth = Math.max(originalWidth + dx, minWidth);
        newHeight = Math.max(originalHeight + dy, minHeight);
        break;
    }

    const newConfig: BaseConfig = {
      ...(component as Container).config,
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight,
    };

    if (component.Type === "RoundedButton") {
      if (newWidth !== originalWidth) {
        newConfig.radius = newWidth / 2;
      }
      if (newHeight !== originalHeight) {
        newConfig.radius = newHeight / 2;
      }
    }

    this.scene.events.emit("resize", newConfig);

    component.setPosition(newX, newY);
    (component as Container).reDraw(newConfig);
    component.setEventInteractive();

    if (component.Type === "ProgressBar") {
      (component as ProgressBar).updateProgress(
        (newConfig as BaseBarConfig).process ?? 0
      );
    }

    this.updateResizeHandles(componentIndex);
  }

  private endResize(componentIndex: number) {
    this.isResizing = false;
    this.activeHandle = null;
    const component = this.components[componentIndex];
    this.scene.events.emit("resizeEnd", (component as Container).config);
  }

  public updateResizeHandles(componentIndex: number) {
    const component = this.components[componentIndex];
    const resizeContainer = this.resizeContainers[componentIndex];
    const padding = 5;

    const pos = component.getWorldTransformMatrix();
    component.RefreshBounds();
    resizeContainer.setPosition(pos.tx - padding, pos.ty - padding);

    const positions = this.getComponentBorderPositions(component, padding);
    const borderGraphics = resizeContainer
      .list[0] as Phaser.GameObjects.Graphics;
    borderGraphics.clear();
    borderGraphics.lineStyle(2, 0xffffff, 1);
    borderGraphics.strokeRect(
      0,
      0,
      component.Width + padding * 2,
      component.Height + padding * 2
    );

    resizeContainer.list.slice(1).forEach((child, index) => {
      if (child instanceof Phaser.GameObjects.Rectangle) {
        child.setPosition(positions[index].x, positions[index].y);
      }
    });
  }
}

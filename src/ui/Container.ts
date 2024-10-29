import Phaser from "phaser";
import { BaseConfig } from "../types";
import Utils from "../utils";
import { BaseScene } from "../game";
import DragUtils from "../utils/DragUtils";

export class Container extends Phaser.GameObjects.Container {
  protected _id: string;
  protected _type?: string;
  protected _bounds?: Phaser.Geom.Rectangle;
  protected _hitArea?: Phaser.Geom.Rectangle | Phaser.Geom.Circle;
  protected _baseConfig?: BaseConfig;
  scene: BaseScene;
  protected _bg?: Phaser.GameObjects.Image | Phaser.GameObjects.RenderTexture;

  constructor(scene: BaseScene, baseConfig?: BaseConfig, type?: string) {
    super(scene, baseConfig?.x, baseConfig?.y);

    this._id = baseConfig?.id ?? "";
    this.scene = scene;
    this.Type = type ?? "Container";
    this.updateConfig(baseConfig);

    this.initializeEvents();
  }

  protected initializeEvents(): void {
    if (this._baseConfig?.draggable) {
      this.enableDrag();
      return;
    }
  }

  public updateConfig(config?: BaseConfig): void {
    this._baseConfig = config;
    this.setChildrenAsync(config?.childConfigs);
  }

  public setEventInteractive(): void {
    const hitArea = DragUtils.setEventInteractive(
      this,
      this._baseConfig,
      this._hitArea
    );
    if (!this._hitArea) this._hitArea = hitArea;
  }

  public findChild(
    id: string,
    gameObject?: Phaser.GameObjects.GameObject
  ): Phaser.GameObjects.GameObject | undefined {
    const container = (gameObject ?? this) as Container;
    return container.getAll().find((item) => (item as Container).id === id);
  }

  public enableDrag(): void {
    this.setEventInteractive();
    this.scene.input.setDraggable(this);
    this.on("drag", this.onDrag);
    this.on("dragend", this.onDragEnd);
  }

  public onDrag(
    pointer: Phaser.Input.Pointer,
    dragX: number,
    dragY: number
  ): void {
    const [clampedX, clampedY] = this.getClampedPosition(dragX, dragY);
    this.setPosition(clampedX, clampedY);
    this.onDragUpdate(pointer, this.x, this.y);
  }

  public onDragEnd(
    pointer: Phaser.Input.Pointer,
    dragX: number,
    dragY: number
  ): void {
    this.onDragEndUpdate(pointer, this.x, this.y);
  }

  private getClampedPosition(dragX: number, dragY: number): [number, number] {
    if (this.Type === "RoundedButton") {
      const radius = this._baseConfig?.radius ?? 0;
      const borderWidth = this._baseConfig?.borderWidth ?? 0;
      const radiusBorderWidth = (radius + borderWidth) * 2;
      return [
        Utils.clampX(dragX, this.scene.scale.width, radiusBorderWidth),
        Utils.clampY(dragY, this.scene.scale.height, radiusBorderWidth),
      ];
    }

    return [
      Utils.clampX(dragX, this.scene.scale.width, this.Width),
      Utils.clampY(dragY, this.scene.scale.height, this.Height),
    ];
  }

  public onDragUpdate(
    pointer: Phaser.Input.Pointer,
    dragX: number,
    dragY: number
  ): void {
    console.log(pointer, dragX, dragY);
  }

  public onDragEndUpdate(
    pointer: Phaser.Input.Pointer,
    dragX: number,
    dragY: number
  ): void {
    console.log(pointer, dragX, dragY);
  }

  get id(): string {
    return this._id ?? "";
  }

  set id(id: string) {
    this._id = id;
  }

  public RefreshBounds(): void {
    this._bounds = this.getBounds();
  }

  private cacheBounds(): void {
    if (!this._bounds) this.RefreshBounds();
  }

  get Width(): number {
    return (
      (this._baseConfig?.width ?? 0) +
      (this._baseConfig?.borderWidth ? this._baseConfig?.borderWidth * 2 : 0)
    );
  }

  get Height(): number {
    return (
      (this._baseConfig?.height ?? 0) +
      (this._baseConfig?.borderWidth ? this._baseConfig?.borderWidth * 2 : 0)
    );
  }

  get RealWidth(): number {
    this.cacheBounds();
    return this._bounds?.width ?? 0;
  }

  get RealHeight(): number {
    this.cacheBounds();
    return this._bounds?.height ?? 0;
  }

  get RealSize(): { width: number; height: number } {
    return { width: this.Width, height: this.Height };
  }

  get Top(): number {
    this.cacheBounds();
    return this._bounds?.top ?? 0;
  }

  get Left(): number {
    this.cacheBounds();
    return this._bounds?.left ?? 0;
  }

  get Right(): number {
    this.cacheBounds();
    return this._bounds?.right ?? 0;
  }

  get Bottom(): number {
    this.cacheBounds();
    return this._bounds?.bottom ?? 0;
  }

  get CenterX(): number {
    this.cacheBounds();
    return this._bounds?.centerX ?? 0;
  }

  get CenterY(): number {
    this.cacheBounds();
    return this._bounds?.centerY ?? 0;
  }

  get X(): number {
    this.cacheBounds();
    return this._bounds?.x ?? 0;
  }

  get Y(): number {
    this.cacheBounds();
    return this._bounds?.y ?? 0;
  }

  get Type(): string {
    return this._type ?? "Container";
  }

  set Type(type: string) {
    this._type = type;
  }

  get padding() {
    if (this._baseConfig?.padding?.all) {
      return {
        left: this._baseConfig!.padding.all,
        right: this._baseConfig!.padding.all,
        top: this._baseConfig!.padding.all,
        bottom: this._baseConfig!.padding.all,
      };
    } else {
      return {
        left: this._baseConfig?.padding?.left ?? 0,
        right: this._baseConfig?.padding?.right ?? 0,
        top: this._baseConfig?.padding?.top ?? 0,
        bottom: this._baseConfig?.padding?.bottom ?? 0,
      };
    }
  }

  public addChild(child: Phaser.GameObjects.GameObject): void {
    if (!this.exists(child)) {
      this.add(child);
      // this.scene.events.emit('addChildGameObject', child, this);
    }
  }

  public addChildAt(
    child: Phaser.GameObjects.GameObject,
    index?: number
  ): void {
    if (!this.exists(child)) {
      this.addAt(child, index);
    }
  }

  /**
   * Asynchronously sets multiple children to this container based on configuration objects
   * @param childConfigs Optional array of child configuration objects
   */
  public async setChildrenAsync(childConfigs?: BaseConfig[]): Promise<any> {
    if (!childConfigs) {
      return;
    }
    const UIComponentFactory = await import("../utils/UIComponentFactory");
    for (const config of childConfigs) {
      const child = UIComponentFactory.default.createChildFromConfig(
        this.scene,
        config
      );
      child.setSize(config.width ?? 0, config.height ?? 0);
      this.addChild(child);
    }
    this._baseConfig?.handleSetChildrenAsyncEnd?.(this.getAll() ?? []);
  }

  public drawBackground(config?: BaseConfig): void {
    if (this._bg) {
      this._bg.destroy();
      this._bg = undefined;
    }
    const {
      width,
      height,
      borderWidth = 4,
      radius = 10,
      borderColor = 0xff8221,
      backgroundColor,
      backgroundAlpha,
    } = config ?? this._baseConfig!;
    this._bg = Utils.reDrawRoundedRectRenderTexture(
      this.scene,
      this._bg! as Phaser.GameObjects.RenderTexture,
      0,
      0,
      (width ?? 0) + borderWidth * 2,
      (height ?? 0) + borderWidth * 2,
      borderWidth,
      radius,
      borderColor,
      backgroundColor,
      backgroundAlpha
    );
    this.addChildAt(this._bg!, 0);
  }

  drawBorderLine?: Phaser.GameObjects.Rectangle | Phaser.GameObjects.Arc;

  public debugDrawBorderLine(color?: number): void {
    const borderWidth = this._baseConfig?.borderWidth ?? 0;
    const width = this.getBounds().width + borderWidth * 2;
    const height = this.getBounds().height + borderWidth * 2;

    if (this.drawBorderLine) {
      this.drawBorderLine.destroy(true);
    }

    this.drawBorderLine = this.createDebugBorderLine(width, height, color);
    this.add(this.drawBorderLine);
  }

  private createDebugBorderLine(
    width: number,
    height: number,
    color?: number
  ): Phaser.GameObjects.Rectangle | Phaser.GameObjects.Arc {
    if (this._baseConfig?.geomType === "Circle") {
      return this.scene.add
        .circle(0, 0, width / 2, 0x000000, 0.1)
        .setStrokeStyle(4, color ?? 0xa52a2a, 1)
        .setOrigin(0);
    }
    return this.scene.add
      .rectangle(0, 0, width - 4, height - 4, 0x000000, 0.1)
      .setStrokeStyle(4, color ?? 0xa52a2a, 1)
      .setOrigin(0);
  }

  public debugHitArea(): void {
    this.scene.input.enableDebug(this);
  }

  debug(color?: number): void {
    this.debugDrawBorderLine(color);
    this.debugHitArea();
  }

  destroy(fromScene?: boolean): void {
    super.destroy(fromScene);
    this._bg?.destroy(fromScene);
  }
}

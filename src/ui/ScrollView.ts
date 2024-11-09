import { Container } from "./Container";
import { BaseScene } from "../game";
import {
  ScrollViewConfig,
  ScrollBarConfig,
  ScrollState,
  ScrollDirection,
  BaseConfig,
} from "../types";
import { ScrollBar } from "./ScrollBar";
import ScrollUtils from "../utils/ScrollUtils";

export interface ItemPosition {
  x: number;
  y: number;
}

export class ScrollView<
  T extends ScrollViewConfig = ScrollViewConfig
> extends Container<T> {
  private _mask?: Phaser.GameObjects.Graphics;
  private _maskBounds?: Phaser.Geom.Rectangle;
  protected _direction: ScrollDirection;
  private _scrollBar?: ScrollBar;
  private _scrollState: ScrollState;
  protected _config?: T;

  constructor(scene: BaseScene, config: T) {
    super(scene, config);
    this.Type = "ScrollView";
    this._direction = config.direction ?? "y";
    this._scrollState = {
      isScrolling: false,
      start: 0,
      current: 0,
      momentum: 0,
    };
    this._config = config;

    this.initialize();
  }

  reDraw(config?: T): void {
    this.clear();
    this._direction = config?.direction ?? "y";
    this._config = config;
    this.initialize();
  }
  clear(): void {
    this._content?.removeAll(true);
    this.removeAll(true);
    this._scrollState = {
      isScrolling: false,
      start: 0,
      current: 0,
      momentum: 0,
    };
  }

  private initialize(): void {
    this.drawBackground();
    this.setupContent();
    this.setupScrollBar();
    this.setupMask();
    this.setupEvents();
    this.updateScrollBarPosition();
    this.updateVisibleItems();
    this.setChildren(this._config?.childConfigs);
  }

  private setupContent(): void {
    this._content = new Container(this.scene);
    this._content.setPosition(
      this.padding.left, // + (this._config?.borderWidth ?? 0),
      this.padding.top // + (this._config?.borderWidth ?? 0)
    );
    this._content.setSize(
      this._config!.width - this.padding.left - this.padding.right,
      this._config!.height - this.padding.top - this.padding.bottom
    );
    this.addChildAt(this._content, 1);
    this.scene.input.enableDebug(this._content);
    this.RefreshBounds();
  }

  private setupMask(): void {
    this.RefreshBounds();
    this._mask?.destroy();
    this._mask = new Phaser.GameObjects.Graphics(this.scene);
    this._mask
      .clear()
      .fillStyle(0x000000)
      .fillRect(this.X, this.Y, this.Width, this.Height);

    this._content?.setMask(
      new Phaser.Display.Masks.GeometryMask(this.scene, this._mask)
    );

    this._maskBounds = new Phaser.Geom.Rectangle(
      this.X,
      this.Y,
      this.Width,
      this.Height
    );
  }

  private setupScrollBar(): void {
    if (!this._config!.showScrollbar) return;
    const scrollBarConfig: ScrollBarConfig = this.createScrollBarConfig();
    this._scrollBar = new ScrollBar(this.scene, scrollBarConfig);
    this.add(this._scrollBar);
  }

  private createScrollBarConfig(): ScrollBarConfig {
    const borderWidth = this._config?.borderWidth ?? 0;
    return this._direction === "y"
      ? {
          x: this.Width - borderWidth - 6,
          y: borderWidth,
          width: 6,
          height: this.Height - borderWidth * 2,
          direction: "y",
        }
      : {
          x: borderWidth,
          y: this.Height - borderWidth - 6,
          width: this.Width - borderWidth * 2,
          height: 6,
          direction: "x",
        };
  }

  public addChild(child: Container): Container {
    this._content?.addChild(child);
    this.updateScrollBarPosition();
    this.updateVisibleItems();
    return child;
  }

  public setChildren(childConfigs?: BaseConfig[]): void {
    if (!childConfigs || !this._config) return;
    this._config!.childConfigs = childConfigs;
    this._content?.removeAll(true);
    this.scene.setChildren(this, childConfigs);
  }

  public getItemsAtIndex(index: number): Container[] {
    return (this._content?.getAll()[index] as Container)?.getAll() ?? [];
  }

  addedToScene(): void {
    this.setupMask();
  }

  private setupEvents(): void {
    this.setInteractive();
    this.scene.input.on("pointerdown", this.handleDown, this);
    this.scene.input.on("pointermove", this.handleMove, this);
    this.scene.input.on("pointerup", this.handleUp, this);
    try {
      if (this._config?.draggable) {
        this.enableDrag();
      } else {
        this.disableDrag();
      }
    } catch (err) {
      //
    }
  }

  private handleDown = (pointer: Phaser.Input.Pointer): void => {
    if (this._config?.disableScroll) return;
    if (!this._maskBounds?.contains(pointer.x, pointer.y)) return;
    if (this.scrollSize <= this._config!.height) return;
    this._scrollState.isScrolling = true;
    this._scrollState.start = pointer[this._direction];
    this._scrollState.current = this._content![this._direction];
    this._scrollState.momentum = 0;
  };

  private handleMove = (pointer: Phaser.Input.Pointer): void => {
    if (!this._scrollState.isScrolling || !pointer.isDown) return;

    const delta = pointer[this._direction] - this._scrollState.start;
    const newPos = this.calculateNewPosition(this._scrollState.current + delta);

    this.updateContentPosition(newPos);
    this._scrollState.momentum = pointer.velocity[this._direction];

    this.updateScrollBarPosition();
    this.updateVisibleItems();
  };

  private handleUp = (): void => {
    if (!this._scrollState.isScrolling) return;

    this._scrollState.isScrolling = false;
    if (Math.abs(this._scrollState.momentum) > 0.5) {
      this.applyScrollMomentum();
    }
  };

  private calculateNewPosition(position: number): number {
    return ScrollUtils.calculateNewPosition(
      position,
      this._direction,
      this._direction === "y" ? this.Height : this.Width,
      this.scrollSize,
      this._config!.padding || {},
      this._config?.borderWidth ?? 0
    );
  }

  private updateContentPosition(position: number): void {
    if (this._direction === "y") {
      this._content?.setY(position);
    } else {
      this._content?.setX(position);
    }
  }

  private applyScrollMomentum(): void {
    // New position after calculating scroll momentum
    // Based on the current position plus the momentum value, the momentum value will be amplified according to its absolute value
    // The greater the momentum, the farther the rolling distance
    const newPos = this.calculateNewPosition(
      this._content![this._direction] +
        this._scrollState.momentum *
          (1 + Math.abs(this._scrollState.momentum) * 0.01)
    );
    this.scene.tweens.add({
      targets: this._content,
      [this._direction]: newPos,
      duration: 500,
      ease: Phaser.Math.Easing.Cubic.Out,
      onUpdate: () => {
        this.updateScrollBarPosition();
        this.updateVisibleItems();
      },
    });
  }

  private updateScrollBarPosition(): void {
    if (!this._scrollBar) return;
    ScrollUtils.updateScrollBarPosition(
      this._content!,
      this._scrollBar!,
      this._direction,
      this._direction === "y" ? this.Height : this.Width,
      this.scrollSize,
      this._config!.padding || {}
    );
  }

  private updateVisibleItems(): void {
    if (!this._content) return;
    if (this._scrollBar) {
      this._scrollBar.visible = this.scrollSize > this._config!.height;
    }
    ScrollUtils.updateVisibleItems(
      this._content!,
      this._direction,
      this._direction === "y" ? this.Height : this.Width
    );
  }

  public get scrollSize(): number {
    if (!this._content || this._content.list.length === 0) {
      return 0;
    }

    return (
      this._lastChild![this._direction] +
      (this._direction === "y"
        ? this._lastChild!.Height
        : this._lastChild!.Width) +
      (this._config?.padding?.all ??
        (this._direction === "y" ? this.padding.bottom : this.padding.right) ??
        0)
    );
  }

  setPosition(x?: number, y?: number, z?: number, w?: number): this {
    if (this._config) {
      this.setupMask();
    }
    return super.setPosition(x, y, z, w);
  }
  protected get _lastChild(): Container | undefined {
    const list = this._content
      ?.getAll()
      .sort((a, b) => (a as Container).Y - (b as Container).Y);
    return list?.[list.length - 1] as Container;
  }

  destroy(fromScene?: boolean): void {
    super.destroy(fromScene);
    this._content?.destroy(fromScene);
    this._scrollBar?.destroy(fromScene);
    this._mask?.destroy(fromScene);
  }
}

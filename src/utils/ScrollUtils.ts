import { Container } from "../ui/Container";
import { ScrollBar } from "../ui/ScrollBar";
import { Padding, ScrollDirection } from "../types";

class ScrollUtils {
  static calculateNewPosition(
    position: number,
    direction: ScrollDirection,
    viewSize: number,
    scrollSize: number,
    padding: Padding,
    borderWidth: number
  ): number {
    const max =
      (padding.all ?? (direction === "y" ? padding.top : padding.left) ?? 0) +
      borderWidth;
    const min = Math.min(0, viewSize - (scrollSize || 0));
    return Phaser.Math.Clamp(position, min, max);
  }

  static updateScrollBarPosition(
    content: Container,
    scrollBar: ScrollBar,
    direction: ScrollDirection,
    viewSize: number,
    scrollSize: number,
    padding: Padding
  ): void {
    if (!scrollBar) return;

    const currentPos =
      content[direction] -
      (padding.all ?? (direction === "y" ? padding.top : padding.left) ?? 0);

    const scrollPercent =
      Math.abs(currentPos) /
      (scrollSize + (padding?.all ?? padding?.top ?? 0) - viewSize);

    scrollBar.updateThumbPosition(scrollPercent);
  }

  static updateVisibleItems(
    content: Container,
    direction: ScrollDirection,
    viewSize: number
  ): void {
    const viewportStart = -content[direction];
    const viewportEnd = viewportStart + viewSize;
    content.list.forEach((child: Phaser.GameObjects.GameObject) => {
      if (child instanceof Container) {
        const itemStart = child[direction];
        const itemEnd =
          itemStart + (direction === "y" ? child.Height : child.Width);
        child.visible = itemEnd >= viewportStart && itemStart <= viewportEnd;
      }
    });
  }
}

export default ScrollUtils;

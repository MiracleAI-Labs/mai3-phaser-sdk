import { PanelConfig } from "./PanelConfig";
import { Alignment } from "../common";
import { Container } from "../../ui/Container";

export interface GridConfig extends PanelConfig {
  width?: number;
  height?: number;
  rows?: number;
  columns?: number;
  rowGap?: number;
  columnGap?: number;
  autoFill?: boolean;
  draggable?: boolean;
  borderWidth?: number;
  auxiliaryLineWidth?: number;
  auxiliaryLineColor?: number;
  radius?: number;
  borderColor?: number;
  showGrid?: boolean;
  alignment?: Alignment;
  children?: GridItem[];
  handleDragStart?: (
    dragChild: Container | undefined,
    pointer: Phaser.Input.Pointer,
    dragX: number,
    dragY: number
  ) => void;
  handleDrag?: (
    dragChild: Container | undefined,
    pointer: Phaser.Input.Pointer,
    dragX: number,
    dragY: number
  ) => void;
  handleDragEnd?: (
    dragChild: Container | undefined,
    targetChild: Container | undefined,
    pointer: Phaser.Input.Pointer
  ) => void;
}

export interface GridItem extends Container {
  columnSpan?: number;
}

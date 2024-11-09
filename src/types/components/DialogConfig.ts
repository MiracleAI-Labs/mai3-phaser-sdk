import { OrientationTypes, Alignment, Padding } from "../common";
import { Container } from "../../ui/Container";
import { PanelConfig } from "./PanelConfig";
import { ImageButtonConfig } from "./ImageButtonConfig";

export interface DialogConfig extends PanelConfig {
  width?: number;
  height?: number;
  frame?: number;
  leftWidth?: number;
  rightWidth?: number;
  topHeight?: number;
  bottomHeight?: number;
  texture?: string;
  isShowCloseButton?: boolean;
  closeButtonConfig?: ImageButtonConfig;
}

import { BaseConfig } from "../base/BaseConfig";
import { Padding } from "../common";
export interface ScrollState {
  isScrolling: boolean;
  start: number;
  current: number;
  momentum: number;
}

export type ScrollDirection = "x" | "y";

export interface ScrollViewConfig extends BaseConfig {
  width: number;
  height: number;
  padding?: Padding;
  direction?: ScrollDirection;
  showScrollbar?: boolean;
  disableScroll?: boolean;
}

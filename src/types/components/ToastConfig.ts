import { LabelConfig } from "./LabelConfig";
import { Alignment, Margin } from "../common";

export interface ToastConfig extends LabelConfig {
  alignment?: Alignment;
  type?: "success" | "warn" | "error" | "info";
  animationType?:
    | "fade"
    | "slide"
    | "slideDown"
    | "slideUp"
    | "scale"
    | "bounce";
  duration?: number;
  margin?: Margin;
}

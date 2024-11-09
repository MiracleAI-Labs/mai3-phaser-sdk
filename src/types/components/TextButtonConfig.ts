import { ButtonConfig } from "./ButtonConfig";
import { NinePatchConfig } from "./NinePatchConfig";
export interface TextButtonConfig extends ButtonConfig, NinePatchConfig {
  icon?: string;
  iconWidth?: number;
  iconHeight?: number;
  iconPosition?: "left" | "right";
  iconPadding?: number;
}

import { NinePatchConfig } from "./NinePatchConfig";
import { ButtonHandle } from "../base/BaseButtonConfig";

export interface ImageButtonConfig extends NinePatchConfig {
  handleHover?: ButtonHandle;
  handleOut?: ButtonHandle;
  handleDown?: ButtonHandle;
  handleUp?: ButtonHandle;
}

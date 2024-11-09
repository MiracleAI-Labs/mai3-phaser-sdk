import { LabelConfig } from "./LabelConfig";

export interface TextBoxConfig extends LabelConfig {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  isPassword?: boolean;
  placeholder?: string;
  value?: string;
  textRows?: number;
  maxLength?: number;
}

import { PanelConfig } from "./PanelConfig";
import { TextStyle, Padding, WordWrap } from "../common";

export interface LabelConfig extends PanelConfig {
  text?: string;
  textAlign?: string; // left | right | center
  isWordWrap?: boolean;
  autoWidth?: boolean;
  autoHeight?: boolean;
  borderWidth?: number;
  radius?: number;
  textStyle?: TextStyle;
  padding?: Padding;
  wordWrap?: WordWrap;
}

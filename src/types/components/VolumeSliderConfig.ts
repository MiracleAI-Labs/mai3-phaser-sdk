import { SliderConfig } from "./SliderConfig";
import { TextStyle } from "../common";

export interface VolumeSliderConfig extends SliderConfig {
  text?: string;
  value?: number;
  textStyle?: TextStyle;
}

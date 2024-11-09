import { BaseConfig } from "../base/BaseConfig";
import { Alignment } from "../common";
import { Container } from "../../ui/Container";

export interface FlexLayoutConfig extends BaseConfig {
  alignment?: Alignment;
  contents?: Container[];
}

export interface FlexLayoutConfig extends BaseConfig {
  space?: number;
  alignItems?: "flex-start" | "flex-end" | "center" | "stretch";
  justifyContent?: "flex-start" | "flex-end" | "center";
  flexDirection?: "row" | "column";
  children?: Container[];
}

import { BaseConfig } from "../base/BaseConfig";
import { Container } from "../../ui/Container";
import { Alignment, Padding } from "../common";

export interface LinearLayoutConfig extends BaseConfig {
  borderWidth?: number;
  borderColor?: number;
  radius?: number;
  background?: string | number;
  children?: Container[];
  alignment?: Alignment;
  itemSpace?: number;
  padding?: Padding;
}

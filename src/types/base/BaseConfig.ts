import { OrientationTypes, Padding } from "../common";

export interface BaseConfigProperties {
  id?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  draggable?: boolean;
  radius?: number;
  borderWidth?: number;
  space?: number;
  orientation?: OrientationTypes;
  geomType?: string;
  depth?: number;
  originalId?: string;
  type?: string;
  columnSpan?: number;
  childConfigs?: BaseConfig[];

  borderColor?: string | number;
  backgroundColor?: string | number;
  backgroundAlpha?: number;
  padding?: Padding;

}

export interface BaseConfig extends BaseConfigProperties {
  [key: string]: any; // Allow adding other properties 
}

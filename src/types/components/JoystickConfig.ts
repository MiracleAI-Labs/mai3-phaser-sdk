import { BaseConfig } from "../base/BaseConfig";

export interface JoystickConfig extends BaseConfig {
    base?: {
        key: string;
        frame?: number;
        radius?: number;
    };
    thumb?: {
        key: string;
        frame?: number;
        radius?: number;
    };
}
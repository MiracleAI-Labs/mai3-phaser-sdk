import { Wallet, WalletApp as walletApp } from "../../game";
import { Checkbox } from "../../ui/Checkbox";
import { CheckboxGroup } from "../../ui/CheckboxGroup";
import { Container } from "../../ui/Container";
import { ImageButton } from "../../ui/ImageButton";
import { Label } from "../../ui/Label";
import { ProgressBar } from "../../ui/ProgressBar";
import { RoundedButton } from "../../ui/RoundedButton";
import { Slider } from "../../ui/Slider";
import { TextBox } from "../../ui/TextBox";
import { TextButton } from "../../ui/TextButton";
import { VolumeSlider } from "../../ui/VolumeSlider";
import Phaser from "phaser";

export type OrientationTypes = "horizontal" | "vertical";
export type Mai3Component =
  | TextButton
  | ImageButton
  | RoundedButton
  | Checkbox
  | CheckboxGroup
  | Label
  | ProgressBar
  | Slider
  | VolumeSlider
  | TextBox;
export type BackgroundType =
  | Phaser.GameObjects.Sprite
  | Phaser.GameObjects.Rectangle
  | Phaser.GameObjects.Graphics
  | Phaser.GameObjects.RenderTexture;
export type TextStyle = Phaser.Types.GameObjects.Text.TextStyle;
export type PhaserTextPadding = Phaser.Types.GameObjects.Text.TextPadding;
export type RoundedRectRadius =
  | Phaser.Types.GameObjects.Graphics.RoundedRectRadius
  | number;

export type WalletApp = walletApp;
export type Styles = "light" | "dark";
export type Locales = "en" | "ru";

export interface Locale {
  connectWallet: string;
  disconnectWallet: string;
  copyAddress: string;
  addressCopied: string;
}

export interface LocalesDictionary {
  en: Locale;
  ru: Locale;
  [k: string]: Locale;
}

export interface HandleError {
  (error: Error | unknown): void;
}

export interface Padding extends PhaserTextPadding {
  all?: number;
}
export type BorderWidths = Padding;
export type Margin = Padding;

export interface BorderRadius {
  all?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomRightRadius?: number;
  borderBottomLeftRadius?: number;
}

export const BorderStyle = {
  dotted: "dotted", // 定义点线边框
  dashed: "dashed", // 定义虚线边框
  solid: "solid", // 定义实线边框
  double: "double", // 定义双边框
  groove: "groove", // 定义 3D 坡口边框。效果取决于 border-color 值
  ridge: "ridge", // 定义 3D 脊线边框。效果取决于 border-color 值
  inset: "inset", // 定义 3D inset 边框。效果取决于 border-color 值
  outset: "outset", // 定义 3D outset 边框。效果取决于 border-color 值
  none: "none", // 定义无边框
  hidden: "hidden", // 定义隐藏边框
};

export const FontStyle = {
  normal: "normal",
  italic: "italic",
  oblique: "oblique",
};

export const FontWeight = {
  normal: "normal",
  bold: "bold",
};

export interface Alignment {
  horizontal: "left" | "center" | "right";
  vertical: "top" | "middle" | "bottom";
}

export interface CheckboxItem {
  label?: string;
  value?: number;
}

export interface CssStyle {
  width?: number;
  height?: number;
  borderWidths?: BorderWidths;
  borderStyle?: string; // BoderStyle
  borderColor?: string;
  backgroundColor?: string;
  borderRadius?: BorderRadius;
  boxSizing?: string;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  fontStyle?: string;
  fontWeight?: string;
  paddings?: Padding;
  zIndex?: number;
}

export interface DragHandlers {
  handleDragStart?: (
    child: Container,
    pointer: Phaser.Input.Pointer,
    dragX: number,
    dragY: number
  ) => void;
  handleDrag?: (
    pointer: Phaser.Input.Pointer,
    dragX: number,
    dragY: number
  ) => void;
  handleDragEnd?: (pointer: Phaser.Input.Pointer) => void;
}

export type { Wallet };


export interface WordWrap {
  width?: number;
  useAdvancedWrap?: boolean;
}
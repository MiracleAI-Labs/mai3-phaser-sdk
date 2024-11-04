import {
  Container,
  TextButton,
  Text,
  TextBox,
  ImageButton,
  RoundedButton,
  Checkbox,
  CheckboxGroup,
  Label,
  ProgressBar,
  Slider,
  VolumeSlider,
  Image,
  Sprite,
  ScrollView,
  Grid,
} from "../ui/index";
import { BaseScene } from "../game";
import { BaseConfig } from "../types";

class UIComponentFactory {
  private static readonly componentMap: { [key: string]: any } = {
    Container,
    Image,
    TextButton,
    TextBox,
    ImageButton,
    RoundedButton,
    Checkbox,
    CheckboxGroup,
    Label,
    ProgressBar,
    Slider,
    VolumeSlider,
    Text,
    Sprite,
    ScrollView,
    Grid,
  };

  public static createChildFromConfig(
    scene: BaseScene,
    config: BaseConfig
  ): Container {
    const ComponentClass =
      this.componentMap[config.type ?? "Container"] || Container;
    return new ComponentClass(scene, config);
  }
}

export default UIComponentFactory;

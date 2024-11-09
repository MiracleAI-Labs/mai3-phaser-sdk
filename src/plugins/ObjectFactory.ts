import { GameObjects, Scene } from "phaser";
import { Label } from "../ui/Label";
import { Checkbox } from "../ui/Checkbox";
import { Slider } from "../ui/Slider";
import { VolumeSlider } from "../ui/VolumeSlider";
import { CheckboxGroup } from "../ui/CheckboxGroup";
import { Dialog } from "../ui/Dialog";
import { Image } from "../ui/Image";
import { Text } from "../ui/Text";
import { Container } from "../ui/Container";
import { RoundedButton } from "../ui/RoundedButton";
import { TextButton } from "../ui/TextButton";
import { ImageButton } from "../ui/ImageButton";
import { BaseConfig, ButtonConfig, CheckboxConfig, CheckboxGroupConfig, DialogConfig, ImageButtonConfig, ImageConfig, LabelConfig, LinearLayoutConfig, RoundedButtonConfig, SliderConfig, TabsConfig, TextBoxConfig, TextConfig, ToastConfig, ScrollViewConfig, VolumeSliderConfig, PanelConfig, GridConfig, SpriteConfig, ConnectWalletButtonConfig, ProgressBarConfig, ListViewConfig } from '../types';
import { BaseScene } from "../game";
import { TextBox } from "../ui/TextBox";
import { Tabs } from "../ui/Tabs";
import { TextArea } from "../ui/TextArea";
import { Toast } from "../ui/Toast";
import { LinearLayout } from "../ui/LinearLayout";
import { ScrollView } from "../ui/ScrollView";
import { Panel } from "../ui/Panel";
import { ProgressBar } from "../ui/ProgressBar";
import { Grid } from "../ui/Grid";
import { Sprite } from "../ui/Sprite";
import { DropdownMenu } from "../ui/DropdownMenu";
import { ConnectWalletButton } from "../ui/ConnectWalletButton";
import { DropdownMenuConfig } from "../ui/DropdownMenu";
import { ListView } from "../ui";

type Constructor<T extends Phaser.GameObjects.GameObject> = new (...args: any[]) => T;

class ObjectFactory {
  private scene: BaseScene;
  private displayList?: GameObjects.DisplayList;
  private updateList?: GameObjects.UpdateList;
  private addToScene: boolean;

  constructor(scene: BaseScene, addToScene: boolean) {
    this.scene = scene;
    this.displayList = scene.sys.displayList;
    this.updateList = scene.sys.updateList;
    this.addToScene = addToScene;

    scene.events.once('destroy', this.destroy, this);
  }

  destroy() {
    this.displayList = undefined;
    this.updateList = undefined;
  }

  createGameObject<T extends Phaser.GameObjects.GameObject, C extends BaseConfig>(ctor: Constructor<T>, scene: Scene, config: C): T {
    const gameObject = new ctor(scene, config);
    if (this.addToScene)
      this.scene.add.existing(gameObject);

    return gameObject;
  }

  container(config: BaseConfig): Container {
    return this.createGameObject(Container, this.scene, config);
  }

  imageButton(config: ImageButtonConfig): ImageButton {
    return this.createGameObject(ImageButton, this.scene, config);
  }

  roundedButton(config: RoundedButtonConfig): RoundedButton {
    return this.createGameObject(RoundedButton, this.scene, config);
  }

  textButton(config: ButtonConfig): TextButton {
    return this.createGameObject(TextButton, this.scene, config);
  }

  image(config: ImageConfig): Image {
    return this.createGameObject(Image, this.scene, config);
  }

  text(config: TextConfig): Text {
    return this.createGameObject(Text, this.scene, config);
  }

  panel(config: PanelConfig): Panel {
    return this.createGameObject(Panel, this.scene, config);
  }

  label(config: LabelConfig): Label {
    return this.createGameObject(Label, this.scene, config);
  }

  checkbox(config: CheckboxConfig): Checkbox {
    return this.createGameObject(Checkbox, this.scene, config);
  }

  checkboxGroup(config: CheckboxGroupConfig): CheckboxGroup {
    return this.createGameObject(CheckboxGroup, this.scene, config);
  }

  progressBar(config: ProgressBarConfig): ProgressBar {
    return this.createGameObject(ProgressBar, this.scene, config);
  }

  slider(config: SliderConfig): Slider {
    return this.createGameObject(Slider, this.scene, config);
  }

  volumeSlider(config: VolumeSliderConfig): VolumeSlider {
    return this.createGameObject(VolumeSlider, this.scene, config);
  }

  dialog(config: DialogConfig): Dialog {
    return this.createGameObject(Dialog, this.scene, config);
  }

  tabs(config: TabsConfig): Tabs {
    return this.createGameObject(Tabs, this.scene, config);
  }

  textBox(config: TextBoxConfig): TextBox {
    return this.createGameObject(TextBox, this.scene, config);
  }

  textArea(config: TextBoxConfig): TextArea {
    return this.createGameObject(TextArea, this.scene, config);
  }

  toast(config: ToastConfig): Toast {
    return this.createGameObject(Toast, this.scene, config);
  }

  grid(config: GridConfig): Grid {
    return this.createGameObject(Grid, this.scene, config);
  }

  // flexLayout(config: FlexLayoutConfig): FlexLayout {
  //   return this.createGameObject(FlexLayout, this.scene, config);
  // }

  linearLayout(config: LinearLayoutConfig): LinearLayout {
    return this.createGameObject(LinearLayout, this.scene, config);
  }

  listView(config: ListViewConfig): ListView {
    return this.createGameObject(ListView, this.scene, config);
  }

  scrollView(config: ScrollViewConfig): ScrollView {
    return this.createGameObject(ScrollView, this.scene, config);
  }

  sprite(config: SpriteConfig): Sprite {
    return this.createGameObject(Sprite, this.scene, config);
  }

  connectWalletButton(config: ConnectWalletButtonConfig): ConnectWalletButton {
    return this.createGameObject(ConnectWalletButton, this.scene, config);
  }

  dropdownMenu(config: DropdownMenuConfig): DropdownMenu {
    return this.createGameObject(DropdownMenu, this.scene, config);
  }
};
export default ObjectFactory;
//此脚本暂时没用了
import { Slider } from './Slider';
import { VolumeSliderConfig } from '../types';
import { Container } from './Container';
import { BaseScene } from "../game";

export class VolumeSlider extends Container {
  slider?: Slider;
  sliderLabel?: Phaser.GameObjects.Text;

  constructor(scene: BaseScene, config: VolumeSliderConfig) {
    super(scene, config);

    this.Type = 'VolumeSlider';
    this.draw(config);
  }

  protected draw(config: VolumeSliderConfig) {
    if (this.slider) {
      this.slider.destroy();
    }

    this.slider = new Slider(this.scene, config);
    this.slider.setPosition(0, 0);
    this.addChild(this.slider);

    this.sliderLabel = this.createLabel(config);
    this.addChild(this.sliderLabel);

    this.sliderLabel.setPosition(0, 0);
    this.slider.y = this.sliderLabel.displayHeight + this.slider.btnRadius / 2;
    this.setDepth(config.depth ?? 1);
  }

  public reDraw(config: VolumeSliderConfig) {
    this.draw(config);
  }

  protected createLabel(config: VolumeSliderConfig) {
    const content = config.text ?? "BGM Volume";
    const label = this.scene.make.text({});
    label.setText(content);
    label.setStyle({
      fontStyle: "Bold",
      fontSize: 32,
      color: '#fff',
    });

    return label;
  }
}

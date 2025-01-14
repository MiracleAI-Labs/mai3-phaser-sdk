import { BaseScene, ProgressBar, Utils } from "../../../dist";
import { ProgressBarConfig } from "../../../dist/types";
export class ProgressBarDemo extends BaseScene {
  config?: ProgressBarConfig;
  progressBar1?: ProgressBar;
  nextScene?: string

  constructor() {
    super("ProgressBarDemo");
  }

  async preload() {
    super.preload();
  }

  async create() {
    this.createReturnButton();

    const config1: ProgressBarConfig = {
      x: 50,
      y: 200,
      process: 0.5,
      width: 300,
      height: 30,
      barTexture: {
        key: "ProgressBg",
        width: 300,
        height: 30
      },
      fillTexture: {
        x: 2,
        y: 0,
        key: "ProgressFillBg",
        width: 300,
        height: 26
      }
    };

    this.progressBar1 = this.mai3.add.progressBar(config1);
    Utils.addTimer(this, 20, () => {
      if (this.progressBar1) {
        this.progressBar1.value = this.progressBar1.value < 1 ? this.progressBar1.value + 0.01 : 0.01;
        this.progressBar1.updateProgress(this.progressBar1.value);
      }
    });
  }

  private createReturnButton() {
    this.mai3.add.textButton({
      x: 10,
      y: 30,
      width: 150,
      height: 50,
      text: "Return",
      backgroundColor: 0x4CAF50,
      borderColor: 0x45A049,
      borderWidth: 2,
      radius: 10,
      textStyle: {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: '#FFFFFF',
      },
      handleUp: {
        handleFn: () => {
          this.scene.start('DemoScene');
        }
      },
    });
  }
}
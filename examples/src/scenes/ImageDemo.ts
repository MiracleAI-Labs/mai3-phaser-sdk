import { BaseScene } from "../../../dist";
export class ImageDemo extends BaseScene {
  constructor() {
    super('ImageDemo');
  }

  preload() {
    super.preload();
  }

  create() {
    this.createImages();
    this.createReturnButton();
    this.createDecorations();
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

  private createImages() {
    this.mai3.add.image({
      x: 500,
      y: 380,
      width: 200,
      height: 100,
      key: "cangshu",
      radius: 10,
      borderWidth: 2,
      borderColor: 0xFFD700,
      backgroundColor: 0x32CD32,
      enableSmoothScaleAnim: true,
    });

    this.mai3.add.image({
      x: 240,
      y: 350,
      width: 150,
      height: 100,
      key: "cangshu",
      isCircle: true,
      radius: 10,
      borderWidth: 2,
      borderColor: 0xFFD700,
      backgroundColor: 0x32CD32,
    });

    this.mai3.add.image({
      x: 240,
      y: 550,
      width: 150,
      height: 150,
      key: "avatar1",
    });

    this.mai3.add.image({
      x: 500,
      y: 550,
      isCircle: true,
      width: 150,
      height: 150,
      key: "avatar2",
    });

    this.mai3.add.image({
      x: 240,
      y: 740,
      width: 150,
      height: 150,
      key: "circle",
    });

    this.mai3.add.image({
      x: 500,
      y: 740,
      width: 150,
      height: 150,
      key: "rectangle",
      text: 'Text',
      textStyle: {
        fontFamily: "Arial",
        fontSize: "30px",
        color: "#FFFFFF",
      },
    });

    this.mai3.add.image({
      x: 270,
      y: 920,
      width: 52,
      height: 64,
      key: "startIcon",
    });

    this.mai3.add.image({
      x: 360,
      y: 920,
      width: 39,
      height: 55,
      key: "pauseIcon",
    });
  }

  private createDecorations() {
    let y = 450;
    for (let i = 1; i < 7; i++) {
      y += 80;
      this.mai3.add.image({
        x: 740,
        y: y,
        width: 113,
        height: 57,
        key: "decoration" + i,
      });
    }
  }

  update() { }
}
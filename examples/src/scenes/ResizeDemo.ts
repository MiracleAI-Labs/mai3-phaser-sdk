import { BaseScene } from "../../../dist";
export class ResizeDemo extends BaseScene {

  constructor() {
    super('ResizeDemo');
  }

  preload() {
    super.preload();
  }

  create() {
    this.createComponents();
    this.createReturnButton();
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

  private createComponents() {
    const button1 = this.mai3.add.textButton({
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      text: "button1",
      textStyle: { fontFamily: 'Arial', fontSize: '24px', color: '#FFFFFF' },
      backgroundColor: 0x4CAF50,
      borderColor: 0x45A049,
      borderWidth: 2,
      radius: 10,
      handleDown: {
        handleFn: () => {
          this.switchDragResizeComponent(button1);
        }
      }
    });

    const button2 = this.mai3.add.textButton({
      x: 100,
      y: 170,
      width: 200,
      height: 50,
      text: "button2",
      textStyle: { fontFamily: 'Arial', fontSize: '24px', color: '#FFFFFF' },
      backgroundColor: 0x2196F3,
      borderColor: 0x1E88E5,
      borderWidth: 2,
      radius: 10,
      handleDown: {
        handleFn: () => {
          this.switchDragResizeComponent(button2);
        }
      }
    });

    const button3 = this.mai3.add.roundedButton({
      x: 100,
      y: 240,
      radius: 30,
      texture: "cangshu",
      borderWidth: 6,
      borderColor: 0xFFD700,
      backgroundColor: 0x32CD32,
      columnSpan: 4,
      handleHover: {
        audio: "sfx-hover"
      },
      handleDown: {
        audio: "sfx-press",
        handleFn: () => {
          this.switchDragResizeComponent(button3);
        }
      }
    });

    this.addDragResizeComponents([button1, button2, button3]);
  }
}

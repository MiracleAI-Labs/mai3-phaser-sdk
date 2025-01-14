import { loadTonConfig } from "@/config";
import { BaseScene } from "../../../dist";
import { Wallet } from "../../../dist/game";
export class ButtonDemo extends BaseScene {
  constructor() {
    super("ButtonDemo");
  }

  preload() {
    super.preload();
    this.load.atlas(
      "buttons",
      "https://labs.phaser.io/assets/ui/nine-slice.png",
      "https://labs.phaser.io/assets/ui/nine-slice.json"
    );
  }

  create() {
    this.createButtons();
  }

  private createButtons() {
    this.createReturnButton();
    this.createImgBtn();
    this.createRoundedBtn();
    this.createTextBtn();
    // this.createConnectWalletBtn();
  }

  private createImgBtn() {
    this.mai3.add.imageButton({
      x: 20,
      y: 160,
      width: 223,
      height: 60,
      texture: "imgBtn",
      draggable: true,
      handleHover: {
        audio: "sfx-hover",
        texture: "playBtn",
        handleFn: () => {
          console.log("handleHover");
        },
      },
      handleOut: {
        texture: "playBtn",
        handleFn: () => {
          console.log("handleOut");
        },
      },
      handleDown: {
        audio: "sfx-press",
        texture: "playBtn",
        handleFn: () => {
          console.log("handleDown");
          this.mai3.add.toast({
            width: 300,
            height: 60,
            text: 'Rectangular custom image button',
            duration: 3000,
            type: 'info',
            animationType: 'slide',
            margin: { all: 10 },
          }).show()
        },
      },
      handleUp: {
        texture: "playBtn",
        handleFn: () => {
          console.log("handleUp");
        },
      },
    });

    this.mai3.add.imageButton({
      x: 300,
      y: 160,
      width: 192,
      height: 48,
      texture: "StartGameButton",
      draggable: true,
      handleHover: {
        audio: "sfx-hover",
        texture: "playBtn",
        handleFn: () => {
          console.log("handleHover");
        },
      },
      handleDown: {
        audio: "sfx-press",
        texture: "playBtn",
        handleFn: () => {
          console.log("handleDown");
          this.mai3.add.toast({
            width: 300,
            height: 60,
            text: 'Rectangular custom image button',
            duration: 3000,
            type: 'info',
            animationType: 'slide',
            margin: { all: 10 },
          }).show()
        },
      }
    });

    this.mai3.add.imageButton({
      x: 540,
      y: 160,
      width: 50,
      height: 50,
      texture: "unChecked",
      draggable: true,
      handleHover: {
        audio: "sfx-hover",
        texture: "playBtn",
        handleFn: () => {
          console.log("handleHover");
        },
      },
      handleDown: {
        audio: "sfx-press",
        texture: "playBtn",
        handleFn: () => {
          console.log("handleDown");
          this.mai3.add.toast({
            width: 300,
            height: 60,
            text: 'Rectangular custom image button',
            duration: 3000,
            type: 'info',
            animationType: 'slide',
            margin: { all: 10 },
          }).show()
        },
      }
    });
  }

  private createRoundedBtn() {
    const btn = this.mai3.add.roundedButton({
      x: 20,
      y: 260,
      radius: 50,
      text: 'Round',
      fontColor: "#fff",
      fontSize: 20,
      frame: 0,
      backgroundAlpha: 1,
      borderColor: 0x900c3f,
      borderWidth: 3,
      backgroundColor: 0xc70039,
      handleHover: {
        audio: "sfx-hover",
      },
      handleDown: {
        audio: "sfx-press",
        handleFn: () => {
          this.mai3.add.toast({
            width: 300,
            height: 60,
            text: 'Round button without image - Text can be customized',
            duration: 3000,
            type: 'info',
            animationType: 'slide',
            margin: { all: 10 },
          }).show()

          console.log(btn.config)
          btn.config.text = 'hhh'
        },
      },
      draggable: true,
    });

    this.mai3.add.roundedButton({
      x: 160,
      y: 260,
      radius: 53,
      texture: "playButton",
      frame: 0,
      draggable: false,
      backgroundAlpha: 1,
      geomType: "Circle",
      backgroundColor: 0x32cd32,
      handleHover: {
        audio: "sfx-hover",
      },
      handleDown: {
        audio: "sfx-press",
        handleFn: () => {
          this.mai3.add.toast({
            width: 300,
            height: 60,
            text: 'Round custom image button',
            duration: 3000,
            type: 'info',
            animationType: 'slide',
            margin: { all: 10 },
          }).show()
        },
      },
    });
  }

  private createTextBtn() {
    const btn = this.mai3.add.textButton({
      x: 480,
      y: 420,
      width: 400,
      height: 80,
      borderColor: 0x900c3f,
      borderWidth: 3,
      backgroundColor: 0xc70039,
      text: "Mai3 (Draggable and changeable)",
      radius: 20,
      textStyle: {
        fontFamily: "Arial",
        fontSize: "24px",
        color: "#000",
      },
      handleHover: {
        audio: "sfx-hover",
      },
      handleDown: {
        audio: "sfx-press",
        handleFn: () => {
          btn.text = "Hello, I've been dragged";
        },
      },
      handleUp: {
        handleFn: () => {
          btn.text = "Mai3 (Draggable and changeable)"
        },
      },
      draggable: true,
    });

    for (let i = 1; i <= 3; i++) {
      let radius;

      switch (i) {
        case 1:
          radius = 0;
          break;
        case 2:
          radius = 20;
          break;
        case 3:
          radius = 100;
          break;
        default:
          radius = 0;
      }

      this.mai3.add.textButton({
        x: 20,
        y: 300 + 80 * i + 40 * i,
        width: 400,
        height: 80,
        borderColor: 0x900c3f,
        borderWidth: 3,
        backgroundColor: 0xc70039,
        text: "Custom text rounded button",
        radius,
        textStyle: {
          fontFamily: "Arial",
          fontSize: "24px",
          color: "#FFFFFF",
        },
        draggable: true,
        handleHover: {
          audio: "sfx-hover",
        },
        handleDown: {
          audio: "sfx-press",
          handleFn: () => {
            this.mai3.add.toast({
              width: 300,
              height: 60,
              text: 'Custom text rounded button',
              duration: 3000,
              type: 'info',
              animationType: 'slide',
              margin: { all: 10 },
            }).show()
          },
        },
      });
    }
  }

  private async createConnectWalletBtn() {
    const config = await loadTonConfig();
    this.mai3.add.connectWalletButton({
      x: 20,
      y: 780,
      width: 153,
      height: 67,
      texture: "startButton",
      language: "en",
      walletApp: "telegram-wallet",
      manifestUrl: config.APP_MANIFEST_URL,
      appUrl: config.APP_URL,
      onWalletChange: (wallet: Wallet | null) => {
        console.log("wallet address: ", wallet?.account.address);
      },
      handleUp: {
        handleFn: () => {
          console.log("handleUp");
        },
      },
      handleDown: {
        handleFn: () => {
          console.log("handleDown");
        },
      },
    })
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

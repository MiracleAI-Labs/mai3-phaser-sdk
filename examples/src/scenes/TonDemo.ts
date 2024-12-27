// import { loadConfig } from "@/config";
import { BaseScene, Label } from "../../../dist";
import { GameFi, Wallet } from "../../../dist/game";
import { loadTonConfig } from "@/config";
import { LabelConfig } from "../../../dist/types";
export class TonDemo extends BaseScene {
  label?: Label;

  constructor() {
    super("TonDemo");
  }

  preload() {
    super.preload();
  }

  create() {
    this.createButtons();
    this.createLabel();
  }

  private createButtons() {
    this.createReturnButton();
    this.createGameFiAndConnectWalletBtn();
    this.createConnectWalletBtn();
  }

  async createGameFiAndConnectWalletBtn() {
    const config = await loadTonConfig();
    const gameFi = await GameFi.create(this, config);
    gameFi.createConnectButton(this,
      {
        x: 200,
        y: 180,
        width: 200,
        height: 70,
        texture: "startButton",
        language: "en",
        walletApp: "telegram-wallet",
        onWalletChange: (wallet: Wallet | null) => {
          console.log("shortAddress: ", gameFi.getShortAddress());
          console.log("fullAddress: ", gameFi.getFullAddress());
          if (wallet) {
            this.label!.Text = `wallet: ${gameFi.getShortAddress() ?? ''}`;
          }
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
      });
  }

  private async createConnectWalletBtn() {
    const config = await loadTonConfig();
    const btn = this.mai3.add.connectWalletButton({
      x: 200,
      y: 300,
      width: 200,
      height: 70,
      tonProof: "Hello, this is a message to be signed!",
      texture: "imgBtn",
      language: "en",
      walletApp: "telegram-wallet",
      appUrl: config.APP_URL,
      manifestUrl: config.APP_MANIFEST_URL,
      onWalletChange: (wallet: Wallet | null) => {
        console.log("shortAddress: ", btn.getShortAddress());
        console.log("fullAddress: ", btn.getFullAddress());
        if (wallet) {
          this.label!.Text = `wallet: ${btn.getShortAddress() ?? ''}`;
          console.log("tonProof: ", btn.getWalletTonProof(wallet));
        }
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

  private createLabel() {
    // const text = `Phaser is a fast free, and fun open source HTML5 game framework`;
    const labelCfg: LabelConfig = {
      x: 600, y: 10,
      width: 280,
      autoHeight: true,
      text: 'Connect Wallet',
      borderWidth: 4,
      radius: 20,
      borderColor: 0xFFD700,
      backgroundColor: 0xcf4b00,
      backgroundAlpha: 1,
      textAlign: "center",
      textStyle: {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#fff',
      },
      isWordWrap: true,
      padding: { left: 20, right: 20, top: 10, bottom: 10 },
    };

    this.label = this.mai3.add.label(labelCfg);
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

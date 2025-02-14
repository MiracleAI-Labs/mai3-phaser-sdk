// import { loadConfig } from "@/config";
import { BaseScene, Label } from "../../../dist";
import { LabelConfig } from "../../../dist/types";
export class SOLDemo extends BaseScene {
  label?: Label;

  constructor() {
    super("SOLDemo");
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
    this.createConnectSOLWalletBtn();
  }

  private async createConnectSOLWalletBtn() {
    const btn = this.mai3.add.connectSOLWalletButton({
      x: 200,
      y: 300,
      width: 200,
      height: 70,
      texture: "wallet_btn",
      network: "devnet",
      name: "Mai3",
      description: "Mai3 Example",
      url: "https://example.com",
      icon: "https://avatars.githubusercontent.com/u/179229932",
      projectId: "14Q85T7sHKqY8q6JQocbrqiV7yVSqT4aSyHYCxXrzKA",
      onWalletChange: (wallet: unknown, address?: string) => {
        console.log("shortAddress: ", btn.getShortAddress());
        console.log("fullAddress: ", btn.getFullAddress());
        if (wallet) {
          this.label!.Text = `wallet: ${btn.getShortAddress() ?? ""}`;
        } else {
          this.label!.Text = "Show Wallet Address";
        }
      },
      onSigned: (signMessage: string, signature: string, address?: string) => {
        console.log("signMessage: ", signMessage);
        console.log("signature: ", signature);
        console.log("address: ", address);
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

  private createLabel() {
    // const text = `Phaser is a fast free, and fun open source HTML5 game framework`;
    const labelCfg: LabelConfig = {
      x: 600,
      y: 10,
      width: 280,
      autoHeight: true,
      text: "Show Wallet Address",
      borderWidth: 4,
      radius: 20,
      borderColor: 0xffd700,
      backgroundColor: 0xcf4b00,
      backgroundAlpha: 1,
      textAlign: "center",
      textStyle: {
        fontFamily: "Arial",
        fontSize: "24px",
        color: "#fff",
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
      backgroundColor: 0x4caf50,
      borderColor: 0x45a049,
      borderWidth: 2,
      radius: 10,
      textStyle: {
        fontFamily: "Arial",
        fontSize: "18px",
        color: "#FFFFFF",
      },
      handleUp: {
        handleFn: () => {
          this.scene.start("DemoScene");
        },
      },
    });
  }
}

import { ConnectSOLWalletButtonConfig } from "../types";
import Utils from "../utils";
import { BaseScene } from "../game";
import { BaseButton } from "./BaseButton";
import { ImageButton } from "./ImageButton";

import { SOLConnector } from "../game/SOLConnetor";
import { IProvider } from "@web3auth/base";

export class ConnectSOLWalletButton extends BaseButton<ConnectSOLWalletButtonConfig> {
  wallet: IProvider | null = null;
  private button?: ImageButton;
  protected _config: ConnectSOLWalletButtonConfig;

  constructor(scene: BaseScene, config: ConnectSOLWalletButtonConfig) {
    super(scene, config, "ConnectSOLWalletButton");
    this._config = config;
    this.reDraw(config);
  }

  public reDraw(config: ConnectSOLWalletButtonConfig): void {
    this._config = config;
    SOLConnector.init(
      config,
      async (wallet: IProvider | null) => {
        if (wallet) {
          const address = (await SOLConnector.getAccountAddress()) ?? "";
          let shortAddress =
            address.substring(0, 4) +
            "..." +
            address.substring(address.length - 4);
          let fullAddress = address;
          this.setData("shortAddress", shortAddress);
          this.setData("fullAddress", fullAddress);
        } else {
          this.setData("shortAddress", "");
          this.setData("fullAddress", "");
        }
        this._config.onWalletChange?.(wallet);
      },
      (signMessage: string, signature: ArrayBuffer) => {
        this._config.onSigned?.(signMessage, signature);
      }
    );

    this.reDrawButton();

    this.RefreshBounds();
    this.initializeEvents();
    this.updateConfig(this._config);
    this.setDepth(this._config.depth ?? 1);
    this.setScrollFactor(this._config.isScrollFactor ? 0 : 1);
  }

  private reDrawButton(): void {
    if (this.button) {
      this.button.destroy(true);
      this.button = undefined;
    }

    const { width = 0, height = 0, texture = "" } = this._config;
    this.button = new ImageButton(this.scene, {
      x: 0,
      y: 0,
      width,
      height,
      texture,
    });
    this.button.disableInteractive();
    this.add(this.button);
  }

  protected handleUp(): void {
    super.handleUp();
    this.connectWallet();
  }

  protected handleDown(): void {
    super.handleDown();
    this.scene.game.canvas.style.cursor = "pointer";
  }

  protected handleOut(): void {
    super.handleOut();
    this.scene.game.canvas.style.cursor = "default";
  }

  protected handleOver(): void {
    super.handleOver();
    this.scene.game.canvas.style.cursor = "pointer";
  }

  connectWallet = async () => {
    try {
      await SOLConnector.openModal();
    } catch (err) {
      //
    }
  };

  disconnectWallet = async () => {
    try {
      await SOLConnector.disconnect();
    } catch (error: any) {
      console.log("disconnect error", error);
    }
  };

  public getShortAddress(): string {
    return this.getData("shortAddress") as string;
  }

  public getFullAddress() {
    return this.getData("fullAddress") as string;
  }

  public destroy(fromScene?: boolean): void {
    if (this.button) {
      this.button.destroy(true);
      this.button = undefined;
    }
    super.destroy(fromScene);
  }
}

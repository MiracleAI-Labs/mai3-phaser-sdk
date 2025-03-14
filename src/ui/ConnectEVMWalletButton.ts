import { ConnectEVMWalletButtonConfig } from "../types";
import { BaseScene } from "../game";
import { BaseButton } from "./BaseButton";
import { ImageButton } from "./ImageButton";

import { EVMConnector } from "../game/EVMConnetor";

export class ConnectEVMWalletButton extends BaseButton<ConnectEVMWalletButtonConfig> {
  private button?: ImageButton;
  protected _config: ConnectEVMWalletButtonConfig;

  constructor(scene: BaseScene, config: ConnectEVMWalletButtonConfig) {
    super(scene, config, "ConnectEVMWalletButton");
    this._config = config;
    this.reDraw(config);
  }

  public reDraw(config: ConnectEVMWalletButtonConfig): void {
    this._config = config;
    if (config.mock) {
      //
    } else {
      EVMConnector.init(
        config,
        (wallet: unknown, address?: string) => {
          if (address && address.length > 0) {
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
          this._config.onWalletChange?.(wallet, this.getFullAddress());
        },
        (signMessage: string, signature: string) => {
          this._config.onSigned?.(
            signMessage,
            signature,
            this.getFullAddress()
          );
        }
      );
    }

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
    if (this.config.mock) {
      const address = localStorage.getItem("userAddress") ?? "";
      this.setData("fullAddress", address);
      this.setData(
        "shortAddress",
        address && address.length > 0
          ? address.substring(0, 4) +
              "..." +
              address.substring(address.length - 4)
          : ""
      );
      this._config.onWalletChange?.(null, this.getFullAddress());
      return;
    }
    try {
      await EVMConnector.openModal();
    } catch (err) {
      //
    }
  };

  disconnectWallet = async () => {
    try {
      await EVMConnector.disconnect();
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

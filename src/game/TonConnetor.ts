import { TonConnectUI } from "@tonconnect/ui";
import { TonConfig } from "./TonConfig";
import { WalletConnectorParams } from "../common/interfaces";

export class TonConnector {
  private static config: WalletConnectorParams;
  public static connector: TonConnectUI;

  public static async init(config: WalletConnectorParams) : Promise<TonConnectUI> {
    this.config = config;
    return this.getInstance();
  }

  public static async getInstance(): Promise<TonConnectUI> {
    if (!this.config) {
      throw new Error("TonConfig is not initialized");
    }

    if (!this.connector) {
      this.connector = new TonConnectUI({
        manifestUrl: this.config.manifestUrl,
        actionsConfiguration: this.config.actionsConfiguration
      });
    }

    return this.connector;
  }

  public static async openModal() {
    const tonConnect = await this.getInstance();
    await tonConnect.openModal()
  }
  
  public static async closeModal() {
    const tonConnect = await this.getInstance();
    await tonConnect.closeModal()
  }

  public static async disconnect() {
    const tonConnect = await this.getInstance();
    await tonConnect.disconnect();
  }

  public static async getWallets() {
    const tonConnect = await this.getInstance();
    return tonConnect.getWallets();
  }

  public static async getAccount() {
    const tonConnect = await this.getInstance();
    return tonConnect.account;
  }

  public static async getAccountAddress() {
    const tonConnect = await this.getInstance();
    return tonConnect.account?.address;
  }

  public static async refreshPayload(tonProof?: string) {
    TonConnector.connector.setConnectRequestParameters({
      state: "loading",
    });
    const value = { tonProof };
    if (!value) {
      TonConnector.connector.setConnectRequestParameters(null);
    } else {
      TonConnector.connector.setConnectRequestParameters({
        state: "ready",
        value,
      });
    }
  }
}

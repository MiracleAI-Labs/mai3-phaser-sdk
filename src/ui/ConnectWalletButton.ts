import { ConnectWalletButtonConfig, HandleError, Locale, Wallet, WalletApp } from '../types';
import {
  locales,
} from '../common/consts';
import Utils from '../utils';
import { BaseScene, WalletConnectorParams } from "../game";
import { BaseButton } from './BaseButton';
import { ImageButton } from './ImageButton';
import { TonConnector } from '../game/TonConnetor';
import { TonProofItemReplySuccess } from '@tonconnect/ui';

export class ConnectWalletButton extends BaseButton<ConnectWalletButtonConfig> {
  wallet: Wallet | null = null;
  connectionSourceName?: WalletApp;
  unsubscribeFromConnector?: () => void;
  locale?: Locale;
  private button?: ImageButton;
  private onError?: HandleError;
  protected _config: ConnectWalletButtonConfig;

  constructor(scene: BaseScene, config: ConnectWalletButtonConfig) {
    super(scene, config, 'ConnectWalletButton');
    this._config = config;

    this.reDraw(config);

  }

  public reDraw(config: ConnectWalletButtonConfig): void {
    this._config = config;

    this.initWallet();
    this.reDrawButton();

    this.RefreshBounds();
    this.initializeEvents();
    this.updateConfig(this._config);
    this.setDepth(this._config.depth ?? 1);
    this.setScrollFactor(this._config.isScrollFactor ? 0 : 1);
  }

  private initWallet() {
    if (!this._config.manifestUrl) {
      throw new Error('manifestUrl is required');
    }

    if (!this._config.appUrl) {
      throw new Error('appUrl is required');
    }

    const connectorParams: WalletConnectorParams = {
      manifestUrl: this._config.manifestUrl,
      actionsConfiguration: {
        twaReturnUrl: this._config.appUrl
      }
    };

    this.connectionSourceName = this._config.walletApp || 'telegram-wallet';
    TonConnector.init(connectorParams).then(() => {
      this._unsubscribeFromConnector();
    });

    this.onError = this._config.onError
      ? this._config.onError
      : (error) => {
        throw error;
      };

    const locale = locales[this._config.language ?? 'en'];
    this.locale = locale;

  }

  private reDrawButton(): void {
    if (this.button) {
      this.button.destroy(true);
      this.button = undefined;
    }

    const { width = 0, height = 0, texture = '' } = this._config;
    this.button = new ImageButton(this.scene, { x: 0, y: 0, width, height, texture });
    this.button.disableInteractive();
    this.add(this.button);
  }

  private _unsubscribeFromConnector() {
    const walletChanged = (wallet: Wallet | null) => {
      this.wallet = wallet;
      if (wallet) {
        let shortAddress = Utils.rawAddressToFriendly(wallet.account.address, true);
        let fullAddress = Utils.rawAddressToFriendly(wallet.account.address, false);

        this.setData("shortAddress", shortAddress);
        this.setData("fullAddress", fullAddress);
      }

      if (this._config.onWalletChange) {
        this._config.onWalletChange(wallet);
      }
    };

    this.unsubscribeFromConnector = TonConnector.connector.onStatusChange(walletChanged);
    TonConnector.connector.connectionRestored.then((connected: boolean) => {
      if (!connected) {
        walletChanged(null);
      }
    });
  }

  protected handleUp(): void {
    super.handleUp();
    this.connectWallet();
  }

  protected handleDown(): void {
    super.handleDown();
    this.scene.game.canvas.style.cursor = 'pointer';
  }

  protected handleOut(): void {
    super.handleOut();
    this.scene.game.canvas.style.cursor = 'default';
  }

  protected handleOver(): void {
    super.handleOver();
    this.scene.game.canvas.style.cursor = 'pointer';
  }

  connectWallet = async () => {
    try {
      if (TonConnector.connector?.connected) {
        await this.disconnectWallet();
      }
      TonConnector.refreshPayload(this._config?.tonProof);
      await TonConnector.connector?.openModal();
    } catch (error: any) {
      console.log("connectWallet error", error);
      this.onError?.(error);
    } finally {

    }
  }

  disconnectWallet = async () => {
    try {
      await TonConnector.connector?.disconnect();
    } catch (error: any) {
      console.log("disconnect error", error);
      this.onError?.(error);
    } finally {

    }
  }

  public getShortAddress(): string {
    return this.getData("shortAddress") as string;
  }

  public getFullAddress() {
    return this.getData("fullAddress") as string;
  }

  public getWalletTonProof(wallet: Wallet): any {
    if (
      wallet?.connectItems?.tonProof &&
      "proof" in wallet?.connectItems?.tonProof
    ) {
      return {
        address: wallet?.account.address,
        network: wallet?.account.chain,
        public_key: wallet?.account.publicKey,
        proof: {
          ...((wallet?.connectItems?.tonProof as TonProofItemReplySuccess)
            ?.proof ?? {}),
          state_init: wallet?.account.walletStateInit ?? "",
        },
      };
    }
    return null;
  }

  public destroy(fromScene?: boolean): void {
    if (this.button) {
      this.button.destroy(true);
      this.button = undefined;
    }
    super.destroy(fromScene);
  }
}
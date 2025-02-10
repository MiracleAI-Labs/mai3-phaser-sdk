import { ConnectSOLWalletButtonConfig } from "../types";
import { IProvider, WALLET_ADAPTERS } from "@web3auth/base";
import { Web3Auth, Web3AuthOptions } from "@web3auth/modal";
import { getDefaultExternalAdapters } from "@web3auth/default-solana-adapter";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import RPC from "../common/solana-rpc";

export class SOLConnector {
  private static config: ConnectSOLWalletButtonConfig;
  public static connector: Web3Auth;
  private static provider: IProvider | null;
  private static walletChanged: (wallet: IProvider | null) => void;
  private static onSigned?: (
    signMessage: string,
    signature: ArrayBuffer
  ) => void;
  public static async init(
    config: ConnectSOLWalletButtonConfig,
    walletChanged: (wallet: IProvider | null) => void,
    onSigned?: (signMessage: string, signature: ArrayBuffer) => void
  ): Promise<SOLConnector> {
    this.config = config;
    this.walletChanged = walletChanged;
    this.onSigned = onSigned;
    return this.getInstance();
  }

  public static async getInstance(): Promise<SOLConnector> {
    if (!this.config) {
      throw new Error("Config is not initialized");
    }
    const chainConfig = {
      chainId: this.config.network === "sapphire_devnet" ? "0x2" : "0x1",
      chainNamespace: "solana" as const,
      rpcTarget:
        this.config.network === "sapphire_devnet"
          ? "https://api.devnet.solana.com"
          : "https://api.mainnet-beta.solana.com",
      tickerName: "SOLANA",
      ticker: "SOL",
      decimals: 9,
      blockExplorerUrl:
        this.config.network === "sapphire_devnet"
          ? "https://explorer.solana.com/?cluster=devnet"
          : "https://explorer.solana.com/?cluster=mainnet",
      logo: "https://images.toruswallet.io/sol.svg",
    };
    const privateKeyProvider = new SolanaPrivateKeyProvider({
      config: { chainConfig },
    });
    if (!this.connector) {
      this.connector = new Web3Auth({
        clientId: this.config.clientId ?? "",
        chainConfig,
        web3AuthNetwork: this.config.network ?? "sapphire_devnet",
        privateKeyProvider,
        uiConfig: {
          mode: "dark",
        },
      });
      const web3AuthOptions: Web3AuthOptions = {
        clientId: this.config.clientId ?? "",
        chainConfig,
        web3AuthNetwork: this.config.network ?? "sapphire_devnet",
        privateKeyProvider,
      };
      const adapters = await getDefaultExternalAdapters({
        options: web3AuthOptions,
      });
      adapters.forEach((adapter) => {
        if (adapter.name !== "wallet-connect-v2") {
          this.connector.configureAdapter(adapter);
        }
      });
      await this.connector.initModal({
        modalConfig: {
          [WALLET_ADAPTERS.AUTH]: {
            loginMethods: {},
            label: "auth",
            showOnModal: false,
          },
        },
      });
    }
    await this.disconnect();
    return this.connector;
  }

  public static async openModal() {
    if (this.provider && this.connector.connected) {
      return;
    }
    try {
      this.provider = await this.connector.connect();
      const signature = await this.signMessage(
        this.config.signMessage ?? "Sign in with Solana"
      );
      this.onSigned?.(
        this.config.signMessage ?? "Sign in with Solana",
        signature
      );
      this.connector.loginModal.closeModal();
      this.walletChanged?.(this.provider);
    } catch (err) {
      console.error("Connection failed:", err);
    }
  }

  public static async disconnect() {
    try {
      if (this.connector.connected) {
        await this.connector.logout();
        this.provider = null;
        this.walletChanged?.(null);
      }
    } catch (err) {
      //
    }
  }

  public static async getAccountAddress() {
    if (!this.provider) {
      return null;
    }
    const rpc = new RPC(this.provider);
    const address = await rpc.getAccounts();
    return address && address[0];
  }

  public static async signMessage(str: string) {
    try {
      if (!this.provider) {
        throw new Error("Provider not initialized");
      }
      const rpc = new RPC(this.provider);
      const signedMessage = await rpc.signMessage(str);
      if (!signedMessage) {
        throw new Error("Failed to sign message");
      }
      return signedMessage;
    } catch (err) {
      throw err;
    }
  }
}

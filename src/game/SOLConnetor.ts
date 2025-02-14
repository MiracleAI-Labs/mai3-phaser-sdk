import { ConnectSOLWalletButtonConfig } from "../types";
import { AppKit, createAppKit, UseAppKitAccountReturn } from "@reown/appkit";
import { SolanaAdapter } from "@reown/appkit-adapter-solana";
import { solana, solanaDevnet } from "@reown/appkit/networks";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

export class SOLConnector {
  private static config: ConnectSOLWalletButtonConfig;
  private static solanaWeb3JsAdapter = new SolanaAdapter({
    wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
  });
  public static connector: AppKit;
  private static walletChanged?: (wallet: unknown, address?: string) => void;
  private static onSigned?: (
    signMessage: string,
    signature: string,
    address?: string
  ) => void;

  public static async init(
    config: ConnectSOLWalletButtonConfig,
    walletChanged?: (wallet: unknown, address?: string) => void,
    onSigned?: (
      signMessage: string,
      signature: string,
      address?: string
    ) => void
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

    this.connector = await createAppKit({
      adapters: [this.solanaWeb3JsAdapter],
      networks: this.config.network === "devnet" ? [solanaDevnet] : [solana],
      metadata: {
        name: this.config.name ?? "Mai3",
        description: this.config.description ?? "Mai3 Example",
        url: this.config.url ?? "https://example.com",
        icons: [
          this.config.icon ??
            "https://avatars.githubusercontent.com/u/179229932",
        ],
      },
      projectId: this.config.projectId ?? "",
      defaultNetwork: this.config.network === "devnet" ? solanaDevnet : solana,
      features: {
        analytics: false,
        email: false,
        socials: [],
      },
    });
    try {
      await this.connector.disconnect();
    } catch (err) {
      console.log(err);
    }
    return this.connector;
  }

  public static async openModal() {
    const sign = async () => {
      const signature = await this.signMessage(
        this.config.signMessage ?? "Sign in with Solana"
      );
      if (signature) {
        this.onSigned?.(
          this.config.signMessage ?? "Sign in with Solana",
          signature ?? "",
          this.getAccountAddress()
        );
      }
    };
    try {
      await this.disconnect();
    } catch (err) {
      console.log(err);
    }
    try {
      await this.connector.open();
      this.connector.subscribeAccount(
        async (account: UseAppKitAccountReturn) => {
          try {
            if (account.isConnected) {
              this.walletChanged?.(
                this.connector.getWalletProvider(),
                this.getAccountAddress()
              );
              await sign();
            }
          } catch (err) {
            console.log(err);
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  public static async disconnect() {
    try {
      await this.connector.disconnect();
      this.walletChanged?.(null, undefined);
    } catch (err) {
      console.log(err);
    }
  }

  public static getAccountAddress() {
    if (!this.connector) {
      return undefined;
    }
    return this.connector.getAddress();
  }

  private static isSigning: boolean = false;
  public static async signMessage(str: string) {
    if (this.isSigning) return;
    this.isSigning = true;
    try {
      if (!this.connector) {
        throw new Error("Provider not initialized");
      }
      const encodedMessage = new TextEncoder().encode(str);
      const signature = await (
        this.connector.getWalletProvider() as any
      ).signMessage(encodedMessage);
      const signedMessage = btoa(String.fromCharCode(...signature));
      if (!signedMessage) {
        throw new Error("Failed to sign message");
      }
      this.isSigning = false;
      return signedMessage;
    } catch (err) {
      this.isSigning = false;
      throw err;
    }
  }
}

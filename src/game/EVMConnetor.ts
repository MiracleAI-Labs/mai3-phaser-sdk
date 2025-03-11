import { ConnectEVMWalletButtonConfig } from "../types";
import { AppKit, createAppKit, UseAppKitAccountReturn } from "@reown/appkit";
import * as networks from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import {
  signMessage as wagmiSignMessage,
  writeContract,
  readContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import VaultABI from "./abi/Vault.json";
import TokenABI from "./abi/Token.json";
import { parseUnits } from "viem";

export class EVMConnector {
  private static config: ConnectEVMWalletButtonConfig;
  public static wagmiAdapter: WagmiAdapter;
  public static connector: AppKit;
  private static walletChanged?: (wallet: unknown, address?: string) => void;
  private static onSigned?: (
    signMessage: string,
    signature: string,
    address?: string
  ) => void;

  public static async init(
    config: ConnectEVMWalletButtonConfig,
    walletChanged?: (wallet: unknown, address?: string) => void,
    onSigned?: (
      signMessage: string,
      signature: string,
      address?: string
    ) => void
  ): Promise<EVMConnector> {
    this.config = config;
    this.walletChanged = walletChanged;
    this.onSigned = onSigned;
    return await this.getInstance();
  }

  public static async getInstance(): Promise<EVMConnector> {
    if (!this.config) {
      throw new Error("Config is not initialized");
    }
    this.wagmiAdapter = new WagmiAdapter({
      projectId: this.config.projectId ?? "",
      networks: [(networks as any)[this.config.network ?? ""]],
    });

    this.connector = await createAppKit({
      adapters: [this.wagmiAdapter],
      networks: [(networks as any)[this.config.network ?? ""]],
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
      defaultNetwork: (networks as any)[this.config.network ?? ""],
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
      const result = await this.signMessage(
        this.config.signMessage ?? "Sign in with EVM"
      );
      if (result) {
        this.onSigned?.(
          result.signMessage ?? "Sign in with EVM",
          result.signature ?? "",
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
            this.isSigning = false;
            console.log(err);
          }
        }
      );
    } catch (err) {
      this.isSigning = false;
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
      const signature = await wagmiSignMessage(this.wagmiAdapter.wagmiConfig, {
        message: str,
      });
      return {
        signMessage: str,
        signature,
      };
    } catch (err) {
      this.isSigning = false;
      throw err;
    }
  }

  public static async deposit(contractAddress: string, amount: number) {
    if (!this.connector) {
      throw new Error("Provider not initialized");
    }
    try {
      const config = this.wagmiAdapter.wagmiConfig;
      const tokenAddress = await this.getToken(contractAddress);
      await this.approveToken(
        tokenAddress as `0x$string`,
        contractAddress,
        amount
      );
      const decimals = await this.getTokenDecimals(
        tokenAddress as `0x${string}`
      );
      const amountWei = parseUnits(amount.toString(), decimals as number);
      const depositResult = await writeContract(config, {
        address: contractAddress as `0x${string}`,
        abi: VaultABI,
        functionName: "deposit",
        args: [amountWei],
      });
      return depositResult;
    } catch (error) {
      console.error("Deposit failed:", error);
      throw error;
    }
  }

  public static async withdraw(
    contractAddress: string,
    withdrawNo: string,
    amount: number,
    signature: string,
  ) {
    if (!this.connector) {
      throw new Error("Provider not initialized");
    }

    try {
      const result = await writeContract(this.wagmiAdapter.wagmiConfig, {
        address: contractAddress as `0x${string}`,
        abi: VaultABI,
        functionName: "withdraw",
        args: [withdrawNo, amount, signature],
      });

      return result;
    } catch (error) {
      console.error("Withdraw failed:", error);
      throw error;
    }
  }

  public static async getToken(contractAddress: string) {
    if (!this.connector) {
      throw new Error("Provider not initialized");
    }

    try {
      const tokenAddress = await readContract(this.wagmiAdapter.wagmiConfig, {
        address: contractAddress as `0x${string}`,
        abi: VaultABI,
        functionName: "getToken",
      });

      return tokenAddress;
    } catch (error) {
      console.error("Get token failed:", error);
      throw error;
    }
  }

  public static async getTokenDecimals(tokenAddress: string) {
    if (!this.connector) {
      throw new Error("Provider not initialized");
    }
    try {
      const config = this.wagmiAdapter.wagmiConfig;
      const decimals = await readContract(config, {
        address: tokenAddress as `0x${string}`,
        abi: TokenABI,
        functionName: "decimals",
      });
      return decimals;
    } catch (error) {
      console.error("Get token decimals failed:", error);
      throw error;
    }
  }

  public static async approveToken(
    tokenAddress: string,
    contractAddress: string,
    amount: number
  ) {
    const config = this.wagmiAdapter.wagmiConfig;
    const decimals = await this.getTokenDecimals(tokenAddress as `0x${string}`);
    const allowWei = (await readContract(config, {
      address: tokenAddress as `0x${string}`,
      abi: TokenABI,
      functionName: "allowance",
      args: [this.getAccountAddress() ?? "", contractAddress],
    })) as bigint;
    const amountWei = parseUnits(amount.toString(), decimals as number);
    if (allowWei < amountWei) {
      const approveResult = await writeContract(config, {
        address: tokenAddress as `0x${string}`,
        abi: TokenABI,
        functionName: "approve",
        args: [contractAddress, amountWei],
      });
      await waitForTransactionReceipt(config, {
        hash: approveResult,
        confirmations: 1,
      });
    }
  }
}

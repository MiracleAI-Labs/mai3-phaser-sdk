import { NinePatchConfig } from "./NinePatchConfig";
import { IProvider } from "@web3auth/base";

export interface ConnectSOLWalletButtonConfig extends NinePatchConfig {
  clientId?: string;
  signMessage?: string;
  mock?: boolean;
  network?: "sapphire_devnet" | "sapphire_mainnet";
  onWalletChange?: (wallet: IProvider | null, address?: string) => void;
  onSigned?: (signMessage: string, signature: ArrayBuffer, address?: string) => void;
}

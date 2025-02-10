import { NinePatchConfig } from "./NinePatchConfig";
import { IProvider } from "@web3auth/base";

export interface ConnectSOLWalletButtonConfig extends NinePatchConfig {
  clientId?: string;
  signMessage?: string;
  network?: "sapphire_devnet" | "sapphire_mainnet";
  onWalletChange?: (wallet: IProvider | null) => void;
  onSigned?: (signMessage: string, signature: ArrayBuffer) => void;
}

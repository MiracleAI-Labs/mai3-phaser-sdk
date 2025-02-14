import { NinePatchConfig } from "./NinePatchConfig";

export interface ConnectSOLWalletButtonConfig extends NinePatchConfig {
  signMessage?: string;
  mock?: boolean;
  network?: "devnet" | "mainnet";
  name?: string;
  description?: string;
  url?: string;
  icon?: string;
  projectId?: string;
  onWalletChange?: (wallet: unknown, address?: string) => void;
  onSigned?: (signMessage: string, signature: string, address?: string) => void;
}

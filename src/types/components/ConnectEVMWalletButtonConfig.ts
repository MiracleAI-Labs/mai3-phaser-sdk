import { NinePatchConfig } from "./NinePatchConfig";

export interface ConnectEVMWalletButtonConfig extends NinePatchConfig {
  signMessage?: string;
  mock?: boolean;
  network?: string;
  name?: string;
  description?: string;
  url?: string;
  icon?: string;
  projectId?: string;
  onWalletChange?: (wallet: unknown, address?: string) => void;
  onSigned?: (signMessage: string, signature: string, address?: string) => void;
}

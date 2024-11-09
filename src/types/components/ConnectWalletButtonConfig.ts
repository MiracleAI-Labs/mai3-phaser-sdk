import { NinePatchConfig } from "./NinePatchConfig";
import { Locales, HandleError } from "../common";
import { Wallet, WalletApp } from "../../game";

export interface ConnectWalletButtonConfig extends NinePatchConfig {
  language?: Locales;
  walletApp?: WalletApp;
  manifestUrl?: string;
  appUrl?: `${string}://${string}` | undefined;
  onWalletChange?: (wallet: Wallet | null) => void;
  onError?: HandleError;
}

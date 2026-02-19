import { number, string } from "zod";

export const SUPPORTED_ASSETS = ["BTC", "SOL", "ETH"];


export type TradingMetadata = {
  type: "SHORT" | "LONG";
  qty: number;
  asset: typeof SUPPORTED_ASSETS[number];
};

export type PriceTriggerMetadata = {
  asset: string;
  price: number;
};

export type TimerNodeMetadata = {
  time: number;
};

export type CredentailTypes = {
  API_KEY: string;
  ACCOUNT_INDEX: number;
  API_KEY_INDEX: number;

}


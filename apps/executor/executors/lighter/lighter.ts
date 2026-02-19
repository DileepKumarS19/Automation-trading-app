import { symbol } from "zod";

import { SignerClient } from "./lighter-sdk/signer";
import { NonceManagerType } from "./lighter-sdk/nonce_manager";
import { CandlestickApi, IsomorphicFetchHttpLibrary, MarketInfo } from "./lighter-sdk/generated"
import { ServerConfiguration } from "./lighter-sdk/servers";

export const MARKETS = {
    "BTC": {
        "marketId": 1,
        "qtyDecimals": 100000,
        "priceDecimals": 10,
    },
     "ETH": {
        "marketId": 0,
        "qtyDecimals": 10000,
        "priceDecimals": 100,
    },
     "SOL": {
        "marketId": 2,
        "qtyDecimals": 1000,
        "priceDecimals": 1000
    },

}

const BASE_URL= process.env.LIGHTER_BASE_URL || "https://mainnet.zklighter.elliot.ai";


export async function executor(asset: "SOL" | "BTC" | "ETH", qty: number, type: "LONG" | "SHORT", API_KEY: string, ACCOUNT_INDEX: number, API_KEY_INDEX: number) {
    // console.log("execting trade on lighter");
    // console.log(`${asset}, ${qty},  ${type}, ${API_KEY}, ${ACCOUNT_INDEX}, ${API_KEY_INDEX}`);

    const marketIndex = MARKETS[asset].marketId;

    const client = await SignerClient.create({
        url: BASE_URL,
        privateKey: API_KEY,
        apiKeyIndex: API_KEY_INDEX,
        accountIndex: ACCOUNT_INDEX,
        nonceManagementType: NonceManagerType.OPTIMISTIC
    });

    const isAsk = type === "SHORT";

    const baseAmount = Math.round(qty * MARKETS[asset].qtyDecimals);

     const candleStickApi = new CandlestickApi({
        baseServer: new ServerConfiguration<{  }>(BASE_URL, {  }),
        httpApi: new IsomorphicFetchHttpLibrary(),
        middleware: [],
        authMethods: {}
    }); 
    const candleStickData = await candleStickApi.candlesticks(marketIndex, '1m', Date.now() - 1000 * 60 * 5, Date.now(), 1, false);
    const latestPrice = candleStickData.candlesticks[candleStickData.candlesticks.length - 1]?.close;
    if (!latestPrice) {
        throw new Error("No latest price found");
    }

    await client.createOrder({
        marketIndex,
        clientOrderIndex: 1,
        baseAmount,
        price: Math.floor((type == "LONG" ? latestPrice * 1.01 : latestPrice * 0.99) * MARKETS[asset].priceDecimals),
        isAsk,
        orderType: SignerClient.ORDER_TYPE_LIMIT,
        timeInForce: SignerClient.ORDER_TIME_IN_FORCE_IMMEDIATE_OR_CANCEL,
        reduceOnly: 0,
        triggerPrice: SignerClient.NIL_TRIGGER_PRICE,
        orderExpiry: SignerClient.DEFAULT_IOC_EXPIRY,
    });



}
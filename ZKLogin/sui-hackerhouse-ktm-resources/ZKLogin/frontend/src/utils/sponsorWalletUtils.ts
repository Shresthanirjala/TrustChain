import { SuiClient } from "@mysten/sui/client";

const FULLNODE_URL = import.meta.env.VITE_APP_SUI_FULLNODE_URL as string;

export async function getSponsorPaymentObject(sponserAddress: string) {
  const suiClient = new SuiClient({ url: FULLNODE_URL });

  let payment: { objectId: string; version: string; digest: string }[] = [];
  let retires = 10;
  while (retires !== 0) {
    const coins = await suiClient.getCoins({
      owner: sponserAddress,
      limit: 10,
    });
    if (coins.data.length > 0) {
      payment = coins.data.map((coin) => ({
        objectId: coin.coinObjectId,
        version: coin.version,
        digest: coin.digest,
      }));
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 200)); // Sleep for 200ms
    retires -= 1;
  }

  return payment;
}

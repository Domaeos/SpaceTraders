import { logInDev } from "@/utils/logInDev";
import axiosClient from "./client";

export default async function sellItems(shipSymbol: string, itemsToSell: { [key: string]: { current: number } }) {

  const filteredItemsToSell = Object.keys(itemsToSell).reduce((acc, key) => {
    if (itemsToSell[key].current > 0) {
      acc.push({ symbol: key, units: itemsToSell[key].current });
    }
    return acc;
  }, [] as { symbol: string, units: number }[]);

  try {

    filteredItemsToSell.forEach(async (item) => {
      const result = await axiosClient.post(`/my/ships/${shipSymbol}/sell`, item);
      logInDev(result);
    });

  } catch (e: any) {
    logInDev(e);
  }
}
import { logInDev } from "@/utils/logInDev";
import axiosClient from "./client";

export default async function buyItems(shipSymbol: string, itemsToBuy: { [key: string]: { current: number } }) {

  const filteredItemsToBuy = Object.keys(itemsToBuy).reduce((acc, key) => {
    if (itemsToBuy[key].current > 0) {
      acc.push({ symbol: key, units: itemsToBuy[key].current });
    }
    return acc;
  }, [] as { symbol: string, units: number }[]);

  try {

    const promises = filteredItemsToBuy.map(async (item) => {
      await axiosClient.post(`/my/ships/${shipSymbol}/purchase`, item);
    });

    await Promise.all(promises);
    return { code: 201 }

  } catch (e: any) {
    logInDev(e);
    return { code: e.response.data.error.code ?? 500 }
  }
}
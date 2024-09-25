import { logInDev } from "@/utils/logInDev";
import axiosClient from "./client";

export default async function deliverItems(contractID: string, contractInfo:
  { shipSymbol: string, tradeSymbol: string, units: number }
) {
  try {
    logInDev("Delivering items");
    logInDev(contractInfo);
    const url = `my/contracts/${contractID}/deliver`;
    await axiosClient.post(url, contractInfo);
    return { code: 200 }
  } catch (e: any) {
    logInDev(e);
    return { code: e.response.data.error.code ?? 500 }
  }
}
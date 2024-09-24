import { logInDev } from "@/utils/logInDev";
import axiosClient from "./client";

export default async function shipNavigation(shipSymbol: string, waypointSymbol: string) {
  try {
    const url = `my/ships/${shipSymbol}/navigate`
    await axiosClient.post(url, { waypointSymbol });
    return { code: 200 }
  } catch(e: any) {
    logInDev(e);
    return { code: e.response.data.error.code ?? 500 }
  }
}
import { logInDev } from "@/utils/logInDev";
import axiosClient from "./client";
import getSystem from "@/utils/getSystem";

export default async function fetchWaypoint(symbol: string, system?: string) {
  try {
    const url = `systems/${system ?? getSystem(symbol)}/waypoints/${symbol}`;
    const result = await axiosClient.get(url);
    return result.data.data;
  } catch(e: any) {
    logInDev(e);
    return e;
  }
}
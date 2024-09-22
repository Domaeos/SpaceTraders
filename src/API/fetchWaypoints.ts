import { logInDev } from "@/utils/logInDev";
import axiosClient from "./client";

export default async function fetchWaypoints(systemSymbol: string, traits: string) {
  try {
    const url = `systems/${systemSymbol}/waypoints?${traits && "traits=" + (traits === "ALL" ? "" : traits)}`;
    const result = await axiosClient.get(url);
    return result.data.data;
  } catch(e: any) {
    logInDev(e);
    return e;
  }
}
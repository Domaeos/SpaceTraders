import { logInDev } from "@/utils/logInDev";
import axiosClient from "./client";

export default async function fetchShips(system: string, coords: string) {
  try {
    if (system && coords) {
      const result = await axiosClient.get(`systems/${system}/waypoints/${coords}/shipyard`);
      return result.data.data;
    }
  } catch(e: any) {
    logInDev(e);
  }
}
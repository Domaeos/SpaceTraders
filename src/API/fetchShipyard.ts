import { logInDev } from "@/utils/logInDev";
import axiosClient from "./client";
import getSystem from "@/utils/getSystem";

export default async function fetchShipyard(waypoint: string) {
  try {
      const result = await axiosClient.get(`systems/${getSystem(waypoint)}/waypoints/${waypoint}/shipyard`);
      return result.data.data;
  } catch(e: any) {
    logInDev(e);
  }
}
import { logInDev } from "@/utils/logInDev";
import axiosClient from "./client";

export default async function fetchShips() {
  try {
    const result = await axiosClient.get(`my/ships`);
    logInDev(result.data.data);
    return result.data.data;
  } catch (e: any) {
    logInDev(e);
  }
}
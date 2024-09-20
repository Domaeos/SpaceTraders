import { logInDev } from "@/utils/logInDev";
import axiosClient from "./client";

export async function fetchContracts() {
  try {
    const result = await axiosClient.get("my/contracts");
    return result.data.data;
  } catch (e) {
    logInDev(e);
  }
}
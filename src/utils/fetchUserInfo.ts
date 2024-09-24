import axiosClient from "@/API/client";
import { logInDev } from "./logInDev";

export default async function fetchUserInfo() {
  try {
    const result = await axiosClient.get("my/agent");
    logInDev(result);
    return result.data.data;
  } catch (e: any) {
    return {};
  }
}
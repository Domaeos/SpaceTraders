import { logInDev } from "@/utils/logInDev";
import axiosClient from "./client";

export default async function fullfillContract(contractID: string) {
  try {
    logInDev("Fulfilling contract");
    logInDev(contractID);

    await axiosClient.post(`my/contracts/${contractID}/fulfill`);
    return { code: 200 }
  } catch (e: any) {
    return { code: 500 }
  }
}
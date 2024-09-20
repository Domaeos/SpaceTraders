import { logInDev } from "@/utils/logInDev";
import axiosClient from "./client";

export default async function acceptContract(id: string) {
  try {
    const result = await axiosClient.post(`my/contracts/${id}/accept`);
    logInDev(result);
    return result;
  } catch(e: any) {
    return e;
  }
}
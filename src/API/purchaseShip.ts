import axiosClient from "@/API/client";
import { logInDev } from "@/utils/logInDev";

export default async function purchaseShip(shipType: string, waypointSymbol: string) {
  try {
    const myInfo = await axiosClient.get("my/agent");
    logInDev("myInfo");
    logInDev(myInfo);
    const result = await axiosClient.post("my/ships", { shipType, waypointSymbol });
    logInDev(result);
    return true;
  } catch(e: any) {
    return false;
  }
}
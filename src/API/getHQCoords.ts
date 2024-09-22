import { logInDev } from "@/utils/logInDev";
import axiosClient from "./client";

export default async function getHQCoords() {
  try {
    const agentInfo = await axiosClient.get("my/agent");
    logInDev("Agent data: " + JSON.stringify(agentInfo.data.data));
    return agentInfo.data.data.headquarters;
  } catch (e) {
    return e;
  }
}
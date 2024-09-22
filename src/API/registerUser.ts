import axiosClient from "./client";
import { IRegisterUser } from "@/Types/types";
import { logInDev } from "@/utils/logInDev";
import { AxiosError, AxiosResponse } from "axios";

export default async function registerUser(user: IRegisterUser): Promise<AxiosError | AxiosResponse> {
  logInDev("Registering: " + user.symbol);
  axiosClient.defaults.headers.common['Authorization'] = "";
  try {
    return await axiosClient.post("register", user);
  } catch(e: any) {
    return e;
  }
}